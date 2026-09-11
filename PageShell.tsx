import { ReactNode } from "react";

export function PageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10 md:py-14">
      <header className="mb-8 md:mb-12">
        {eyebrow && (
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            {eyebrow}
          </span>
        )}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-3 text-muted-foreground max-w-2xl">{description}</p>
        )}
      </header>
      {children}
    </main>
  );
}
