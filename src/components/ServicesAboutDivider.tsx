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
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="h-px min-w-0 flex-1 bg-gradient-to-r from-transparent via-npf-border to-npf-border" />
          <span
            className="inline-flex h-2 w-2 shrink-0 rounded-full bg-[#BE1E2D]"
            style={{ boxShadow: '0 0 12px rgba(190,30,45,0.45)' }}
          />
          <div className="h-px min-w-0 flex-1 bg-gradient-to-l from-transparent via-npf-border to-npf-border" />
        </div>
      </div>
    </div>
  );
}
