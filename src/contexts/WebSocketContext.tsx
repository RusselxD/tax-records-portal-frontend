import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { tokenStorage } from "../lib/token-storage";
import { refreshAccessToken } from "../api/axios-config";
import { captureException } from "../lib/sentry";

export type WebSocketStatus = "idle" | "connecting" | "open" | "closed";

export interface WebSocketMessage<T = unknown> {
  type: string;
  payload: T;
  timestamp: string;
}

type Handler = (message: WebSocketMessage) => void;

interface WebSocketContextValue {
  status: WebSocketStatus;
  subscribe: (type: string, handler: Handler) => () => void;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 30000;
const TOKEN_EXPIRED_CODE = 1008;

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [status, setStatus] = useState<WebSocketStatus>("idle");

  const socketRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Map<string, Set<Handler>>>(new Map());
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef<number | null>(null);
  const intentionallyClosedRef = useRef(false);

  const subscribe = useCallback((type: string, handler: Handler) => {
    let set = handlersRef.current.get(type);
    if (!set) {
      set = new Set();
      handlersRef.current.set(type, set);
    }
    set.add(handler);
    return () => {
      const s = handlersRef.current.get(type);
      if (!s) return;
      s.delete(handler);
      if (s.size === 0) handlersRef.current.delete(type);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      intentionallyClosedRef.current = true;
      if (reconnectTimerRef.current != null) {
        window.clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      socketRef.current?.close();
      socketRef.current = null;
      setStatus("idle");
      return;
    }

    intentionallyClosedRef.current = false;

    const scheduleReconnect = () => {
      if (intentionallyClosedRef.current) return;
      const attempt = reconnectAttemptsRef.current;
      const delay = Math.min(RECONNECT_BASE_MS * 2 ** attempt, RECONNECT_MAX_MS);
      reconnectAttemptsRef.current = attempt + 1;
      reconnectTimerRef.current = window.setTimeout(connect, delay);
    };

    const connect = async () => {
      if (intentionallyClosedRef.current) return;
      const token = tokenStorage.getAccessToken();
      if (!token) return;

      const base = import.meta.env.VITE_API_WS_URL;
      const url = `${base}?token=${encodeURIComponent(token)}`;

      setStatus("connecting");
      let socket: WebSocket;
      try {
        socket = new WebSocket(url);
      } catch (err) {
        captureException(err, { source: "WebSocket construct" });
        scheduleReconnect();
        return;
      }
      socketRef.current = socket;

      socket.onopen = () => {
        reconnectAttemptsRef.current = 0;
        setStatus("open");
      };

      socket.onmessage = (event) => {
        let msg: WebSocketMessage;
        try {
          msg = JSON.parse(event.data);
        } catch {
          console.warn("[ws] Non-JSON frame:", event.data);
          return;
        }
        const set = handlersRef.current.get(msg.type);
        if (!set) return;
        set.forEach((h) => {
          try {
            h(msg);
          } catch (err) {
            captureException(err, { source: "WebSocket handler" });
          }
        });
      };

      socket.onerror = () => {
        // errors are followed by onclose; reconnect is handled there
      };

      socket.onclose = (event) => {
        socketRef.current = null;
        setStatus("closed");
        if (intentionallyClosedRef.current) return;

        if (event.code === TOKEN_EXPIRED_CODE) {
          // Refresh token, then reconnect without backoff
          refreshAccessToken()
            .then(() => {
              reconnectAttemptsRef.current = 0;
              connect();
            })
            .catch((err) => {
              captureException(err, { source: "WebSocket token refresh" });
              scheduleReconnect();
            });
          return;
        }

        scheduleReconnect();
      };
    };

    connect();

    return () => {
      intentionallyClosedRef.current = true;
      if (reconnectTimerRef.current != null) {
        window.clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [user]);

  const value = useMemo(() => ({ status, subscribe }), [status, subscribe]);

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const ctx = useContext(WebSocketContext);
  if (!ctx) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return ctx;
}
