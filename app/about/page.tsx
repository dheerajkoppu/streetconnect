import Link from "next/link";
import { getConfig } from "@/lib/data";

export const metadata = {
  title: "About - StreetConnect",
  description: "Learn about StreetConnect and how we help connect people to services",
};

export default function AboutPage() {
  const config = getConfig();

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
          <h1 className="text-lg font-semibold">About StreetConnect</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="px-4 py-6 space-y-6 pb-8 safe-area-bottom max-w-2xl mx-auto">
        {/* About section */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            About StreetConnect
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>
              StreetConnect helps people find nearby services like shelters, food,
              showers, medical care, and more in {config.cityName}.
            </p>
            <p>
              Our goal is to make it easy to find help quickly, with no account
              or sign-up required. Just open the app and find what you need.
            </p>
            <p>
              This app is designed for people experiencing homelessness and for
              outreach workers who want to help connect people to services.
            </p>
          </div>
        </section>

        {/* Location privacy */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            How we use your location
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>
              When you share your location, it stays on your device only. We use
              it to show you the closest services first and calculate distances.
            </p>
            <p>
              <strong>We do not:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Store your location on any server</li>
              <li>Track where you go</li>
              <li>Share your location with anyone</li>
              <li>Require location to use the app</li>
            </ul>
            <p>
              You can change or clear your location at any time by tapping the
              city name in the header.
            </p>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
          <h2 className="text-xl font-bold text-yellow-900 mb-3">
            Important note
          </h2>
          <div className="space-y-3 text-yellow-800">
            <p>
              Service information can change without notice. Hours, availability,
              and eligibility may vary.
            </p>
            <p>
              <strong>We recommend:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Call ahead when possible to confirm availability</li>
              <li>Arrive early, especially for meals and shelter check-in</li>
              <li>Bring any required documents or medications</li>
            </ul>
          </div>
        </section>

        {/* Feedback */}
        <section className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Give feedback
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>
              Found incorrect information? Have a suggestion? We want to hear
              from you.
            </p>
            <a
              href="mailto:feedback@streetconnect.app?subject=StreetConnect Feedback"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors"
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Send feedback
            </a>
          </div>
        </section>

        {/* Version info */}
        <div className="text-center text-sm text-gray-400 space-y-1">
          <p>StreetConnect v1.0.0</p>
          <p>Serving {config.regionName}</p>
        </div>
      </main>
    </div>
  );
}
