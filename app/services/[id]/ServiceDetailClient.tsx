"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Service } from "@/types";
import { getOpenStatusText, getHoursTable } from "@/lib/hours";
import { getCategoryLabel } from "@/lib/categories";
import { loadUserLocation, formatDistance, calculateDistance } from "@/lib/location";

interface ServiceDetailClientProps {
  service: Service;
}

export function ServiceDetailClient({ service }: ServiceDetailClientProps) {
  const [copied, setCopied] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);

  const openStatus = getOpenStatusText(service.hours);
  const hoursTable = getHoursTable(service.hours);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white px-4 py-4 safe-area-top">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 -ml-2 hover:bg-blue-700 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold truncate">{service.name}</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="px-4 py-4 space-y-4 pb-8 safe-area-bottom">
        {/* Status and distance */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span
              className={`
                inline-block px-3 py-1 rounded-full text-sm font-medium
                ${openStatus.color === "green" ? "status-open" : ""}
                ${openStatus.color === "red" ? "status-closed" : ""}
                ${openStatus.color === "yellow" ? "status-closing" : ""}
              `}
            >
              {openStatus.text}
            </span>
            {distance !== null && (
              <span className="text-gray-500">{formatDistance(distance)} away</span>
            )}
          </div>

          {/* Category tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {service.categories.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium"
              >
                {getCategoryLabel(cat)}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-gray-700">
            {service.descriptionLong || service.descriptionShort}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          {service.phone && (
            <a
              href={`tel:${service.phone}`}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors"
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
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-white text-blue-600 font-semibold rounded-xl border-2 border-blue-600 hover:bg-blue-50 active:bg-blue-100 transition-colors"
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

        {/* Share button */}
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
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
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          {copied ? "Link copied!" : "Share this service"}
        </button>

        {/* Address */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-2">Address</h2>
          <address className="not-italic text-gray-700">
            {service.address.street}
            <br />
            {service.address.city}, {service.address.state}{" "}
            {service.address.postalCode}
          </address>
          {service.phone && (
            <p className="mt-2 text-gray-700">
              Phone:{" "}
              <a href={`tel:${service.phone}`} className="text-blue-600">
                {service.phone}
              </a>
            </p>
          )}
          {service.website && (
            <p className="mt-1">
              <a
                href={service.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Visit website
              </a>
            </p>
          )}
        </div>

        {/* Hours */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3">Hours</h2>
          <div className="space-y-2">
            {hoursTable.map((row) => (
              <div
                key={row.day}
                className={`flex justify-between py-1 ${
                  row.isToday ? "font-medium text-blue-600" : "text-gray-700"
                }`}
              >
                <span>{row.dayFull}</span>
                <span>{row.hours}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Eligibility */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3">Who can come</h2>
          {service.eligibility.description && (
            <p className="text-gray-700 mb-3">{service.eligibility.description}</p>
          )}
          <div className="space-y-2 text-sm">
            {service.eligibility.minAge && (
              <div className="flex gap-2">
                <span className="text-gray-500">Age:</span>
                <span className="text-gray-700">
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
                <div className="flex gap-2">
                  <span className="text-gray-500">Gender:</span>
                  <span className="text-gray-700">
                    {service.eligibility.genderRestrictions === "women_only"
                      ? "Women only"
                      : "Men only"}
                  </span>
                </div>
              )}
            {service.eligibility.requiresSobriety && (
              <div className="flex gap-2 text-yellow-700">
                <span>⚠️</span>
                <span>Requires sobriety</span>
              </div>
            )}
          </div>
        </div>

        {/* Accessibility */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3">Accessibility</h2>
          <div className="flex flex-wrap gap-2">
            {service.accessibility.wheelchairAccessible && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                ♿ Wheelchair accessible
              </span>
            )}
            {service.accessibility.petsAllowed && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                🐕 Pets allowed
              </span>
            )}
            {service.accessibility.serviceAnimalsAllowed && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                🦮 Service animals welcome
              </span>
            )}
            {service.flags.noIDRequired && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                ✓ No ID required
              </span>
            )}
            {service.flags.lowBarrier && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                ✓ Low barrier
              </span>
            )}
          </div>
          {service.accessibility.languages &&
            service.accessibility.languages.length > 0 && (
              <p className="mt-3 text-sm text-gray-600">
                Languages: {service.accessibility.languages.join(", ")}
              </p>
            )}
        </div>

        {/* Notes */}
        {service.notes.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-3">What to know</h2>
            <ul className="space-y-2">
              {service.notes.map((note, i) => (
                <li key={i} className="flex gap-3 text-gray-700">
                  <span className="text-blue-500 flex-shrink-0">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Last verified */}
        {service.lastVerified && (
          <p className="text-xs text-gray-400 text-center">
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
