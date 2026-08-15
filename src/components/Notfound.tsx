import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#05070c] px-6 text-center">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative h-140 w-140 max-w-[140vw] max-h-[140vw]">
          {/* concentric rings */}
          <div className="absolute inset-0 rounded-full border border-sky-400/10" />
          <div className="absolute inset-[14%] rounded-full border border-sky-400/10" />
          <div className="absolute inset-[28%] rounded-full border border-sky-400/10" />
          <div className="absolute inset-[42%] rounded-full border border-sky-400/10" />
          {/* crosshair lines */}
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-sky-400/10" />
          <div className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2 bg-sky-400/10" />
          {/* rotating sweep */}
          <div
            className="absolute inset-0 rounded-full animate-radar-spin"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(125,211,252,0.28) 0deg, rgba(125,211,252,0) 60deg)",
            }}
          />
          {/* lost blip */}
          <span className="absolute left-[68%] top-[32%] h-2 w-2 rounded-full bg-sky-300 animate-blip" />
        </div>
      </div>

      {/* content */}
      <div className="relative z-10 flex flex-col items-center">
        <span className="mb-6 font-mono text-xs tracking-[0.4em] text-sky-300/70 uppercase">
          Signal lost
        </span>

        <h1 className="select-none text-[22vw] leading-none font-bold tracking-tighter text-slate-100 sm:text-[9rem] animate-flicker">
          404
        </h1>

        <p className="mt-6 max-w-md text-balance text-sm sm:text-base text-slate-400">
          The page you're looking for is under mantainence.
        </p>

        <Link
          to="/"
          className="group relative mt-10 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/5 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-sky-200 transition-all duration-300 hover:border-sky-300/60 hover:bg-sky-400/10"
        >
          <span
            className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              boxShadow:
                "0 0 20px 2px rgba(125,211,252,0.25), 0 0 40px 8px rgba(125,211,252,0.08)",
            }}
          />
          <span className="relative">Return to base</span>
          <svg
            className="relative h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>

      <style>{`
        @keyframes radar-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .animate-radar-spin {
          animation: radar-spin 4s linear infinite;
        }

        @keyframes blip {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50%      { opacity: 1;    transform: scale(1.4); }
        }
        .animate-blip {
          animation: blip 2.4s ease-in-out infinite;
          box-shadow: 0 0 8px 2px rgba(125, 211, 252, 0.8);
        }

        @keyframes flicker {
          0%, 92%, 100% { opacity: 1; }
          93%            { opacity: 0.6; }
          94%            { opacity: 1; }
          95%            { opacity: 0.4; }
          96%            { opacity: 1; }
        }
        .animate-flicker {
          animation: flicker 6s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-radar-spin, .animate-blip, .animate-flicker {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}