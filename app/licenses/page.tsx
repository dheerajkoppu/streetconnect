import Link from "next/link";
import { Footer } from "@/components/Footer";

const licenses = [
  {
    name: "Next.js",
    license: "MIT License",
    url: "https://github.com/vercel/next.js",
    description: "The React Framework for the Web",
  },
  {
    name: "React",
    license: "MIT License",
    url: "https://github.com/facebook/react",
    description: "A JavaScript library for building user interfaces",
  },
  {
    name: "Tailwind CSS",
    license: "MIT License",
    url: "https://github.com/tailwindlabs/tailwindcss",
    description: "A utility-first CSS framework",
  },
  {
    name: "OpenStreetMap",
    license: "ODbL",
    url: "https://www.openstreetmap.org/copyright",
    description: "Map and location data",
  },
  {
    name: "Nominatim",
    license: "ODbL",
    url: "https://nominatim.org/",
    description: "Geocoding service powered by OpenStreetMap",
  },
  {
    name: "Overpass API",
    license: "AGPL-3.0",
    url: "https://overpass-api.de/",
    description: "API for querying OpenStreetMap data",
  },
];

export default function LicensesPage() {
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
          <h1 className="text-xl font-bold text-white">Open Source Licenses</h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-[420px] mx-auto px-5 py-6 w-full">
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed px-1">
            StreetConnect is built with open source software. We&apos;re grateful to the developers and communities behind these projects.
          </p>

          {licenses.map((item, index) => (
            <div key={index} className="card-elevated p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--text-primary)]">
                    {item.name}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {item.description}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-2">
                    License: {item.license}
                  </p>
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--primary-100)] text-[var(--primary-600)] hover:bg-[var(--primary-200)] transition-colors flex-shrink-0"
                  aria-label={`View ${item.name} on GitHub`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}

          <div className="card-elevated p-4 bg-[var(--primary-50)]">
            <h3 className="font-semibold text-[var(--text-primary)] mb-2">
              StreetConnect
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              StreetConnect itself is open source. If you&apos;d like to contribute, report issues, or deploy your own version for your community, visit our repository.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
