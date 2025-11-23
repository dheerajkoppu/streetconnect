"use client";

import { Service } from "@/types";
import { ServiceCard } from "./ServiceCard";

interface ServiceListProps {
  services: Service[];
  userLocation: { lat: number; lng: number } | null;
  isLoading?: boolean;
}

export function ServiceList({
  services,
  userLocation,
  isLoading,
}: ServiceListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4" aria-label="Loading services">
        {[1, 2, 3].map((i) => (
          <div key={i} className="service-card p-5 space-y-4" aria-hidden="true">
            <div className="flex justify-between items-start gap-4">
              <div className="skeleton h-7 w-3/4 rounded-lg" />
              <div className="skeleton h-5 w-16 rounded-lg" />
            </div>
            <div className="flex gap-2">
              <div className="skeleton h-6 w-20 rounded-full" />
              <div className="skeleton h-6 w-24 rounded-full" />
            </div>
            <div className="skeleton h-5 w-24 rounded-full" />
            <div className="space-y-2">
              <div className="skeleton h-5 w-full rounded" />
              <div className="skeleton h-5 w-2/3 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="empty-state" role="status">
        <div className="empty-state-icon" aria-hidden="true">🔍</div>
        <h3 className="empty-state-title">No services found</h3>
        <p className="empty-state-text">
          Try removing some filters or searching for something different.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-slate-500 px-1" role="status">
        {services.length} service{services.length !== 1 ? "s" : ""} found
      </p>
      <div className="space-y-4">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            userLocation={userLocation}
          />
        ))}
      </div>
    </div>
  );
}
