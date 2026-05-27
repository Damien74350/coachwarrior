import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoachWarrior — Crypto & Stock Intelligence",
  description:
    "Analyse complète d'une crypto ou d'une action : prix, métriques, indicateurs techniques, et signal de positionnement.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
