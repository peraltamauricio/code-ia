import type { Metadata, Viewport } from "next";
import { Chakra_Petch, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./extras.css";

const display = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "CODE +IA",
  description:
    "Taller de programación e inteligencia artificial para adolescentes. HTML, CSS y JavaScript con Claude, ChatGPT y Gemini como copilotos.",
};

// El sitio es SIEMPRE oscuro, aunque la compu esté en modo claro.
export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0a0714",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${mono.variable}`}
      style={{ background: "#0a0714", colorScheme: "dark" }}
    >
      <body>{children}</body>
    </html>
  );
}
