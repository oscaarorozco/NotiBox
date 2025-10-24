import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-body",
  display: 'swap',
});
const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"], 
  variable: "--font-headline",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Central de Contenido",
  description: "Tu organizador de contenido personal, minimalista y potente.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-body antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
