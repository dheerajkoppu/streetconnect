import Link from "next/link";
import { Footer } from "@/components/Footer";

const faqs = [
  {
    question: "What is StreetConnect?",
    answer:
      "StreetConnect is a free mobile app that helps people experiencing homelessness find nearby services like shelters, food banks, medical clinics, and more. It works offline and respects your privacy.",
  },
  {
    question: "Does StreetConnect cost money?",
    answer:
      "No, StreetConnect is completely free to use. There are no fees, subscriptions, or in-app purchases.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No account is required. You can use StreetConnect immediately without signing up or providing any personal information.",
  },
  {
    question: "Does the app track my location?",
    answer:
      "Your location is only used to find services near you and is stored only on your device. We never send your location to our servers or share it with anyone.",
  },
  {
    question: "Can I use StreetConnect without internet?",
    answer:
      "Yes! Once you've loaded the app, service information is cached on your device so you can access it even without internet connection.",
  },
  {
    question: "How accurate is the service information?",
    answer:
      "We regularly verify service information, but hours and availability can change. We recommend calling ahead when possible to confirm details.",
  },
  {
    question: "How do I report incorrect information?",
    answer:
      "If you find outdated or incorrect information, please let us know through the feedback option in the About section. Community reports help us keep information accurate.",
  },
  {
    question: "Can outreach workers use this app?",
    answer:
      "Absolutely! StreetConnect is designed for both people seeking services and outreach workers helping them. The simple interface makes it easy to find and share service information.",
  },
  {
    question: "What types of services can I find?",
    answer:
      "You can find shelters, food banks, meal programs, showers, laundry facilities, medical clinics, mental health services, day centers, and help with IDs and legal services.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes. We don't collect personal data, don't require accounts, and store your preferences only on your device. Your privacy is our priority.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col">
      {/* Header */}
      <header className="header-gradient safe-area-top sticky top-0 z-40">
        <div className="max-w-[420px] md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto px-5 md:px-8 py-4 flex items-center gap-4">
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
          <h1 className="text-xl font-bold text-white">FAQ</h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-[420px] md:max-w-3xl lg:max-w-4xl mx-auto px-5 md:px-8 py-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="card-elevated group"
            >
              <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                <span className="font-semibold text-[var(--text-primary)] pr-4">
                  {faq.question}
                </span>
                <svg
                  className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="px-4 pb-4 text-sm text-[var(--text-secondary)] leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
