import Link from "next/link";
import { Footer } from "@/components/Footer";

export default function PrivacyPage() {
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
          <h1 className="text-xl font-bold text-white">Privacy Policy</h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-[420px] mx-auto px-5 py-6 w-full">
        <div className="card-elevated p-5 space-y-6">
          <p className="text-sm text-[var(--text-muted)]">
            Last updated: January 2025
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Our Commitment to Privacy
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              StreetConnect is designed with privacy as a core principle. We understand that people seeking services may be in vulnerable situations, and we are committed to protecting your privacy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Information We Don&apos;t Collect
            </h2>
            <ul className="text-sm text-[var(--text-secondary)] leading-relaxed space-y-2">
              <li className="flex gap-2">
                <span className="text-[var(--success-600)]">&#10003;</span>
                <span>We don&apos;t require accounts or registration</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--success-600)]">&#10003;</span>
                <span>We don&apos;t collect personal information</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--success-600)]">&#10003;</span>
                <span>We don&apos;t track your browsing history</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--success-600)]">&#10003;</span>
                <span>We don&apos;t sell any data to third parties</span>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Location Data
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              When you choose to share your location, it is used only to find services near you. Your location data:
            </p>
            <ul className="text-sm text-[var(--text-secondary)] leading-relaxed space-y-2">
              <li className="flex gap-2">
                <span className="text-[var(--primary-600)]">•</span>
                <span>Is stored only on your device</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--primary-600)]">•</span>
                <span>Is never sent to our servers</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--primary-600)]">•</span>
                <span>Is never shared with third parties</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--primary-600)]">•</span>
                <span>Can be cleared at any time from settings</span>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Local Storage
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              We use your browser&apos;s local storage to save your preferences and cache service data for offline use. This data never leaves your device.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Third-Party Services
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              We use OpenStreetMap for finding local services and maps. When you search for services, your approximate location may be sent to OpenStreetMap to find nearby results. Please review OpenStreetMap&apos;s privacy policy for more information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Contact Us
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              If you have questions about this privacy policy, please contact us through the feedback option in the app.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
