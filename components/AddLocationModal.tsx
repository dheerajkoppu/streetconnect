"use client";

import { useState } from "react";
import {
  Service,
  ServiceCategory,
  ServiceHours,
  ServiceHoursForDay,
} from "@/types";

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (service: Service) => void;
}

const CATEGORIES: { id: ServiceCategory; label: string; icon: string }[] = [
  { id: "shelter", label: "Shelter", icon: "🏠" },
  { id: "food", label: "Food", icon: "🍲" },
  { id: "showers", label: "Showers", icon: "🚿" },
  { id: "laundry", label: "Laundry", icon: "👕" },
  { id: "medical", label: "Medical", icon: "🏥" },
  { id: "mental_health", label: "Mental Health", icon: "🧠" },
  { id: "day_center", label: "Day Center", icon: "☀️" },
  { id: "id_legal", label: "ID & Legal", icon: "📋" },
  { id: "other", label: "Other", icon: "📍" },
];

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const DEFAULT_HOURS: ServiceHoursForDay = { open: null, close: null };

export function AddLocationModal({
  isOpen,
  onClose,
  onSubmit,
}: AddLocationModalProps) {
  // Form state
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [descriptionShort, setDescriptionShort] = useState("");
  const [descriptionLong, setDescriptionLong] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");

  // Address
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Hours
  const [hours, setHours] = useState<ServiceHours>({
    monday: { ...DEFAULT_HOURS },
    tuesday: { ...DEFAULT_HOURS },
    wednesday: { ...DEFAULT_HOURS },
    thursday: { ...DEFAULT_HOURS },
    friday: { ...DEFAULT_HOURS },
    saturday: { ...DEFAULT_HOURS },
    sunday: { ...DEFAULT_HOURS },
  });

  // Eligibility
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [genderRestrictions, setGenderRestrictions] = useState<
    "women_only" | "men_only" | "all_genders"
  >("all_genders");
  const [familiesAllowed, setFamiliesAllowed] = useState(true);
  const [singlesAllowed, setSinglesAllowed] = useState(true);
  const [lgbtqFriendly, setLgbtqFriendly] = useState(true);
  const [requiresID, setRequiresID] = useState(false);
  const [requiresSobriety, setRequiresSobriety] = useState(false);
  const [eligibilityDescription, setEligibilityDescription] = useState("");

  // Accessibility
  const [wheelchairAccessible, setWheelchairAccessible] = useState(false);
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [serviceAnimalsAllowed, setServiceAnimalsAllowed] = useState(true);
  const [languages, setLanguages] = useState("");

  // Flags
  const [noIDRequired, setNoIDRequired] = useState(false);
  const [lowBarrier, setLowBarrier] = useState(false);
  const [youthFocused, setYouthFocused] = useState(false);

  // Notes
  const [notes, setNotes] = useState("");

  // UI State
  const [activeSection, setActiveSection] = useState<string>("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const toggleCategory = (categoryId: ServiceCategory) => {
    setCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const updateHours = (
    day: keyof ServiceHours,
    field: "open" | "close",
    value: string
  ) => {
    setHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value || null,
      },
    }));
  };

  const setDayClosed = (day: keyof ServiceHours) => {
    setHours((prev) => ({
      ...prev,
      [day]: { open: null, close: null },
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!name.trim()) newErrors.push("Name is required");
    if (categories.length === 0)
      newErrors.push("At least one category is required");
    if (!descriptionShort.trim())
      newErrors.push("Short description is required");
    if (!street.trim()) newErrors.push("Street address is required");
    if (!city.trim()) newErrors.push("City is required");
    if (!state.trim()) newErrors.push("State is required");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Try to geocode the address
      let lat: number | undefined;
      let lng: number | undefined;

      try {
        const addressQuery = encodeURIComponent(
          `${street}, ${city}, ${state} ${postalCode}`
        );
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${addressQuery}&limit=1`,
          {
            headers: {
              "User-Agent": "StreetConnect/1.0",
            },
          }
        );
        const data = await response.json();
        if (data && data.length > 0) {
          lat = parseFloat(data[0].lat);
          lng = parseFloat(data[0].lon);
        }
      } catch {
        // Geocoding failed, continue without coordinates
        console.warn("Geocoding failed, continuing without coordinates");
      }

      const service: Service = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        categories,
        descriptionShort: descriptionShort.trim(),
        descriptionLong: descriptionLong.trim() || undefined,
        phone: phone.trim() || undefined,
        website: website.trim() || undefined,
        address: {
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
          lat,
          lng,
        },
        hours,
        eligibility: {
          minAge: minAge ? parseInt(minAge) : undefined,
          maxAge: maxAge ? parseInt(maxAge) : undefined,
          genderRestrictions,
          familiesAllowed,
          singlesAllowed,
          lgbtqFriendly,
          requiresID,
          requiresSobriety,
          description: eligibilityDescription.trim() || undefined,
        },
        accessibility: {
          wheelchairAccessible,
          petsAllowed,
          serviceAnimalsAllowed,
          languages: languages
            .split(",")
            .map((l) => l.trim())
            .filter(Boolean),
        },
        flags: {
          noIDRequired,
          lowBarrier,
          youthFocused,
        },
        notes: notes
          .split("\n")
          .map((n) => n.trim())
          .filter(Boolean),
        lastVerified: new Date().toISOString(),
      };

      onSubmit(service);
      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setCategories([]);
    setDescriptionShort("");
    setDescriptionLong("");
    setPhone("");
    setWebsite("");
    setStreet("");
    setCity("");
    setState("");
    setPostalCode("");
    setHours({
      monday: { ...DEFAULT_HOURS },
      tuesday: { ...DEFAULT_HOURS },
      wednesday: { ...DEFAULT_HOURS },
      thursday: { ...DEFAULT_HOURS },
      friday: { ...DEFAULT_HOURS },
      saturday: { ...DEFAULT_HOURS },
      sunday: { ...DEFAULT_HOURS },
    });
    setMinAge("");
    setMaxAge("");
    setGenderRestrictions("all_genders");
    setFamiliesAllowed(true);
    setSinglesAllowed(true);
    setLgbtqFriendly(true);
    setRequiresID(false);
    setRequiresSobriety(false);
    setEligibilityDescription("");
    setWheelchairAccessible(false);
    setPetsAllowed(false);
    setServiceAnimalsAllowed(true);
    setLanguages("");
    setNoIDRequired(false);
    setLowBarrier(false);
    setYouthFocused(false);
    setNotes("");
    setActiveSection("basic");
    setErrors([]);
  };

  if (!isOpen) return null;

  const sections = [
    { id: "basic", label: "Basic Info" },
    { id: "address", label: "Address" },
    { id: "hours", label: "Hours" },
    { id: "eligibility", label: "Eligibility" },
    { id: "accessibility", label: "Accessibility" },
    { id: "notes", label: "Notes" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[95vh] sm:max-h-[90vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Add New Location
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-100 px-2 py-2 gap-1 scrollbar-hide">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                activeSection === section.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-5 min-h-[350px]">
          {/* Errors */}
          {errors.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800 mb-1">
                Please fix the following errors:
              </p>
              <ul className="text-sm text-red-700 list-disc list-inside">
                {errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Basic Info Section */}
          {activeSection === "basic" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Downtown Shelter"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories *
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                        categories.includes(cat.id)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description *
                </label>
                <input
                  type="text"
                  value={descriptionShort}
                  onChange={(e) => setDescriptionShort(e.target.value)}
                  placeholder="Brief summary (1-2 sentences)"
                  maxLength={150}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {descriptionShort.length}/150 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detailed Description
                </label>
                <textarea
                  value={descriptionLong}
                  onChange={(e) => setDescriptionLong(e.target.value)}
                  placeholder="More detailed information about services offered..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Address Section */}
          {activeSection === "address" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="123 Main Street"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Los Angeles"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="CA"
                    maxLength={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="90001"
                  maxLength={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                The address will be automatically geocoded to show on the map
                and calculate distances.
              </p>
            </div>
          )}

          {/* Hours Section */}
          {activeSection === "hours" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-3">
                Set operating hours for each day. Leave blank if closed.
              </p>
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="w-24 text-sm font-medium text-gray-700 capitalize">
                    {day}
                  </span>
                  <input
                    type="time"
                    value={hours[day].open || ""}
                    onChange={(e) => updateHours(day, "open", e.target.value)}
                    className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="time"
                    value={hours[day].close || ""}
                    onChange={(e) => updateHours(day, "close", e.target.value)}
                    className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setDayClosed(day)}
                    className="px-2 py-1 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Set as closed"
                  >
                    Closed
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Eligibility Section */}
          {activeSection === "eligibility" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Age
                  </label>
                  <input
                    type="number"
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value)}
                    placeholder="Any"
                    min={0}
                    max={120}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Age
                  </label>
                  <input
                    type="number"
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value)}
                    placeholder="Any"
                    min={0}
                    max={120}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender Restrictions
                </label>
                <select
                  value={genderRestrictions}
                  onChange={(e) =>
                    setGenderRestrictions(
                      e.target.value as "women_only" | "men_only" | "all_genders"
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="all_genders">All Genders Welcome</option>
                  <option value="women_only">Women Only</option>
                  <option value="men_only">Men Only</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Who is allowed?
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={familiesAllowed}
                      onChange={(e) => setFamiliesAllowed(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      Families Allowed
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={singlesAllowed}
                      onChange={(e) => setSinglesAllowed(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      Singles Allowed
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={lgbtqFriendly}
                      onChange={(e) => setLgbtqFriendly(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">LGBTQ+ Friendly</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Requirements
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={requiresID}
                      onChange={(e) => setRequiresID(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Requires ID</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={requiresSobriety}
                      onChange={(e) => setRequiresSobriety(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      Requires Sobriety
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Eligibility Info
                </label>
                <textarea
                  value={eligibilityDescription}
                  onChange={(e) => setEligibilityDescription(e.target.value)}
                  placeholder="Any other eligibility requirements..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* Accessibility Section */}
          {activeSection === "accessibility" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Accessibility Features
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={wheelchairAccessible}
                      onChange={(e) =>
                        setWheelchairAccessible(e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      Wheelchair Accessible
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={petsAllowed}
                      onChange={(e) => setPetsAllowed(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Pets Allowed</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={serviceAnimalsAllowed}
                      onChange={(e) =>
                        setServiceAnimalsAllowed(e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      Service Animals Allowed
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Languages Spoken
                </label>
                <input
                  type="text"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  placeholder="English, Spanish, Mandarin..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple languages with commas
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700">
                  Special Flags
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={noIDRequired}
                      onChange={(e) => setNoIDRequired(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">No ID Required</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={lowBarrier}
                      onChange={(e) => setLowBarrier(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      Low Barrier (minimal requirements)
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={youthFocused}
                      onChange={(e) => setYouthFocused(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Youth Focused</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Notes Section */}
          {activeSection === "notes" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter each note on a new line:&#10;- Free hot meals served at 6pm&#10;- Bring your own bedding&#10;- First come, first served"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Each line will become a separate bullet point
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer with actions */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors flex items-center gap-2"
          >
            {isSubmitting && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {isSubmitting ? "Adding..." : "Add Location"}
          </button>
        </div>
      </div>
    </div>
  );
}
