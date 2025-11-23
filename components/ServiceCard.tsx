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

  // Determine status badge class
  const statusBadgeClass =
    openStatus.color === "green"
      ? "badge-open"
      : openStatus.color === "red"
      ? "badge-closed"
      : "badge-closing";

  return (
    <article className="service-card card-interactive">
      {/* Main card content - tappable to go to detail */}
      <Link href={`/services/${service.id}`} className="block service-card-content">
        {/* Top row: Name and distance */}
        <div className="flex justify-between items-start gap-3 mb-3">
          <h3 className="service-card-title flex-1">{service.name}</h3>
          {distance !== null && (
            <span className="badge-distance whitespace-nowrap flex-shrink-0">
              {formatDistance(distance)}
            </span>
          )}
        </div>

        {/* Category and status row */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {/* Category badges */}
          {service.categories.slice(0, 2).map((cat) => (
            <span key={cat} className="tag-category">
              {getCategoryLabel(cat)}
            </span>
          ))}

          {/* Status badge */}
          <span className={`badge-status ${statusBadgeClass}`}>
            {openStatus.color === "green" && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
            )}
            {openStatus.text}
          </span>
        </div>

        {/* Description - 2 lines max */}
        <p className="service-card-description line-clamp-2 mb-3">
          {service.descriptionShort}
        </p>

        {/* Meta: Today's hours */}
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="10" strokeWidth={2} />
            <path strokeLinecap="round" strokeWidth={2} d="M12 6v6l4 2" />
          </svg>
          <span>Today: {formatDayHours(getTodayHours(service.hours))}</span>
        </div>
      </Link>

      {/* Action buttons row */}
      <div className="flex border-t border-[var(--border-default)]">
        {service.phone && (
          <a
            href={`tel:${service.phone}`}
            className="action-btn border-r border-[var(--border-default)]"
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
          className="action-btn"
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
        className="w-full py-3 px-5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--slate-50)] active:bg-[var(--slate-100)] flex items-center justify-center gap-2 border-t border-[var(--border-default)] transition-colors"
        aria-expanded={isExpanded}
        aria-controls={`details-${service.id}`}
      >
        {isExpanded ? "Show less" : "More details"}
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
          className="service-card-details animate-fade-in"
        >
          <div className="space-y-4">
            {/* Address */}
            <div>
              <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1">
                Address
              </h4>
              <address className="text-sm text-[var(--text-secondary)] not-italic leading-relaxed">
                {service.address.street}
                <br />
                {service.address.city}, {service.address.state}{" "}
                {service.address.postalCode}
              </address>
            </div>

            {/* Today's hours */}
            <div>
              <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1">
                Today&apos;s Hours
              </h4>
              <p className="text-sm text-[var(--text-secondary)]">
                {formatDayHours(getTodayHours(service.hours))}
              </p>
            </div>

            {/* Eligibility */}
            {service.eligibility.description && (
              <div>
                <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1">
                  Who Can Come
                </h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  {service.eligibility.description}
                </p>
              </div>
            )}

            {/* Feature tags */}
            {(service.flags.noIDRequired ||
              service.flags.lowBarrier ||
              service.accessibility.wheelchairAccessible ||
              service.accessibility.petsAllowed) && (
              <div className="flex flex-wrap gap-2">
                {service.flags.noIDRequired && (
                  <span className="tag-feature">No ID needed</span>
                )}
                {service.flags.lowBarrier && (
                  <span className="tag-feature">Low barrier</span>
                )}
                {service.accessibility.wheelchairAccessible && (
                  <span className="tag-feature">Wheelchair OK</span>
                )}
                {service.accessibility.petsAllowed && (
                  <span className="tag-feature">Pets OK</span>
                )}
              </div>
            )}

            {/* Notes */}
            {service.notes.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">
                  What to Know
                </h4>
                <ul className="space-y-1.5">
                  {service.notes.slice(0, 3).map((note, i) => (
                    <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
                      <span className="text-[var(--primary-500)] flex-shrink-0">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* View full details link */}
            <Link
              href={`/services/${service.id}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--interactive-primary)] hover:underline mt-2"
            >
              View full details
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </article>
  );
}
