import React from "react";

const navItems = [
  { href: "/", label: "Shell" },
  { href: "/admin/", label: "Admin" },
  { href: "/billing/", label: "Billing" },
  { href: "/dashboard/", label: "Dashboard" }
];

type AppFrameProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

function appHref(path: string) {
  const isLocalDev =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

  if (!isLocalDev) {
    return path;
  }

  return `${window.location.protocol}//${window.location.hostname}:5173${path}`;
}

export function AppFrame({ eyebrow, title, description, children }: AppFrameProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
          <a className="text-lg font-bold text-foreground" href={appHref("/")}>
            Toy Product
          </a>
          <div className="flex gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={appHref(item.href)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/20 hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl p-8">
        <section className="mb-8">
          <p className="text-sm font-medium text-primary">{eyebrow}</p>
          <h1 className="text-4xl font-bold text-foreground">{title}</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">{description}</p>
        </section>
        {children}
      </main>
    </div>
  );
}
