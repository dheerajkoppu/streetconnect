"use client";

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6 animate-slide-up">
        <div className="text-center">
          <div className="text-5xl mb-4">🤝</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to StreetConnect
          </h2>

          <div className="space-y-4 text-left mb-6">
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span>🔍</span>
              </div>
              <p className="text-gray-600">
                Find food, shelter, showers, and more near you
              </p>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span>🔒</span>
              </div>
              <p className="text-gray-600">
                No account needed. We don&apos;t collect your name or personal info
              </p>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span>📤</span>
              </div>
              <p className="text-gray-600">
                Share this app with others using the share button
              </p>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors"
          >
            Get started
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
