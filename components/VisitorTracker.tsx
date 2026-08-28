"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track once per page session / on mount
    try {
      fetch("/api/notify-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: pathname,
          referrer: typeof document !== "undefined" ? document.referrer : "",
        }),
      }).catch(() => {
        // Silently ignore any network issues
      });
    } catch {
      // Non-blocking
    }
  }, [pathname]);

  return null;
}
