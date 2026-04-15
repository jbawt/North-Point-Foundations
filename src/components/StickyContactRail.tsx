import { FaEnvelope, FaFacebookF, FaInstagram } from 'react-icons/fa6';
import { useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '../content/siteCopy.ts';

const ITEM_SHELL =
  'group flex h-12 max-w-12 items-center overflow-hidden rounded-full shadow-lg ' +
  'transition-[max-width,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ' +
  'hover:max-w-[min(18rem,calc(100vw-2rem))] hover:shadow-xl hover:-translate-y-1 ' +
  'focus-within:max-w-[min(18rem,calc(100vw-2rem))] focus-within:shadow-xl focus-within:-translate-y-1 ' +
  'motion-reduce:hover:translate-y-0 motion-reduce:focus-within:translate-y-0 ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white ' +
  'motion-reduce:transition-none';

/** After activation, keep the pill collapsed until pointer leaves (covers hover + focus-within expansion). */
const PINNED_COLLAPSED =
  '!max-w-12 hover:!max-w-12 focus-within:!max-w-12 hover:!shadow-lg focus-within:!shadow-lg hover:!translate-y-0 focus-within:!translate-y-0';

const LABEL_CLASS =
  'pr-3 text-sm font-semibold whitespace-nowrap text-white opacity-0 transition-opacity duration-200 ' +
  'group-hover:opacity-100 group-hover:delay-75 ' +
  'group-focus-within:opacity-100 group-focus-within:delay-0 ' +
  'motion-reduce:transition-none motion-reduce:duration-0 motion-reduce:group-hover:opacity-100 motion-reduce:group-focus-within:opacity-100';

function useCollapseAfterActivate() {
  const [pinnedCollapsed, setPinnedCollapsed] = useState(false);

  const handlers = {
    onClick: (e: MouseEvent<HTMLAnchorElement>) => {
      setPinnedCollapsed(true);
      e.currentTarget.blur();
    },
    onMouseLeave: () => setPinnedCollapsed(false),
  };

  return { pinnedCollapsed, handlers };
}

export function StickyContactRail() {
  const quote = useCollapseAfterActivate();
  const facebook = useCollapseAfterActivate();
  const instagram = useCollapseAfterActivate();

  return (
    <aside
      className="print:hidden pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(0.75rem,env(safe-area-inset-right))] z-40 flex flex-col items-end gap-3 sm:bottom-[max(1.25rem,env(safe-area-inset-bottom))] sm:right-[max(1rem,env(safe-area-inset-right))]"
      aria-label="Quick contact and social links"
    >
      <div className="pointer-events-auto flex flex-col items-end gap-3">
        <Link
          to="/contact"
          className={
            `${ITEM_SHELL} w-max shrink-0 self-end bg-[#BE1E2D] text-white ` +
            (quote.pinnedCollapsed ? PINNED_COLLAPSED : '')
          }
          aria-label="Get a quote — go to contact form"
          onClick={quote.handlers.onClick}
          onMouseLeave={quote.handlers.onMouseLeave}
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center" aria-hidden>
            <FaEnvelope className="h-[1.15rem] w-[1.15rem]" />
          </span>
          <span className={LABEL_CLASS}>Get a quote</span>
        </Link>

        <a
          href={SITE.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={
            `${ITEM_SHELL} w-max shrink-0 self-end bg-[#1877F2] text-white ` +
            (facebook.pinnedCollapsed ? PINNED_COLLAPSED : '')
          }
          aria-label="North Point Foundations on Facebook"
          onClick={facebook.handlers.onClick}
          onMouseLeave={facebook.handlers.onMouseLeave}
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center" aria-hidden>
            <FaFacebookF className="h-[1.15rem] w-[1.15rem]" />
          </span>
          <span className={LABEL_CLASS}>Facebook</span>
        </a>

        <a
          href={SITE.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={
            `${ITEM_SHELL} w-max shrink-0 self-end bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] text-white ` +
            (instagram.pinnedCollapsed ? PINNED_COLLAPSED : '')
          }
          aria-label="North Point Foundations on Instagram"
          onClick={instagram.handlers.onClick}
          onMouseLeave={instagram.handlers.onMouseLeave}
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center" aria-hidden>
            <FaInstagram className="h-[1.2rem] w-[1.2rem]" />
          </span>
          <span className={LABEL_CLASS}>Instagram</span>
        </a>
      </div>
    </aside>
  );
}
