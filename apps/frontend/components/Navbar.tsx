'use client';

import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="border-border/40 bg-background/80 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="text-primary h-6 w-6" />
            <span className="text-xl font-bold">UpTrack</span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Pricing
            </a>
            <a
              href="#docs"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Docs
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push('/auth')}>
              Sign In
            </Button>
            <Button size="sm" onClick={() => router.push('/auth')}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
