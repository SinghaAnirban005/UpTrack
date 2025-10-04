'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import dashboardPreview from '@/public/dashboard-preview.jpg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Hero = () => {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      <div className="from-card to-background absolute inset-0 bg-gradient-to-b" />

      <div className="bg-primary/5 absolute top-0 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="bg-primary/10 border-primary/20 mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-2">
            <CheckCircle2 className="text-primary h-4 w-4" />
            <span className="text-foreground text-sm">99.99% Uptime Guarantee</span>
          </div>

          <h1 className="from-foreground to-foreground/70 mb-6 bg-gradient-to-r bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
            Monitor Your Services
            <br />
            <span className="from-primary to-accent bg-gradient-to-r bg-clip-text">
              With Confidence
            </span>
          </h1>

          <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-xl">
            Real-time uptime monitoring, instant alerts, and beautiful status pages. Keep your users
            informed and your systems running smoothly.
          </p>

          <div className="mb-16 flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group" onClick={() => router.push('/auth')}>
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>

          <div className="relative mx-auto max-w-5xl">
            <div className="from-primary/20 to-accent/20 absolute -inset-4 rounded-2xl bg-gradient-to-r blur-2xl" />
            <div className="border-primary/20 relative overflow-hidden rounded-xl border shadow-2xl">
              <Image
                src={dashboardPreview}
                alt="UpTrack Dashboard Preview"
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
