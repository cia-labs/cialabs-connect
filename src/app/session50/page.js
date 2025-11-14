"use client";
import { useRouter } from "next/navigation";
import ParticipantsStreakTable from "@/components/ParticipantsStreakTable";

export default function Page() {
  const router = useRouter();

  return (
    <div className="relative bg-[#030409] text-white overflow-hidden">
      {/* Tech background: responsive, decorative SVG/grid + animated particles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1200 800"
          role="img"
          aria-hidden
        >
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0" stopColor="#001b22" />
              <stop offset="1" stopColor="#020614" />
            </linearGradient>
            <linearGradient id="neon" x1="0" x2="1">
              <stop offset="0" stopColor="#00d4ff" stopOpacity="0.08" />
              <stop offset="1" stopColor="#7fffd4" stopOpacity="0.04" />
            </linearGradient>
            <pattern
              id="grid"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M32 0H0V32"
                fill="none"
                stroke="#0b2130"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>

          <rect width="1200" height="800" fill="url(#g1)" />
          <rect width="1200" height="800" fill="url(#grid)" opacity="0.72" />
          <rect
            x="-600"
            y="0"
            width="1400"
            height="800"
            transform="rotate(-12 0 0)"
            fill="url(#neon)"
            className="opacity-6 sm:opacity-10"
          >
            <animate
              attributeName="x"
              values="-700; -600; -700"
              dur="14s"
              repeatCount="indefinite"
            />
          </rect>

          <g
            stroke="#053544"
            strokeWidth="1.0"
            opacity="0.65"
            className="hidden sm:inline"
          >
            <path d="M80 120 H320 M320 120 V300 H640" />
            <path d="M900 80 H1040" />
            <path d="M480 400 H760" />
          </g>
          <g
            stroke="#053544"
            strokeWidth="0.9"
            opacity="0.4"
            className="sm:hidden"
          >
            <path d="M40 80 H280" />
            <path d="M360 60 H520" />
          </g>
        </svg>

        <div className="absolute inset-0 -z-10">
          <style jsx>{`
            @keyframes floatA {
              0% {
                transform: translateY(0) translateX(0) scale(1);
              }
              50% {
                transform: translateY(-12px) translateX(6px) scale(1.03);
              }
              100% {
                transform: translateY(0) translateX(0) scale(1);
              }
            }
            @keyframes floatB {
              0% {
                transform: translateY(0) translateX(0) scale(1);
              }
              50% {
                transform: translateY(-8px) translateX(-6px) scale(0.99);
              }
              100% {
                transform: translateY(0) translateX(0) scale(1);
              }
            }
          `}</style>

          <svg
            className="absolute left-4 top-6 w-20 h-20 opacity-60 sm:w-28 sm:h-28"
            viewBox="0 0 64 64"
            fill="none"
            style={{ animation: "floatA 6s ease-in-out infinite" }}
            aria-hidden
          >
            <rect
              x="4"
              y="4"
              width="56"
              height="56"
              rx="8"
              stroke="#002f36"
              strokeWidth="1.2"
              fill="rgba(0,32,40,0.10)"
            />
            <path
              d="M16 32h32M32 16v32"
              stroke="#00c8ff"
              strokeOpacity="0.14"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </svg>

          <svg
            className="absolute right-4 bottom-10 w-16 h-16 sm:w-20 sm:h-20 opacity-50"
            viewBox="0 0 48 48"
            fill="none"
            style={{ animation: "floatB 7s ease-in-out infinite" }}
            aria-hidden
          >
            <circle
              cx="24"
              cy="24"
              r="22"
              stroke="#003b46"
              strokeWidth="1.1"
              fill="rgba(0,40,48,0.07)"
            />
            <path
              d="M12 24h24"
              stroke="#7fffd4"
              strokeOpacity="0.11"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>

          <svg
            className="absolute left-1/2 transform -translate-x-1/2 top-8 w-[80%] sm:w-[60%] h-28 sm:h-40 opacity-28"
            viewBox="0 0 600 160"
            preserveAspectRatio="none"
            aria-hidden
          >
            <g fill="#0fb2d6">
              {Array.from({ length: 40 }).map((_, i) => {
                const x = (i % 20) * 30 + (i < 20 ? 0 : 8);
                const y = Math.floor(i / 20) * 60 + 10;
                return <circle key={i} cx={x} cy={y} r="1.4" />;
              })}
            </g>
          </svg>
        </div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Header */}
        <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

            <div>
              <h1 className="text-base sm:text-lg md:text-2xl font-semibold text-[#e6f6ff] font-mono leading-tight">
                Session 50 — Tech Streaks
              </h1>
              <p className="text-[10px] sm:text-xs text-[#94a3b8] font-mono mt-1">
                Realtime attendance streaks 
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <button
                  onClick={() => router.back()}
                  className="px-3 py-1.5 rounded-md bg-[#071018] border border-[#0e2a33] text-xs font-mono text-[#7dd3fc] hover:bg-[#0a1a21] transition"
                >
                  ← Back
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main panel */}
        <main className="pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full">
              <div className="mx-auto rounded-2xl bg-gradient-to-b from-[rgba(3,6,10,0.80)] to-[rgba(6,8,12,0.65)] border border-[rgba(255,255,255,0.04)] backdrop-blur-sm shadow-2xl p-3 sm:p-5 md:p-6 lg:p-8">
                <ParticipantsStreakTable />
              </div>

              <div className="mt-4 sm:mt-6 text-center text-[11px] sm:text-xs text-[#7f8b99] font-mono">
                Tip: Open devtools to inspect API requests (fetch logic
                untouched).
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-[#7f8b99] font-mono text-center">
            © {new Date().getFullYear()} CIA LABS — built for students
          </div>
        </footer>
      </div>
    </div>
  );
}
