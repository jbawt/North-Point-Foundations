/**
 * Compact isometric cube wireframe for the hero (above headline).
 */
import { Activity, Layers3, ScanLine } from 'lucide-react';

const RED = '#BE1E2D';
const GOLD = '#F4D58D';

const CUBE_WIREFRAME_D = [
  'M 200 165 L 280 219',
  'M 120 219 L 200 273',
  'M 120 131 L 200 185',
  'M 200 77 L 280 131',
  'M 200 165 L 200 77',
  'M 280 219 L 280 131',
  'M 120 219 L 120 131',
  'M 200 273 L 200 185',
  'M 200 165 L 120 219',
  'M 280 219 L 200 273',
  'M 200 77 L 120 131',
  'M 280 131 L 200 185',
].join(' ');

export function HeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="group relative z-[1] mx-auto flex w-full max-w-[15rem] cursor-default justify-center sm:max-w-[18rem] md:max-w-[21rem] lg:max-w-[24rem]"
    >
      <div className="relative aspect-[400/340] w-full transition-[transform,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-hover:drop-shadow-[0_0_24px_rgba(190,30,45,0.45)] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:drop-shadow-none">
        <ScanLine
          className="absolute right-[8%] top-[8%] h-3 w-3 text-[#F4D58D]/40 sm:h-3.5 sm:w-3.5"
          strokeWidth={1.25}
        />
        <Activity
          className="absolute left-[6%] top-[20%] h-3 w-3 text-[#BE1E2D]/50 sm:h-3.5 sm:w-3.5"
          strokeWidth={1.35}
        />
        <Layers3
          className="absolute bottom-[32%] right-[6%] h-3 w-3 text-white/25 sm:h-3.5 sm:w-3.5"
          strokeWidth={1.25}
        />

        <svg
          className="h-auto w-full drop-shadow-[0_0_16px_rgba(190,30,45,0.28)]"
          viewBox="0 0 400 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="npfFiberGrad" x1="40" y1="320" x2="360" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={RED} />
              <stop offset="55%" stopColor="#E85A4A" />
              <stop offset="100%" stopColor={GOLD} />
            </linearGradient>
            <filter id="npfFiberGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="0.55" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g filter="url(#npfFiberGlow)">
            <path
              className="npf-fiber-path"
              d={CUBE_WIREFRAME_D}
              stroke="url(#npfFiberGrad)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
