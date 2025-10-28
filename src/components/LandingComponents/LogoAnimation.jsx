export function LogoAnimation() {
  return (
    <div className="relative w-32 h-32">
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Define the complete path that the green line will travel */}
          <path
            id="logoPath"
            d="M 60,40
              Q 40,40 40,60
              Q 40,80 60,80
              L 80,80
              L 80,60
              Q 80,40 60,40
              M 140,40
Q 160,40 160,60
Q 160,80 140,80
L 120,80
L 120,60
Q 120,40 140,40

M 140,160
Q 160,160 160,140
Q 160,120 140,120
L 120,120
L 120,140
Q 120,160 140,160

M 60,160
Q 40,160 40,140
Q 40,120 60,120
L 80,120
L 80,140
Q 80,160 60,160

M 80,80
L 120,80
L 120,120
L 80,120
Z"

          />
        </defs>

        {/* Static gray/dark base logo */}
        <use
          href="#logoPath"
          stroke="#374151"
          strokeWidth="6"
          fill="none"
          opacity="0.3"
        />

        {/* Animated green stroke that travels around */}
        <use
          href="#logoPath"
          stroke="#22c55e"
          strokeWidth="6"
          fill="none"
          strokeDasharray="100 900"
          strokeLinecap="round"
          className="animate-stroke-reveal"
        />

        <style>{`
  @keyframes stroke-reveal {
    0% {
      stroke-dashoffset: 1000;
      opacity: 0.2;
      transform: scale(0.95);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    100% {
      stroke-dashoffset: 0;
      transform: scale(1);
    }
  }

  .animate-stroke-reveal {
    animation: stroke-reveal 2s ease-in-out infinite;
    transform-origin: center;
  }
`}</style>

      </svg>
    </div>
  );
}
