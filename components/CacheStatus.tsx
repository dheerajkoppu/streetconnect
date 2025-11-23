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
      className={`text-xs px-3 py-1.5 rounded-full ${
        isOffline
          ? "bg-yellow-100 text-yellow-800"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {isOffline ? (
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-yellow-500 rounded-full" />
          Offline - showing cached data
        </span>
      ) : (
        timestamp && <span>Updated: {timestamp}</span>
      )}
    </div>
  );
}
