"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Service, ServiceCategory, FilterState, UserLocation } from "@/types";
import { getServices, getConfig } from "@/lib/data";
import { loadUserLocation, clearUserLocation } from "@/lib/location";
import { filterServices, sortServices, getDefaultFilters } from "@/lib/filters";
import { cacheServices, loadCachedServices } from "@/lib/cache";
import { fetchLocalServices, reverseGeocode } from "@/lib/localServices";
import { loadUserServices, addUserService } from "@/lib/userServices";
import { useChatContext } from "@/lib/ChatContext";

import { Header } from "@/components/Header";
import { AddLocationModal } from "@/components/AddLocationModal";
import { CategorySelector } from "@/components/CategorySelector";
import { SearchFiltersCard } from "@/components/SearchFiltersCard";
import { ServiceList } from "@/components/ServiceList";
import { LocationPrompt } from "@/components/LocationPrompt";
import { Onboarding } from "@/components/Onboarding";
import { CacheStatus } from "@/components/CacheStatus";
import { Footer } from "@/components/Footer";

const ONBOARDING_KEY = "streetconnect_onboarding_seen";
const LOCATION_PROMPTED_KEY = "streetconnect_location_prompted";

export default function HomePage() {
  // Data state
  const [staticServices, setStaticServices] = useState<Service[]>([]);
  const [localServices, setLocalServices] = useState<Service[]>([]);
  const [userServices, setUserServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // UI state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [cityName, setCityName] = useState<string>("Los Angeles");

  // Filter state
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory | null>(null);
  const [filters, setFilters] = useState<FilterState>(getDefaultFilters());
  const [searchQuery, setSearchQuery] = useState("");

  // Config
  const config = getConfig();

  // Chat context
  const { setCity, setCategory, setFilters: setChatFilters, setVisibleServices, setSelectedService } = useChatContext();

  // Combine static, local, and user-added services
  const services = useMemo(() => {
    // Deduplicate by checking if names are very similar
    const combined = [...staticServices];
    for (const local of localServices) {
      const isDuplicate = staticServices.some(
        (s) => s.name.toLowerCase() === local.name.toLowerCase()
      );
      if (!isDuplicate) {
        combined.push(local);
      }
    }
    // Add user-added services (these always get included)
    for (const userService of userServices) {
      const isDuplicate = combined.some(
        (s) => s.id === userService.id || s.name.toLowerCase() === userService.name.toLowerCase()
      );
      if (!isDuplicate) {
        combined.push(userService);
      }
    }
    return combined;
  }, [staticServices, localServices, userServices]);

  // Load static data
  useEffect(() => {
    const loadData = () => {
      try {
        const allServices = getServices();
        setStaticServices(allServices);
        cacheServices(allServices);
        setIsOffline(false);
      } catch {
        const cached = loadCachedServices();
        if (cached) {
          setStaticServices(cached.services);
          setIsOffline(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch local services when location changes
  useEffect(() => {
    if (!userLocation) {
      setLocalServices([]);
      setCityName(config.cityName);
      return;
    }

    const fetchLocal = async () => {
      setIsLoadingLocal(true);
      try {
        // Reverse geocode to get city name
        const locationInfo = await reverseGeocode(userLocation.lat, userLocation.lng);
        if (locationInfo) {
          setCityName(locationInfo.city);
        }

        // Fetch nearby services from OpenStreetMap
        const nearby = await fetchLocalServices(
          userLocation.lat,
          userLocation.lng,
          5000 // 5km radius
        );
        setLocalServices(nearby);
      } catch (error) {
        console.error("Failed to fetch local services:", error);
      } finally {
        setIsLoadingLocal(false);
      }
    };

    fetchLocal();
  }, [userLocation, config.cityName]);

  // Load user-added services on mount
  useEffect(() => {
    const savedUserServices = loadUserServices();
    if (savedUserServices.length > 0) {
      setUserServices(savedUserServices);
    }
  }, []);

  // Check for onboarding and location on mount
  useEffect(() => {
    const onboardingSeen = localStorage.getItem(ONBOARDING_KEY);
    if (!onboardingSeen) {
      setShowOnboarding(true);
    }

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
    setLocalServices([]);
    setCityName(config.cityName);
    setShowLocationPrompt(true);
  }, [config.cityName]);

  const handleAddLocation = useCallback(() => {
    setShowAddLocation(true);
  }, []);

  const handleAddLocationSubmit = useCallback((service: Service) => {
    const updatedServices = addUserService(service);
    setUserServices(updatedServices);
  }, []);

  const userCoords = useMemo(
    () => (userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : null),
    [userLocation?.lat, userLocation?.lng]
  );

  const sortedServices = useMemo(() => {
    const filtered = filterServices(
      services,
      filters,
      selectedCategory,
      userCoords,
      searchQuery
    );
    return sortServices(filtered, userCoords);
  }, [services, filters, selectedCategory, userCoords, searchQuery]);

  const prevServiceIdsRef = useRef<string>("");

  // Update chat context
  useEffect(() => {
    setCity(cityName, config.regionName);
  }, [cityName, config.regionName, setCity]);

  useEffect(() => {
    setCategory(selectedCategory);
  }, [selectedCategory, setCategory]);

  useEffect(() => {
    setChatFilters(filters);
  }, [filters, setChatFilters]);

  useEffect(() => {
    const serviceIds = sortedServices.map(s => s.id).join(",");
    if (serviceIds !== prevServiceIdsRef.current) {
      prevServiceIdsRef.current = serviceIds;
      setVisibleServices(sortedServices);
    }
  }, [sortedServices, setVisibleServices]);

  useEffect(() => {
    setSelectedService(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col">
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}

      <AddLocationModal
        isOpen={showAddLocation}
        onClose={() => setShowAddLocation(false)}
        onSubmit={handleAddLocationSubmit}
      />

      <Header
        cityName={cityName}
        onLocationChange={handleLocationChange}
        onAddLocation={handleAddLocation}
      />

      <main className="flex-1 max-w-[420px] mx-auto px-5 pb-24 w-full">
        {showLocationPrompt && !showOnboarding && (
          <div className="py-5">
            <LocationPrompt
              onLocationSet={handleLocationSet}
              onSkip={handleLocationSkip}
            />
          </div>
        )}

        {!showLocationPrompt && (
          <div className="space-y-5 py-5">
            <div className="space-y-4">
              <CategorySelector
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              <SearchFiltersCard
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                filters={filters}
                onFilterChange={setFilters}
                hasLocation={!!userLocation}
              />

              <CacheStatus isOffline={isOffline} />

              {/* Local services loading indicator */}
              {isLoadingLocal && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] px-1">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Finding local services...
                </div>
              )}

              {/* Show count of local services found */}
              {!isLoadingLocal && localServices.length > 0 && (
                <div className="text-sm text-[var(--text-muted)] px-1">
                  Found {localServices.length} additional services near you
                </div>
              )}
            </div>

            <ServiceList
              services={sortedServices}
              userLocation={userCoords}
              isLoading={isLoading}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
