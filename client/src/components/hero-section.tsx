import { Button } from "@/components/ui/button";
import { ChevronDown, Play } from "lucide-react";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center text-center text-white">
      {/* Background image with overlay */}
      <div className="absolute inset-0 hero-gradient">
        <img
          src="https://assets.seobotai.com/architecturehelper.com/673bf7b50c149f48d61fa9d2-1731984576727.jpg"
          alt="Congregation worshipping with raised hands"
          className="w-full h-full object-cover mix-blend-multiply"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 bg-black bg-opacity-50 py-16 rounded-lg flex-1 flex-col items-center">
        <div className="mb-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" data-testid="hero-title">
            Welcome Home
          </h1>
          <div className="text-xl md:text-2xl mb-8 font-light leading-relaxed" data-testid="hero-quote">
            <p className="mb-4">"For where two or three gather in my name,</p>
            <p className="mb-4">there am I with them."</p>
            <p className="text-lg opacity-90">- Matthew 18:20</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/events">
            <Button 
              size="lg" 
              className="bg-accent text-accent-foreground hover:opacity-90 shadow-lg text-lg px-8 py-4"
              data-testid="button-join-sunday"
            >
              Join Us Sunday
            </Button>
          </Link>
          <Link href="/sermons">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-primary hover:bg-primary hover:text-white shadow-lg text-lg px-8 py-4"
              data-testid="button-watch-live"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Live
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce" data-testid="scroll-indicator">
        <ChevronDown className="h-8 w-8" />
      </div>
    </section>
  );
}
