import { useSyncExternalStore } from "react";
import {
  getDeferredPrompt,
  subscribePwaInstall,
  triggerPwaInstall,
  isStandalone,
} from "../lib/pwa-install";

export function usePwaInstall() {
  const prompt = useSyncExternalStore(
    subscribePwaInstall,
    getDeferredPrompt,
    () => null,
  );
  return {
    canInstall: !!prompt && !isStandalone(),
    install: triggerPwaInstall,
  };
}
