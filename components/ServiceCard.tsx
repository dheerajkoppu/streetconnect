"use client";

import { useState } from "react";
import Link from "next/link";
import { Service } from "@/types";
import { getOpenStatusText, formatDayHours, getTodayHours } from "@/lib/hours";
import { formatDistance, calculateDistance } from "@/lib/location";
import { getCategoryLabel } from "@/lib/categories";

interface ServiceCardProps {
  service: Service;
  userLocation: { lat: number; lng: number } | null;
}

export function ServiceCard({ service, userLocation }: ServiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const openStatus = getOpenStatusText(service.hours);

  const distance =
    userLocation && service.address.lat && service.address.lng
      ? calculateDistance(
          userLocation.lat,
          userLocation.lng,
          service.address.lat,
          service.address.lng
        )
      : null;

  const mapsUrl = service.address.lat && service.address.lng
    ? `https://www.google.com/maps/dir/?api=1&destination=${service.address.lat},${service.address.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${service.address.street}, ${service.address.city}, ${service.address.state} ${service.address.postalCode}`
      )}`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Main card content - tappable to go to detail */}
      <Link href={`/services/${service.id}`} className="block p-4">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
            {service.name}
          </h3>
          {distance !== null && (
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {formatDistance(distance)}
            </span>
          )}
        </div>

        {/* Category tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {service.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {getCategoryLabel(cat)}
            </span>
          ))}
        </div>

        {/* Open status */}
        <div className="mb-2">
          <span
            className={`
              inline-block px-2 py-0.5 rounded-full text-xs font-medium
              ${openStatus.color === "green" ? "status-open" : ""}
              ${openStatus.color === "red" ? "status-closed" : ""}
              ${openStatus.color === "yellow" ? "status-closing" : ""}
            `}
          >
            {openStatus.text}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {service.descriptionShort}
        </p>
      </Link>

      {/* Action buttons */}
      <div className="flex border-t border-gray-100">
        {service.phone && (
          <a
            href={`tel:${service.phone}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-blue-600 font-medium hover:bg-blue-50 active:bg-blue-100 transition-colors"
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
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            Call
          </a>
        )}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 text-blue-600 font-medium hover:bg-blue-50 active:bg-blue-100 transition-colors border-l border-gray-100"
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
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Directions
        </a>
      </div>

      {/* Expandable details */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-2 px-4 text-sm text-gray-500 hover:bg-gray-50 flex items-center justify-center gap-1 border-t border-gray-100"
      >
        {isExpanded ? "Less info" : "More info"}
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 text-sm border-t border-gray-100 pt-3">
          {/* Address */}
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Address</h4>
            <p className="text-gray-600">
              {service.address.street}
              <br />
              {service.address.city}, {service.address.state}{" "}
              {service.address.postalCode}
            </p>
          </div>

          {/* Today's hours */}
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Hours today</h4>
            <p className="text-gray-600">
              {formatDayHours(getTodayHours(service.hours))}
            </p>
          </div>

          {/* Eligibility */}
          {service.eligibility.description && (
            <div>
              <h4 className="font-medium text-gray-700 mb-1">Who can come</h4>
              <p className="text-gray-600">{service.eligibility.description}</p>
            </div>
          )}

          {/* Notes */}
          {service.notes.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-1">
                What to know
              </h4>
              <ul className="text-gray-600 space-y-1">
                {service.notes.slice(0, 3).map((note, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-gray-400">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
