import { PERSON, SOCIALS } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="px-4 pb-10 md:px-6">
      <div className="flex flex-col gap-6 mx-auto max-w-6xl border-t border-border pt-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="type-display text-3xl">{PERSON.name}</p>
          <p className="mt-3 type-label opacity-50">{PERSON.role}</p>
        </div>
        <ul className="flex gap-8">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor="Open ↗"
                className="type-label link-underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="type-label opacity-35">© {new Date().getFullYear()} {PERSON.name}</p>
      </div>
    </footer>
  );
}
