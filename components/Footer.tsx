import Link from "next/link";

export function Footer() {
  return (
    <footer className="header-gradient text-white mt-auto">
      <div className="max-w-[420px] md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto px-5 md:px-8 py-8">
        {/* Navigation links */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6">
          <Link
            href="/about"
            className="text-sm text-white/80 hover:text-white transition-colors"
          >
            About
          </Link>
          <Link
            href="/faq"
            className="text-sm text-white/80 hover:text-white transition-colors"
          >
            FAQ
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-white/80 hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-white/80 hover:text-white transition-colors"
          >
            Terms of Service
          </Link>
        </nav>

        {/* Divider */}
        <div className="border-t border-white/20 mb-6" />

        {/* Copyright */}
        <p className="text-center text-sm text-white/70">
          &copy; 2025 StreetConnect. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
