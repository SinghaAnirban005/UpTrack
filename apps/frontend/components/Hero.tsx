"use client"

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import dashboardPreview from "@/public/dashboard-preview.jpg"
import Image from "next/image";
import { useRouter } from "next/navigation";

const Hero = () => {

  const router = useRouter()

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card to-background" />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground">99.99% Uptime Guarantee</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Monitor Your Services
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text">
              With Confidence
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Real-time uptime monitoring, instant alerts, and beautiful status pages. 
            Keep your users informed and your systems running smoothly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="group" onClick={() => router.push("/auth")}>
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-2xl" />
            <div className="relative rounded-xl overflow-hidden border border-primary/20 shadow-2xl">
              <Image 
                src={dashboardPreview} 
                alt="UpTrack Dashboard Preview" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;