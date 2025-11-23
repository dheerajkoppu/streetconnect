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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" aria-label="Loading services">
        {/* Loading skeleton cards */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card-elevated p-5 space-y-4" aria-hidden="true">
            {/* Title and distance row */}
            <div className="flex justify-between items-start gap-4">
              <div className="skeleton h-6 w-3/4 rounded-lg" />
              <div className="skeleton h-5 w-14 rounded-lg" />
            </div>
            {/* Tags row */}
            <div className="flex gap-2">
              <div className="skeleton h-6 w-16 rounded-md" />
              <div className="skeleton h-6 w-20 rounded-lg" />
            </div>
            {/* Description */}
            <div className="space-y-2">
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-2/3 rounded" />
            </div>
            {/* Meta */}
            <div className="skeleton h-4 w-32 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="card-elevated p-8 text-center" role="status">
        <div className="text-5xl mb-4 opacity-70" aria-hidden="true">
          🔍
        </div>
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
          No services found
        </h3>
        <p className="text-[var(--text-secondary)] max-w-xs mx-auto">
          Try removing some filters or searching for something different.
        </p>
      </div>
    );
  }

  return (
    <section id="service-list" aria-label="Service results">
      {/* Results header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <p className="text-sm font-semibold text-[var(--text-secondary)]" role="status">
          {services.length} service{services.length !== 1 ? "s" : ""} found
        </p>
        <p className="text-xs text-[var(--text-muted)]">
          Updated today
        </p>
      </div>

      {/* Service cards - responsive grid on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            userLocation={userLocation}
          />
        ))}
      </div>
    </section>
  );
}
