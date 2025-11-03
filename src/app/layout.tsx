import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-body",
  display: 'swap',
});
const bebasNeue = Bebas_Neue({ 
  subsets: ["latin"], 
  variable: "--font-headline",
  weight: "400",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "NotiBox",
  description: "Tu espacio para almacenar ideas y notas en una nebulosa personal.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${bebasNeue.variable} font-body antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
