export default function SectionHeading({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
      <div>
        <h2 className="font-display text-[26px] font-medium tracking-tight text-ink sm:text-[32px]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 max-w-md text-[14px] text-ink-soft">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
