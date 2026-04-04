/**
 * Visual break between Services and About on the home page.
 */
export function ServicesAboutDivider() {
  return (
    <div
      className="w-full bg-gradient-to-b from-npf-surface to-white py-7 sm:py-9"
      role="separator"
      aria-hidden="true"
    >
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <div className="group flex items-center gap-4 sm:gap-5">
          <div className="h-px min-w-0 flex-1 bg-gradient-to-r from-transparent via-npf-border to-npf-border transition-[background] duration-500 ease-out group-hover:via-[#BE1E2D]/40" />
          <span
            className="npf-sleek-lift-subtle inline-flex h-2 w-2 shrink-0 cursor-default rounded-full bg-[#BE1E2D] transition-[box-shadow,transform] duration-300 group-hover:shadow-[0_0_22px_rgba(190,30,45,0.85)]"
            style={{ boxShadow: '0 0 12px rgba(190,30,45,0.45)' }}
          />
          <div className="h-px min-w-0 flex-1 bg-gradient-to-l from-transparent via-npf-border to-npf-border transition-[background] duration-500 ease-out group-hover:via-[#BE1E2D]/40" />
        </div>
      </div>
    </div>
  );
}
