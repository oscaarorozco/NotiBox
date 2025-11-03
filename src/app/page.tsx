import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RootPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="text-center max-w-2xl">
        <h1 className="glitch relative text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-foreground w-full">
          NotiBox
        </h1>
        <p className="mt-4 text-md sm:text-lg md:text-xl text-muted-foreground">
          Tu espacio personal para organizar notas, enlaces e imágenes. Minimalista, potente y siempre a tu alcance.
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/dashboard">
              Acceder al Panel
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
      <footer className="absolute bottom-4 text-sm text-muted-foreground">
        Diseñado con <span className="text-primary">♥</span> para la organización.
      </footer>
    </div>
  );
}
