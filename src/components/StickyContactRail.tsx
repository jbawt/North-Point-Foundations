import { FaFacebookF, FaInstagram, FaPhone } from 'react-icons/fa6';
import { SITE } from '../content/siteCopy.ts';

const ITEM_SHELL =
  'group flex h-12 max-w-12 items-center overflow-hidden rounded-full shadow-lg ' +
  'transition-[max-width,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ' +
  'hover:max-w-[min(18rem,calc(100vw-2rem))] hover:shadow-xl hover:-translate-y-1 ' +
  'focus-within:max-w-[min(18rem,calc(100vw-2rem))] focus-within:shadow-xl focus-within:-translate-y-1 ' +
  'motion-reduce:hover:translate-y-0 motion-reduce:focus-within:translate-y-0 ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white ' +
  'motion-reduce:transition-none';

const LABEL_CLASS =
  'pr-3 text-sm font-semibold whitespace-nowrap text-white opacity-0 transition-opacity duration-200 ' +
  'group-hover:opacity-100 group-hover:delay-75 ' +
  'group-focus-within:opacity-100 group-focus-within:delay-0 ' +
  'motion-reduce:transition-none motion-reduce:duration-0 motion-reduce:group-hover:opacity-100 motion-reduce:group-focus-within:opacity-100';

export function StickyContactRail() {
  return (
    <aside
      className="print:hidden pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(0.75rem,env(safe-area-inset-right))] z-40 flex flex-col items-end gap-3 sm:bottom-[max(1.25rem,env(safe-area-inset-bottom))] sm:right-[max(1rem,env(safe-area-inset-right))]"
      aria-label="Quick contact and social links"
    >
      <div className="pointer-events-auto flex flex-col items-end gap-3">
        <a
          href={SITE.quotePhoneTel}
          className={`${ITEM_SHELL} w-max shrink-0 self-end bg-[#BE1E2D] text-white`}
          aria-label="Get a quote — call us"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center" aria-hidden>
            <FaPhone className="h-[1.15rem] w-[1.15rem]" />
          </span>
          <span className={LABEL_CLASS}>Get a quote</span>
        </a>

        <a
          href={SITE.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${ITEM_SHELL} w-max shrink-0 self-end bg-[#1877F2] text-white`}
          aria-label="North Point Foundations on Facebook"
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
          className={`${ITEM_SHELL} w-max shrink-0 self-end bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] text-white`}
          aria-label="North Point Foundations on Instagram"
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
