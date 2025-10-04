import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="from-primary/10 via-accent/10 to-primary/10 absolute inset-0 bg-gradient-to-r" />
      <div className="bg-primary/20 absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">Start Monitoring in Minutes</h2>
          <p className="text-muted-foreground mb-10 text-xl">
            Join thousands of teams who trust UpTrack to keep their services online. No credit card
            required for your 14-day trial.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline">
              Schedule a Demo
            </Button>
          </div>

          <p className="text-muted-foreground mt-6 text-sm">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
