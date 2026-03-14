import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";

export const metadata: Metadata = {
  title: "Pokémon Team Picker",
  description:
    "Build your dream Pokémon team and analyze offensive type coverage.",
  keywords: ["pokemon", "team builder", "type coverage", "pokedex"],
};

// Inline script that runs before React hydration to set the correct theme
// immediately – prevents a flash of the wrong theme on first load.
const noFlashScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`.trim();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body>
        <div className="app-shell">
          <header className="app-header">
            <div className="header-inner">
              <div className="logo">
                <span className="logo-icon">⚡</span>
                <span className="logo-text">Pokémon Team Picker</span>
              </div>
              <p className="logo-tagline">Build your team · Analyze coverage</p>
              <ThemeToggle />
            </div>
          </header>
          <main className="app-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
