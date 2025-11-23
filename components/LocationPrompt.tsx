"use client";

import { useState } from "react";
import {
  getCurrentPosition,
  saveUserLocation,
  geocodeAddress,
} from "@/lib/location";
import { UserLocation } from "@/types";

interface LocationPromptProps {
  onLocationSet: (location: UserLocation) => void;
  onSkip: () => void;
}

export function LocationPrompt({ onLocationSet, onSkip }: LocationPromptProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manualAddress, setManualAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleUseMyLocation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const position = await getCurrentPosition();
      const location: UserLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        source: "geolocation",
        timestamp: Date.now(),
      };
      saveUserLocation(location);
      onLocationSet(location);
    } catch {
      setError("Could not get your location. Please enter an address instead.");
      setShowManual(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualAddress.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const coords = await geocodeAddress(manualAddress);
      if (coords) {
        const location: UserLocation = {
          lat: coords.lat,
          lng: coords.lng,
          source: "manual",
          address: manualAddress,
          timestamp: Date.now(),
        };
        saveUserLocation(location);
        onLocationSet(location);
      } else {
        setError(
          "Could not find that address. Try adding city and state, or skip for now."
        );
      }
    } catch {
      setError("Something went wrong. Please try again or skip for now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card p-6 max-w-md mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-[var(--primary-light)] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-[var(--primary)]"
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
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Find services near you
        </h2>
        <p className="text-slate-600 leading-relaxed">
          Share your location to see what&apos;s closest. This is optional.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-[var(--danger-bg)] text-[var(--danger-text)] px-4 py-3 rounded-xl mb-4 text-sm font-medium" role="alert">
          {error}
        </div>
      )}

      {!showManual ? (
        <div className="space-y-3">
          {/* Primary CTA - Use Location */}
          <button
            onClick={handleUseMyLocation}
            disabled={isLoading}
            className="btn btn-primary w-full"
          >
            {isLoading ? (
              <span className="animate-pulse">Finding you...</span>
            ) : (
              <>
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
                Use my location
              </>
            )}
          </button>

          {/* Secondary option - Enter address */}
          <button
            onClick={() => setShowManual(true)}
            className="w-full py-3.5 px-6 text-[var(--primary)] font-semibold hover:bg-[var(--primary-light)] rounded-xl transition-colors"
          >
            Enter address instead
          </button>

          {/* Skip option */}
          <button
            onClick={onSkip}
            className="w-full py-3 px-6 text-slate-500 font-medium hover:text-slate-700 transition-colors"
          >
            Skip for now
          </button>
        </div>
      ) : (
        <form onSubmit={handleManualSubmit} className="space-y-3">
          <div>
            <label htmlFor="address-input" className="sr-only">
              Enter address, city, or ZIP code
            </label>
            <input
              id="address-input"
              type="text"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              placeholder="Enter address, city, or ZIP code"
              className="w-full py-4 px-4 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !manualAddress.trim()}
            className="btn btn-primary w-full"
          >
            {isLoading ? "Searching..." : "Find services"}
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setShowManual(false);
                setError(null);
              }}
              className="flex-1 py-3 px-4 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="flex-1 py-3 px-4 text-slate-500 font-medium hover:text-slate-700 transition-colors"
            >
              Skip
            </button>
          </div>
        </form>
      )}

      {/* Privacy note */}
      <p className="text-xs text-slate-400 text-center mt-5 leading-relaxed">
        Your location stays on your device only.
        <br />
        We don&apos;t save it on any server.
      </p>
    </div>
  );
}
