'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, LayoutGrid, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [{ label: 'Monitors', href: '/dashboard', icon: LayoutGrid }];

interface DashboardShellProps {
  children: ReactNode;
  onLogout?: () => void;
}

export function DashboardShell({ children, onLogout }: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-zinc-800/60 bg-zinc-900/40 px-3 py-5 md:flex">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
            <Activity className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-zinc-50">UpTrack</span>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-zinc-800/70 text-zinc-50'
                    : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-100'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-all duration-150 hover:scale-[1.02] hover:bg-zinc-800/40 hover:text-zinc-100"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        )}
      </aside>

      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-zinc-800/60 bg-zinc-950/90 px-4 backdrop-blur-sm md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
            <Activity className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-zinc-50">UpTrack</span>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </header>

      <div className="flex-1 pt-14 md:pt-0 md:pl-60">{children}</div>
    </div>
  );
}
