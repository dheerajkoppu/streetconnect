import Link from "next/link";
import { getConfig } from "@/lib/data";

export const metadata = {
  title: "About - StreetConnect",
  description: "Learn about StreetConnect and how we help connect people to services",
};

export default function AboutPage() {
  const config = getConfig();

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
          <h1 className="text-lg font-bold">About</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="px-5 py-6 space-y-5 safe-area-bottom max-w-2xl mx-auto">
        {/* About section */}
        <section className="card p-5">
          <h2 className="text-xl font-bold text-slate-900 mb-3">
            About StreetConnect
          </h2>
          <div className="space-y-3 text-slate-700 leading-relaxed">
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
        <section className="card p-5">
          <h2 className="text-xl font-bold text-slate-900 mb-3">
            Your privacy
          </h2>
          <div className="space-y-3 text-slate-700 leading-relaxed">
            <p>
              When you share your location, it stays on your device only. We use
              it to show you the closest services and calculate distances.
            </p>
            <p className="font-semibold">We never:</p>
            <ul className="space-y-2 ml-1">
              <li className="flex gap-3 items-start">
                <span className="text-[var(--success)] flex-shrink-0">✓</span>
                <span>Store your location on any server</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-[var(--success)] flex-shrink-0">✓</span>
                <span>Track where you go</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-[var(--success)] flex-shrink-0">✓</span>
                <span>Share your location with anyone</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-[var(--success)] flex-shrink-0">✓</span>
                <span>Require location to use the app</span>
              </li>
            </ul>
            <p className="text-sm text-slate-500 mt-2">
              Change your location anytime by tapping the city name in the header.
            </p>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-[var(--warning-bg)] rounded-2xl p-5 border-2 border-amber-200">
          <h2 className="text-xl font-bold text-[var(--warning-text)] mb-3">
            Important
          </h2>
          <div className="space-y-3 text-amber-900 leading-relaxed">
            <p>
              Service information can change. Hours, availability, and eligibility
              may vary.
            </p>
            <p className="font-semibold">Tips:</p>
            <ul className="space-y-2 ml-1">
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0">📞</span>
                <span>Call ahead when possible</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0">⏰</span>
                <span>Arrive early for meals and shelter check-in</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0">📄</span>
                <span>Bring ID or documents if you have them</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Feedback */}
        <section className="card p-5">
          <h2 className="text-xl font-bold text-slate-900 mb-3">
            Give feedback
          </h2>
          <div className="space-y-4 text-slate-700">
            <p>
              Found wrong information? Have a suggestion? Let us know.
            </p>
            <a
              href="mailto:feedback@streetconnect.app?subject=StreetConnect Feedback"
              className="btn btn-primary inline-flex"
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Send feedback
            </a>
          </div>
        </section>

        {/* Version info */}
        <div className="text-center text-sm text-slate-400 space-y-1 pt-2">
          <p className="font-medium">StreetConnect v1.0.0</p>
          <p>Serving {config.regionName}</p>
        </div>
      </main>
    </div>
  );
}
