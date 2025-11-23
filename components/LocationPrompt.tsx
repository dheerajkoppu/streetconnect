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
    } catch (err) {
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
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-blue-600"
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
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Find services near you
        </h2>
        <p className="text-gray-600">
          Share your location to see the closest services first.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {!showManual ? (
        <div className="space-y-3">
          <button
            onClick={handleUseMyLocation}
            disabled={isLoading}
            className="w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Use my location
              </>
            )}
          </button>

          <button
            onClick={() => setShowManual(true)}
            className="w-full py-3 px-6 text-blue-600 font-medium hover:bg-blue-50 rounded-xl transition-colors"
          >
            Enter address instead
          </button>

          <button
            onClick={onSkip}
            className="w-full py-3 px-6 text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip for now
          </button>
        </div>
      ) : (
        <form onSubmit={handleManualSubmit} className="space-y-3">
          <input
            type="text"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            placeholder="Enter address, city, or ZIP code"
            className="w-full py-3 px-4 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />

          <button
            type="submit"
            disabled={isLoading || !manualAddress.trim()}
            className="w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
              className="flex-1 py-3 px-6 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="flex-1 py-3 px-6 text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip
            </button>
          </div>
        </form>
      )}

      <p className="text-xs text-gray-400 text-center mt-4">
        Your location stays on your device. We don&apos;t save it on any server.
      </p>
    </div>
  );
}
