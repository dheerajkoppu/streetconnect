import Link from "next/link";
import { getConfig } from "@/lib/data";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "About - StreetConnect",
  description: "Learn about StreetConnect and how we help connect people to services",
};

export default function AboutPage() {
  const config = getConfig();

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col">
      {/* Header */}
      <header className="header-gradient safe-area-top sticky top-0 z-40">
        <div className="px-5 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
            aria-label="Go back"
          >
            <svg
              className="w-5 h-5 text-white"
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
          <h1 className="text-xl font-bold text-white">About</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-[420px] mx-auto px-5 py-6 w-full space-y-5">
        {/* About section */}
        <section className="card-elevated p-5">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">
            About StreetConnect
          </h2>
          <div className="space-y-3 text-[var(--text-secondary)] leading-relaxed text-sm">
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
        <section className="card-elevated p-5">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">
            Your Privacy
          </h2>
          <div className="space-y-3 text-[var(--text-secondary)] leading-relaxed text-sm">
            <p>
              When you share your location, it stays on your device only. We use
              it to show you the closest services and calculate distances.
            </p>
            <p className="font-semibold text-[var(--text-primary)]">We never:</p>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="text-[var(--success-600)]">&#10003;</span>
                <span>Store your location on any server</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--success-600)]">&#10003;</span>
                <span>Track where you go</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--success-600)]">&#10003;</span>
                <span>Share your location with anyone</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--success-600)]">&#10003;</span>
                <span>Require location to use the app</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-[var(--accent-100)] rounded-[var(--radius-2xl)] p-5 border border-[var(--accent-200)]">
          <h2 className="text-lg font-bold text-[var(--accent-800)] mb-3">
            Important
          </h2>
          <div className="space-y-3 text-[var(--accent-900)] leading-relaxed text-sm">
            <p>
              Service information can change. Hours, availability, and eligibility
              may vary.
            </p>
            <p className="font-semibold">Tips:</p>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span>&#128222;</span>
                <span>Call ahead when possible</span>
              </li>
              <li className="flex gap-2">
                <span>&#9200;</span>
                <span>Arrive early for meals and shelter check-in</span>
              </li>
              <li className="flex gap-2">
                <span>&#128196;</span>
                <span>Bring ID or documents if you have them</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Feedback */}
        <section className="card-elevated p-5">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">
            Give Feedback
          </h2>
          <div className="space-y-4 text-[var(--text-secondary)] text-sm">
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
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Send Feedback
            </a>
          </div>
        </section>

        {/* Version info */}
        <div className="text-center text-sm text-[var(--text-muted)] space-y-1 pt-2">
          <p className="font-medium">StreetConnect v1.0.0</p>
          <p>Serving {config.regionName}</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
