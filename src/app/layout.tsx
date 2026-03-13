import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pokémon Team Picker",
  description:
    "Build your dream Pokémon team and analyze offensive type coverage.",
  keywords: ["pokemon", "team builder", "type coverage", "pokedex"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="app-header">
            <div className="header-inner">
              <div className="logo">
                <span className="logo-icon">⚡</span>
                <span className="logo-text">Pokémon Team Picker</span>
              </div>
              <p className="logo-tagline">Build your team · Analyze coverage</p>
            </div>
          </header>
          <main className="app-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
