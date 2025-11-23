"use client";

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
      <div className="modal-content p-6 animate-slide-up">
        <div className="text-center">
          {/* Welcoming icon */}
          <div className="text-5xl mb-4" role="img" aria-hidden="true">
            🤝
          </div>

          <h2 id="onboarding-title" className="text-2xl font-bold text-slate-900 mb-2">
            Welcome to StreetConnect
          </h2>
          <p className="text-slate-600 mb-6">
            Find nearby help quickly and easily.
          </p>

          {/* Features list - simple and clear */}
          <div className="space-y-4 text-left mb-8">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-[var(--primary-light)] rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl" role="img" aria-hidden="true">🔍</span>
              </div>
              <div>
                <p className="font-semibold text-slate-800">Find what you need</p>
                <p className="text-slate-600 text-sm">
                  Food, shelter, showers, medical care, and more
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-[var(--success-bg)] rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl" role="img" aria-hidden="true">🔒</span>
              </div>
              <div>
                <p className="font-semibold text-slate-800">Private and free</p>
                <p className="text-slate-600 text-sm">
                  No account needed. No personal info collected.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl" role="img" aria-hidden="true">📍</span>
              </div>
              <div>
                <p className="font-semibold text-slate-800">See what&apos;s close</p>
                <p className="text-slate-600 text-sm">
                  Share your location to find nearby services first
                </p>
              </div>
            </div>
          </div>

          {/* CTA button */}
          <button
            onClick={onComplete}
            className="btn btn-primary w-full text-lg"
            autoFocus
          >
            Get started
          </button>
        </div>
      </div>
    </div>
  );
}
