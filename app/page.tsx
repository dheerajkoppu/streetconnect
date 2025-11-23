"use client";

import { useState, useEffect, useCallback } from "react";
import { Service, ServiceCategory, FilterState, UserLocation } from "@/types";
import { getServices, getConfig } from "@/lib/data";
import { loadUserLocation, clearUserLocation } from "@/lib/location";
import { filterServices, sortServices, getDefaultFilters } from "@/lib/filters";
import { cacheServices, loadCachedServices } from "@/lib/cache";

import { Header } from "@/components/Header";
import { CategorySelector } from "@/components/CategorySelector";
import { FilterBar } from "@/components/FilterBar";
import { SearchBar } from "@/components/SearchBar";
import { ServiceList } from "@/components/ServiceList";
import { LocationPrompt } from "@/components/LocationPrompt";
import { Onboarding } from "@/components/Onboarding";
import { CacheStatus } from "@/components/CacheStatus";

const ONBOARDING_KEY = "streetconnect_onboarding_seen";
const LOCATION_PROMPTED_KEY = "streetconnect_location_prompted";

export default function HomePage() {
  // Data state
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  // UI state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  // Filter state
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory | null>(null);
  const [filters, setFilters] = useState<FilterState>(getDefaultFilters());
  const [searchQuery, setSearchQuery] = useState("");

  // Config
  const config = getConfig();

  // Load data and check for cached version
  useEffect(() => {
    const loadData = () => {
      try {
        // Load services from static data
        const allServices = getServices();
        setServices(allServices);
        cacheServices(allServices);
        setIsOffline(false);
      } catch {
        // Try to load from cache if available
        const cached = loadCachedServices();
        if (cached) {
          setServices(cached.services);
          setIsOffline(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Check online status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Check for onboarding and location on mount
  useEffect(() => {
    // Check onboarding
    const onboardingSeen = localStorage.getItem(ONBOARDING_KEY);
    if (!onboardingSeen) {
      setShowOnboarding(true);
    }

    // Check location
    const savedLocation = loadUserLocation();
    if (savedLocation) {
      setUserLocation(savedLocation);
    } else {
      const locationPrompted = localStorage.getItem(LOCATION_PROMPTED_KEY);
      if (!locationPrompted && onboardingSeen) {
        setShowLocationPrompt(true);
      }
    }
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setShowOnboarding(false);
    // Show location prompt after onboarding
    const savedLocation = loadUserLocation();
    if (!savedLocation) {
      setShowLocationPrompt(true);
    }
  }, []);

  const handleLocationSet = useCallback((location: UserLocation) => {
    setUserLocation(location);
    setShowLocationPrompt(false);
    localStorage.setItem(LOCATION_PROMPTED_KEY, "true");
  }, []);

  const handleLocationSkip = useCallback(() => {
    setShowLocationPrompt(false);
    localStorage.setItem(LOCATION_PROMPTED_KEY, "true");
  }, []);

  const handleLocationChange = useCallback(() => {
    clearUserLocation();
    setUserLocation(null);
    setShowLocationPrompt(true);
  }, []);

  // Filter and sort services
  const filteredServices = filterServices(
    services,
    filters,
    selectedCategory,
    userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : null,
    searchQuery
  );

  const sortedServices = sortServices(
    filteredServices,
    userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : null
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Onboarding overlay */}
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}

      {/* Header */}
      <Header cityName={config.cityName} onLocationChange={handleLocationChange} />

      {/* Main content */}
      <main className="px-4 py-4 space-y-4 pb-8 safe-area-bottom">
        {/* Location prompt */}
        {showLocationPrompt && !showOnboarding && (
          <LocationPrompt
            onLocationSet={handleLocationSet}
            onSkip={handleLocationSkip}
          />
        )}

        {!showLocationPrompt && (
          <>
            {/* Category selector */}
            <CategorySelector
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Search bar */}
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name..."
            />

            {/* Filters */}
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              hasLocation={!!userLocation}
            />

            {/* Cache status */}
            <CacheStatus isOffline={isOffline} />

            {/* Service list */}
            <ServiceList
              services={sortedServices}
              userLocation={
                userLocation
                  ? { lat: userLocation.lat, lng: userLocation.lng }
                  : null
              }
              isLoading={isLoading}
            />
          </>
        )}
      </main>
    </div>
  );
}
