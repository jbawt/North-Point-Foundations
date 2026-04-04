import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '../content/siteCopy.ts';
import { HeroTypingHeadline } from './HeroTypingHeadline.tsx';
import { HeroVisual } from './HeroVisual.tsx';

gsap.registerPlugin(ScrollTrigger);

export function HomeHero() {
  const rootRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const reduceMotion = useMemo(
    () =>
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    if (reduceMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const eyebrow = eyebrowRef.current;
      const headline = headlineRef.current;
      const sub = subRef.current;
      const cta = ctaRef.current;
      const accent = accentRef.current;
      const glow = glowRef.current;

      if (eyebrow) {
        gsap.set(eyebrow, { y: 20, opacity: 0 });
      }
      if (headline) {
        gsap.set(headline, { y: 28, opacity: 0 });
      }
      if (sub) {
        gsap.set(sub, { y: 28, opacity: 0 });
      }
      if (cta) {
        gsap.set(cta, { y: 24, opacity: 0 });
      }
      if (accent) {
        gsap.set(accent, { scaleX: 0, transformOrigin: 'left center' });
      }
      if (glow) {
        gsap.set(glow, { opacity: 0, scale: 0.88 });
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (accent) {
        tl.to(accent, { scaleX: 1, duration: 1, ease: 'power2.inOut' }, 0);
      }
      if (glow) {
        tl.to(glow, { opacity: 1, scale: 1, duration: 1.15, ease: 'power2.out' }, 0.08);
      }
      if (eyebrow) {
        tl.to(eyebrow, { y: 0, opacity: 1, duration: 0.65 }, 0.22);
      }
      if (headline) {
        tl.to(headline, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.32);
      }
      if (sub) {
        tl.to(sub, { y: 0, opacity: 1, duration: 0.72 }, '-=0.42');
      }
      if (cta) {
        tl.to(cta, { y: 0, opacity: 1, duration: 0.62, ease: 'power2.out' }, '-=0.48');
      }

      if (glow) {
        gsap.to(glow, {
          opacity: 0.68,
          scale: 1.07,
          duration: 3.4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: 2,
          delay: 1.1,
        });
      }

      gsap.to(gridRef.current, {
        opacity: 0.15,
        duration: 5.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 2,
      });

      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.05,
        onUpdate: (self) => {
          gsap.set(parallaxRef.current, { y: self.progress * 52 });
        },
      });
    }, root);

    return () => {
      ctx.revert();
    };
  }, [reduceMotion]);

  return (
    <section
      ref={rootRef}
      className="relative isolate flex min-h-[min(85vh,48rem)] w-full flex-col justify-start overflow-x-clip overflow-y-visible bg-npf-charcoal pb-20 pt-3 sm:min-h-[min(87vh,52rem)] sm:pb-24 sm:pt-4 md:pb-28 md:pt-5"
    >
      <div
        ref={parallaxRef}
        className="pointer-events-none absolute inset-0 -z-10 will-change-transform"
        style={{ willChange: 'transform' }}
      >
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_115%_85%_at_72%_18%,rgba(188,44,38,0.26),transparent_52%),radial-gradient(ellipse_85%_65%_at_8%_88%,rgba(255,255,255,0.07),transparent_48%),linear-gradient(168deg,#101010_0%,#1a1a1a_42%,#131313_100%)]"
        />
      </div>
      <div
        ref={gridRef}
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.09]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: '44px 44px',
        }}
      />
      <div
        ref={glowRef}
        className="pointer-events-none absolute -right-20 top-[18%] -z-10 h-80 w-80 rounded-full bg-npf-red/30 blur-[110px] sm:right-4 sm:h-[22rem] sm:w-[22rem]"
      />
      <div
        ref={accentRef}
        className="absolute left-0 top-0 z-0 h-1 w-full max-w-2xl bg-gradient-to-r from-npf-red via-npf-red to-transparent sm:h-1.5 lg:max-w-3xl"
      />

      <div className="relative z-10 mx-auto w-full max-w-[48rem] px-6 pb-6 pt-1 sm:max-w-[52rem] sm:px-8 sm:pb-8 sm:pt-2 md:max-w-[56rem] md:pb-10 md:pt-3 lg:max-w-3xl xl:max-w-4xl">
        <div className="relative z-20 flex w-full flex-col items-center px-2 text-center">
          <div className="perspective-[1000px]">
            <div className="mb-4 sm:mb-5 md:mb-6">
              <HeroVisual />
            </div>

            <p
              ref={eyebrowRef}
              className="mx-auto mb-4 max-w-xl text-xs font-semibold uppercase leading-relaxed tracking-[0.18em] text-npf-red sm:mb-5 sm:text-sm md:mb-6"
            >
              {SITE.shortTagline} · {SITE.region}
            </p>

            <HeroTypingHeadline ref={headlineRef} reduceMotion={reduceMotion} />
          </div>
          <p
            ref={subRef}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/78 sm:mt-8 sm:text-lg"
          >
            {SITE.heroSub}
          </p>
          <div ref={ctaRef} className="relative z-20 mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">
            <a
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-npf-red px-8 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-npf-red/30 transition hover:bg-npf-red-dark hover:shadow-npf-red/40 transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
              href={SITE.quotePhoneTel}
            >
              Get a quote
            </a>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/22 bg-white/5 px-8 py-3 text-center text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-white/12 transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
              to="/services"
            >
              View services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
