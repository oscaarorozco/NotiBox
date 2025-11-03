import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RootPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 overflow-hidden">
      <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] animate-grid-pan"></div>
      <div className="relative text-center max-w-4xl z-10">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-headline font-bold text-transparent bg-clip-text animate-aurora-glitch">
          NotiBox
        </h1>
        <div className="mt-12">
          <Button asChild size="lg">
            <Link href="/dashboard">
              Acceder al Panel
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
      <footer className="absolute bottom-4 text-sm text-muted-foreground z-10">
        Diseñado con <span className="text-primary">♥</span> para la organización.
      </footer>
    </div>
  );
}
