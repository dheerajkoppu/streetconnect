import Link from "next/link";
import { Footer } from "@/components/Footer";

export default function TermsPage() {
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
          <h1 className="text-xl font-bold text-white">Terms of Service</h1>
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
              Acceptance of Terms
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              By using StreetConnect, you agree to these terms of service. If you do not agree, please do not use the app.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Description of Service
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              StreetConnect is a free directory of services for people experiencing homelessness. We provide information about shelters, food banks, medical services, and other resources.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Information Accuracy
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              While we strive to keep service information accurate and up-to-date, we cannot guarantee the accuracy of all information. Service hours, availability, and requirements may change without notice. We recommend calling ahead to confirm details.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              No Medical or Legal Advice
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              StreetConnect provides information about services but does not provide medical, legal, or professional advice. Always consult with qualified professionals for specific advice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              User Conduct
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              You agree to use StreetConnect only for lawful purposes and in a way that does not harm others or interfere with the app&apos;s operation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Limitation of Liability
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              StreetConnect is provided &quot;as is&quot; without warranties of any kind. We are not liable for any damages arising from your use of the app or reliance on its information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Changes to Terms
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              We may update these terms from time to time. Continued use of StreetConnect after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Contact
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Questions about these terms can be submitted through the feedback option in the app.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
