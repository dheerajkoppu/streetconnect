import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[var(--primary-900)] text-white mt-auto">
      <div className="max-w-[420px] mx-auto px-5 py-8">
        {/* Navigation links */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6">
          <Link
            href="/about"
            className="text-sm text-[var(--primary-200)] hover:text-white transition-colors"
          >
            About
          </Link>
          <Link
            href="/faq"
            className="text-sm text-[var(--primary-200)] hover:text-white transition-colors"
          >
            FAQ
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-[var(--primary-200)] hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-[var(--primary-200)] hover:text-white transition-colors"
          >
            Terms of Service
          </Link>
        </nav>

        {/* Divider */}
        <div className="border-t border-[var(--primary-700)] mb-6" />

        {/* Copyright */}
        <p className="text-center text-sm text-[var(--primary-300)]">
          &copy; 2025 StreetConnect. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
