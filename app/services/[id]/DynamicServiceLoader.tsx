"use client";

import { useState, useEffect } from "react";
import { Service } from "@/types";
import { getCachedService, isOsmService } from "@/lib/serviceCache";
import { ServiceDetailClient } from "./ServiceDetailClient";
import Link from "next/link";

interface DynamicServiceLoaderProps {
  serviceId: string;
  staticService: Service | null;
}

export function DynamicServiceLoader({
  serviceId,
  staticService,
}: DynamicServiceLoaderProps) {
  const [service, setService] = useState<Service | null>(staticService);
  const [isLoading, setIsLoading] = useState(!staticService && isOsmService(serviceId));
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // If we already have a static service, use it
    if (staticService) {
      setService(staticService);
      setIsLoading(false);
      return;
    }

    // For OSM services, try to load from cache
    if (isOsmService(serviceId)) {
      const cachedService = getCachedService(serviceId);
      if (cachedService) {
        setService(cachedService);
        setIsLoading(false);
      } else {
        setNotFound(true);
        setIsLoading(false);
      }
    } else {
      // Not an OSM service and no static service found
      setNotFound(true);
      setIsLoading(false);
    }
  }, [serviceId, staticService]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <svg
            className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--primary)]"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-[var(--text-muted)]">Loading service...</p>
        </div>
      </div>
    );
  }

  if (notFound || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Service not found
          </h1>
          <p className="text-gray-600 mb-6">
            {isOsmService(serviceId)
              ? "This service was loaded from OpenStreetMap and is no longer in your session. Please search for it again from the home page."
              : "Sorry, we couldn't find that service. It may have been removed or the link might be incorrect."}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return <ServiceDetailClient service={service} />;
}
