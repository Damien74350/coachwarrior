import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "../components/TopNav";

export const metadata: Metadata = {
  title: "WARfit — Gamifie ta forme. Fidélise ton club.",
  description:
    "WARfit transforme le fitness en jeu : régularité récompensée pour les membres, dashboard de fidélisation complet pour les clubs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen antialiased">
        <TopNav />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24 pt-6">
          {children}
        </main>
        <footer className="border-t border-border mt-16 py-8 text-center text-xs text-muted">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p>© {new Date().getFullYear()} WARfit — La régularité gagne. Toujours.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
