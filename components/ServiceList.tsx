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
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-4 space-y-3">
            <div className="skeleton h-6 w-3/4 rounded" />
            <div className="skeleton h-4 w-1/2 rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-2/3 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No services found
        </h3>
        <p className="text-gray-600">
          Try removing some filters or searching for something else.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        {services.length} service{services.length !== 1 ? "s" : ""} found
      </p>
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          userLocation={userLocation}
        />
      ))}
    </div>
  );
}
