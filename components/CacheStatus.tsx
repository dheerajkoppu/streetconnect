"use client";

import { useEffect, useState } from "react";
import { getCacheTimestamp } from "@/lib/cache";

interface CacheStatusProps {
  isOffline: boolean;
}

export function CacheStatus({ isOffline }: CacheStatusProps) {
  const [timestamp, setTimestamp] = useState<string | null>(null);

  useEffect(() => {
    setTimestamp(getCacheTimestamp());
  }, []);

  if (!isOffline && !timestamp) return null;

  return (
    <div
      className={`text-sm px-4 py-2.5 rounded-xl font-medium inline-flex items-center gap-2 ${
        isOffline
          ? "bg-[var(--warning-bg)] text-[var(--warning-text)]"
          : "bg-slate-100 text-slate-600"
      }`}
      role="status"
    >
      {isOffline ? (
        <>
          <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" aria-hidden="true" />
          <span>Offline - showing saved data</span>
        </>
      ) : (
        timestamp && <span>Last updated: {timestamp}</span>
      )}
    </div>
  );
}
