"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Service } from "@/types";
import { getOpenStatusText, getHoursTable } from "@/lib/hours";
import { getCategoryLabel } from "@/lib/categories";
import { loadUserLocation, formatDistance, calculateDistance } from "@/lib/location";
import { useChatContext } from "@/lib/ChatContext";

interface ServiceDetailClientProps {
  service: Service;
}

export function ServiceDetailClient({ service }: ServiceDetailClientProps) {
  const [copied, setCopied] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const { setSelectedService } = useChatContext();

  const openStatus = getOpenStatusText(service.hours);
  const hoursTable = getHoursTable(service.hours);

  // Set this service as the selected service for chat context (only on mount/unmount)
  useEffect(() => {
    setSelectedService(service);
    return () => setSelectedService(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service.id]);

  useEffect(() => {
    const location = loadUserLocation();
    if (location && service.address.lat && service.address.lng) {
      const dist = calculateDistance(
        location.lat,
        location.lng,
        service.address.lat,
        service.address.lng
      );
      setDistance(dist);
    }
  }, [service.address.lat, service.address.lng]);

  const mapsUrl =
    service.address.lat && service.address.lng
      ? `https://www.google.com/maps/dir/?api=1&destination=${service.address.lat},${service.address.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${service.address.street}, ${service.address.city}, ${service.address.state} ${service.address.postalCode}`
        )}`;

  const handleShare = async () => {
    const url = window.location.href;
    const text = `${service.name} - Find help at StreetConnect`;

    if (navigator.share) {
      try {
        await navigator.share({ title: service.name, text, url });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="header safe-area-top sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center w-12 h-12 -ml-2 hover:bg-white/10 active:bg-white/20 rounded-xl transition-colors"
            aria-label="Go back home"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-lg font-bold truncate flex-1">{service.name}</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="px-5 py-5 space-y-4 safe-area-bottom">
        {/* Status and key info card */}
        <div className="card p-5">
          {/* Status and distance row */}
          <div className="flex items-center justify-between mb-4">
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
            {distance !== null && (
              <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                {formatDistance(distance)} away
              </span>
            )}
          </div>

          {/* Category tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {service.categories.map((cat) => (
              <span key={cat} className="tag tag-category">
                {getCategoryLabel(cat)}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-slate-700 leading-relaxed">
            {service.descriptionLong || service.descriptionShort}
          </p>
        </div>

        {/* Action buttons - large and prominent */}
        <div className="flex gap-3">
          {service.phone && (
            <a
              href={`tel:${service.phone}`}
              className="btn btn-primary flex-1"
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
            className="btn btn-secondary flex-1"
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

        {/* Share button */}
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 py-3.5 text-slate-600 font-medium hover:bg-white active:bg-slate-100 rounded-xl transition-colors"
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
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          {copied ? "Link copied!" : "Share this service"}
        </button>

        {/* Address */}
        <section className="card p-5">
          <h2 className="font-bold text-slate-900 mb-3">Address</h2>
          <address className="not-italic text-slate-700 leading-relaxed">
            {service.address.street}
            <br />
            {service.address.city}, {service.address.state}{" "}
            {service.address.postalCode}
          </address>
          {service.phone && (
            <p className="mt-3 text-slate-700">
              Phone:{" "}
              <a href={`tel:${service.phone}`} className="text-[var(--primary)] font-medium">
                {service.phone}
              </a>
            </p>
          )}
          {service.website && (
            <p className="mt-2">
              <a
                href={service.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--primary)] font-medium hover:underline"
              >
                Visit website
              </a>
            </p>
          )}
        </section>

        {/* Hours */}
        <section className="card p-5">
          <h2 className="font-bold text-slate-900 mb-4">Hours</h2>
          <div className="space-y-2.5">
            {hoursTable.map((row) => (
              <div
                key={row.day}
                className={`flex justify-between py-1.5 ${
                  row.isToday
                    ? "font-semibold text-[var(--primary)] bg-[var(--primary-light)] px-3 -mx-3 rounded-lg"
                    : "text-slate-700"
                }`}
              >
                <span>{row.dayFull}</span>
                <span>{row.hours}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Eligibility */}
        <section className="card p-5">
          <h2 className="font-bold text-slate-900 mb-3">Who can come</h2>
          {service.eligibility.description && (
            <p className="text-slate-700 mb-4 leading-relaxed">{service.eligibility.description}</p>
          )}
          <div className="space-y-2.5">
            {service.eligibility.minAge && (
              <div className="flex gap-3">
                <span className="text-slate-500 font-medium">Age:</span>
                <span className="text-slate-700">
                  {service.eligibility.minAge}
                  {service.eligibility.maxAge
                    ? ` - ${service.eligibility.maxAge}`
                    : "+"}{" "}
                  years
                </span>
              </div>
            )}
            {service.eligibility.genderRestrictions &&
              service.eligibility.genderRestrictions !== "all_genders" && (
                <div className="flex gap-3">
                  <span className="text-slate-500 font-medium">Gender:</span>
                  <span className="text-slate-700">
                    {service.eligibility.genderRestrictions === "women_only"
                      ? "Women only"
                      : "Men only"}
                  </span>
                </div>
              )}
            {service.eligibility.requiresSobriety && (
              <div className="flex gap-3 items-center bg-[var(--warning-bg)] text-[var(--warning-text)] px-3 py-2 rounded-lg -mx-1">
                <span aria-hidden="true">⚠️</span>
                <span className="font-medium">Requires sobriety</span>
              </div>
            )}
          </div>
        </section>

        {/* Accessibility & Features */}
        <section className="card p-5">
          <h2 className="font-bold text-slate-900 mb-4">Features</h2>
          <div className="flex flex-wrap gap-2">
            {service.accessibility.wheelchairAccessible && (
              <span className="tag tag-feature">Wheelchair OK</span>
            )}
            {service.accessibility.petsAllowed && (
              <span className="tag tag-feature">Pets allowed</span>
            )}
            {service.accessibility.serviceAnimalsAllowed && (
              <span className="tag tag-category">Service animals OK</span>
            )}
            {service.flags.noIDRequired && (
              <span className="tag tag-feature">No ID needed</span>
            )}
            {service.flags.lowBarrier && (
              <span className="tag tag-feature">Low barrier</span>
            )}
          </div>
          {service.accessibility.languages &&
            service.accessibility.languages.length > 0 && (
              <p className="mt-4 text-sm text-slate-600">
                <span className="font-medium">Languages:</span>{" "}
                {service.accessibility.languages.join(", ")}
              </p>
            )}
        </section>

        {/* Notes */}
        {service.notes.length > 0 && (
          <section className="card p-5">
            <h2 className="font-bold text-slate-900 mb-4">What to know</h2>
            <ul className="space-y-3">
              {service.notes.map((note, i) => (
                <li key={i} className="flex gap-3 text-slate-700">
                  <span className="text-[var(--primary)] flex-shrink-0 font-bold">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Last verified */}
        {service.lastVerified && (
          <p className="text-xs text-slate-400 text-center pt-2">
            Last verified:{" "}
            {new Date(service.lastVerified).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </main>
    </div>
  );
}
