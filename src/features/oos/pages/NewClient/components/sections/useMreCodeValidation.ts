import { useEffect, useRef, useState } from "react";
import { oosClientAPI } from "../../../../../../api/client";

export const MRE_CODE_REGEX = /^(MRE|EU)-\d{3,}$/;

type BackendStatus =
  | { kind: "idle" }
  | { kind: "validating"; code: string }
  | { kind: "valid"; code: string }
  | { kind: "invalid-taken"; code: string }
  | { kind: "error"; code: string };

export type MreValidationStatus =
  | "empty"
  | "invalid-format"
  | "validating"
  | "valid"
  | "invalid-taken"
  | "error";

const DEBOUNCE_MS = 400;

export default function useMreCodeValidation(
  code: string | null | undefined,
  clientId?: string | null,
) {
  const trimmed = (code ?? "").trim();
  const isEmpty = !trimmed;
  const hasValidFormat = !isEmpty && MRE_CODE_REGEX.test(trimmed);

  const [backendStatus, setBackendStatus] = useState<BackendStatus>({ kind: "idle" });
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!hasValidFormat) return;

    const myRequestId = ++requestIdRef.current;

    const timer = setTimeout(async () => {
      try {
        const res = await oosClientAPI.validateMreCode(
          trimmed,
          clientId ?? undefined,
        );
        if (myRequestId !== requestIdRef.current) return;
        setBackendStatus({
          kind: res.isValid ? "valid" : "invalid-taken",
          code: trimmed,
        });
      } catch {
        if (myRequestId !== requestIdRef.current) return;
        setBackendStatus({ kind: "error", code: trimmed });
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [trimmed, clientId, hasValidFormat]);

  const status: MreValidationStatus = isEmpty
    ? "empty"
    : !hasValidFormat
      ? "invalid-format"
      : backendStatus.kind !== "idle" && backendStatus.code === trimmed
        ? backendStatus.kind
        : "validating";

  const errorMessage =
    status === "invalid-format"
      ? "Invalid format. Must be MRE- or EU- followed by at least 3 digits (e.g. MRE-001, EU-001)."
      : status === "invalid-taken"
        ? "This MRE code is already in use."
        : status === "error"
          ? "Could not validate MRE code. Please try again."
          : null;

  return {
    status,
    error: errorMessage,
    isValid: status === "valid",
  };
}
