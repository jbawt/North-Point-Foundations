import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '../content/siteCopy.ts';

gsap.registerPlugin(ScrollTrigger);

/** Two-line hero — “below grade” + “above expectations” */
const HEADLINE_LINE1 = ['Below', 'grade.'] as const;
const HEADLINE_LINE2 = ['Above', 'expectations.'] as const;

export function HomeHero() {
  const rootRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const words = root.querySelectorAll('.hero-word');

      gsap.set(words, { y: 56, opacity: 0, rotateX: -32 });
      gsap.set(eyebrowRef.current, { y: 20, opacity: 0 });
      gsap.set(subRef.current, { y: 28, opacity: 0 });
      gsap.set(ctaRef.current, { y: 24, opacity: 0 });
      gsap.set(accentRef.current, { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(glowRef.current, { opacity: 0, scale: 0.88 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to(accentRef.current, { scaleX: 1, duration: 1, ease: 'power2.inOut' }, 0)
        .to(glowRef.current, { opacity: 1, scale: 1, duration: 1.15, ease: 'power2.out' }, 0.08)
        .to(eyebrowRef.current, { y: 0, opacity: 1, duration: 0.65 }, 0.22)
        .to(
          words,
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.82,
            stagger: 0.065,
            ease: 'power3.out',
          },
          0.32,
        )
        .to(subRef.current, { y: 0, opacity: 1, duration: 0.72 }, '-=0.42')
        .to(ctaRef.current, { y: 0, opacity: 1, duration: 0.62, ease: 'power2.out' }, '-=0.48');

      gsap.to(glowRef.current, {
        opacity: 0.68,
        scale: 1.07,
        duration: 3.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 2,
        delay: 1.1,
      });

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
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative isolate flex min-h-[min(88vh,50rem)] w-full flex-col justify-center overflow-hidden bg-npf-charcoal py-20 sm:min-h-[min(90vh,54rem)] sm:py-24 md:py-28"
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

      <div className="relative z-10 mx-auto grid w-full max-w-none items-center gap-10 px-5 sm:gap-14 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-12 lg:pl-10 lg:pr-0 xl:pl-14">
        <div>
          <div className="perspective-[1000px]">
            <p
              ref={eyebrowRef}
              className="mb-4 max-w-xl text-xs font-semibold uppercase leading-relaxed tracking-[0.18em] text-npf-red sm:mb-5 sm:text-sm"
            >
              {SITE.shortTagline} · {SITE.region}
            </p>
            <h1 className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block">
                {HEADLINE_LINE1.map((word, i) => (
                  <span
                    key={`l1-${word}-${i}`}
                    className="hero-word mr-[0.1em] inline-block origin-bottom [transform-style:preserve-3d] last:mr-0 sm:mr-[0.14em]"
                  >
                    {word}
                  </span>
                ))}
              </span>
              <span className="mt-1 block sm:mt-2">
                {HEADLINE_LINE2.map((word, i) => (
                  <span
                    key={`l2-${word}-${i}`}
                    className="hero-word mr-[0.1em] inline-block origin-bottom [transform-style:preserve-3d] last:mr-0 sm:mr-[0.14em]"
                  >
                    {word}
                  </span>
                ))}
              </span>
            </h1>
          </div>
          <p
            ref={subRef}
            className="mt-6 max-w-2xl text-base leading-relaxed text-white/78 sm:mt-8 sm:text-lg"
          >
            {SITE.heroSub}
          </p>
          <div ref={ctaRef} className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4">
            <a
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-npf-red px-8 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-npf-red/30 transition hover:bg-npf-red-dark hover:shadow-npf-red/40 transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
              href="tel:+15555550100"
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

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-28 bg-gradient-to-t from-white via-white/85 to-transparent" />
    </section>
  );
}
