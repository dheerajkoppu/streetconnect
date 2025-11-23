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
    <article className="service-card">
      {/* Main card content - tappable to go to detail */}
      <Link href={`/services/${service.id}`} className="block service-card-content">
        {/* Title and distance row */}
        <div className="flex justify-between items-start gap-3 mb-3">
          <h3 className="service-card-title">{service.name}</h3>
          {distance !== null && (
            <span className="text-sm font-semibold text-slate-500 whitespace-nowrap bg-slate-100 px-2 py-1 rounded-lg">
              {formatDistance(distance)}
            </span>
          )}
        </div>

        {/* Category tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {service.categories.slice(0, 3).map((cat) => (
            <span key={cat} className="tag tag-category">
              {getCategoryLabel(cat)}
            </span>
          ))}
        </div>

        {/* Open status - prominent display */}
        <div className="mb-3">
          <span
            className={`
              inline-block px-3 py-1.5 rounded-lg text-sm
              ${openStatus.color === "green" ? "status-open" : ""}
              ${openStatus.color === "red" ? "status-closed" : ""}
              ${openStatus.color === "yellow" ? "status-closing" : ""}
            `}
          >
            {openStatus.text}
          </span>
        </div>

        {/* Description */}
        <p className="service-card-description line-clamp-2">
          {service.descriptionShort}
        </p>
      </Link>

      {/* Action buttons - large tap targets */}
      <div className="flex border-t-2 border-slate-100">
        {service.phone && (
          <a
            href={`tel:${service.phone}`}
            className="action-btn text-[var(--primary)] hover:bg-blue-50 active:bg-blue-100"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
          className={`action-btn text-[var(--primary)] hover:bg-blue-50 active:bg-blue-100 ${service.phone ? "border-l-2 border-slate-100" : ""}`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
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

      {/* Expandable details toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-3 px-5 text-sm font-medium text-slate-500 hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center gap-2 border-t-2 border-slate-100 transition-colors"
        aria-expanded={isExpanded}
        aria-controls={`details-${service.id}`}
      >
        {isExpanded ? "Show less" : "Show more"}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Expandable details section */}
      {isExpanded && (
        <div
          id={`details-${service.id}`}
          className="px-5 pb-5 space-y-4 border-t-2 border-slate-100 pt-4 animate-fade-in"
        >
          {/* Address */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-1">Address</h4>
            <address className="text-slate-600 not-italic leading-relaxed">
              {service.address.street}
              <br />
              {service.address.city}, {service.address.state}{" "}
              {service.address.postalCode}
            </address>
          </div>

          {/* Today's hours */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-1">Today&apos;s hours</h4>
            <p className="text-slate-600">
              {formatDayHours(getTodayHours(service.hours))}
            </p>
          </div>

          {/* Eligibility */}
          {service.eligibility.description && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-1">Who can come</h4>
              <p className="text-slate-600">{service.eligibility.description}</p>
            </div>
          )}

          {/* Quick features */}
          <div className="flex flex-wrap gap-2">
            {service.flags.noIDRequired && (
              <span className="tag tag-feature">No ID needed</span>
            )}
            {service.flags.lowBarrier && (
              <span className="tag tag-feature">Low barrier</span>
            )}
            {service.accessibility.wheelchairAccessible && (
              <span className="tag tag-feature">Wheelchair OK</span>
            )}
            {service.accessibility.petsAllowed && (
              <span className="tag tag-feature">Pets OK</span>
            )}
          </div>

          {/* Notes */}
          {service.notes.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">What to know</h4>
              <ul className="space-y-1.5">
                {service.notes.slice(0, 3).map((note, i) => (
                  <li key={i} className="flex gap-2 text-slate-600">
                    <span className="text-[var(--primary)] flex-shrink-0">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
