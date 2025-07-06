import { BrainCircuit, Briefcase, Lightbulb } from "lucide-react";
import Link from "next/link";
import StrategyGenerator from "@/components/app/strategy-generator";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">Brainstorm Buddy</span>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section id="hero" className="container py-12 text-center lg:py-24">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl font-headline">
            From Idea to Plan in Seconds
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Instantly generate a Go-To-Market strategy, feature roadmap, and SWOT analysis from a single-line startup idea.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" className="font-bold">
              <a href="#generator">Generate Strategy Now</a>
            </Button>
          </div>
        </section>
        
        <section className="container pb-12">
           <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                <Briefcase className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold font-headline">Overcome Analysis Paralysis</h3>
              <p className="mt-2 text-muted-foreground">Stop wondering and start planning. Get a structured strategic outline in moments.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                <Lightbulb className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold font-headline">Validate Faster with AI</h3>
              <p className="mt-2 text-muted-foreground">Leverage AI to explore different angles and possibilities for your business idea.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                <BrainCircuit className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold font-headline">Get Instant Strategic Clarity</h3>
              <p className="mt-2 text-muted-foreground">No more blank pages. Receive a comprehensive plan to guide your next steps.</p>
            </div>
          </div>
        </section>

        <section id="generator" className="container py-12 lg:py-24">
          <StrategyGenerator />
        </section>
      </main>

      <footer className="border-t">
        <div className="container flex h-14 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Powered by AI. Built for Founders.
          </p>
        </div>
      </footer>
    </div>
  );
}
