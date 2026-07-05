'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardShell } from '@/components/dashboard-shell';
import { Plus, ExternalLink, Loader2, Globe, CheckCircle2, XCircle } from 'lucide-react';
import { HTTP_URL } from '@/config/var';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { URL_REGEX } from '@/lib/regex';
import axios from 'axios';

type User = {
  id: string;
  username: string;
  password: string;
};

type websiteTicks = {
  id: string;
  status: 'Up' | 'Down' | 'Unknown';
  response_time_ms: number;
  website_id: string;
  region_id: string;
  createdAt: Date;
};

interface Website {
  id: string;
  url: string;
  user_id: string;
  time_added: string;
  user: User;
  ticks: websiteTicks[];
}

const Dashboard = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [err, setErr] = useState(null);

  useEffect(() => {
    checkAuth();

    fetchWebsites();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      router.push('/auth');
    }
  };

  const handleLogout = async () => {
    const authToken = localStorage.getItem('authToken');

    const res = await axios.post(
      `${HTTP_URL}/logout`,
      {},
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (res.status !== 200) {
      return;
    }

    localStorage.removeItem('authToken');
    router.push('/auth');
  };

  const fetchWebsites = async () => {
    try {
      const authToken = localStorage.getItem('authToken');

      const data = await axios.get(`${HTTP_URL}/website`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const websites = data.data.websites;

      setWebsites(websites || []);
    } catch (error: any) {
      setErr(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedUrl = url.trim();

    if (!cleanedUrl) {
      alert('Please enter a URL.');
      return;
    }

    if (!URL_REGEX.test(cleanedUrl)) {
      alert('Please enter a valid website URL (e.g., https://example.com).');
      return;
    }

    setIsSubmitting(true);
    const authToken = localStorage.getItem('authToken');

    try {
      await axios.post(
        `${HTTP_URL}/website`,
        {
          url: cleanedUrl,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setUrl('');
      setIsDialogOpen(false);
      fetchWebsites();
    } catch (error: any) {
      console.error(error);
      setErr(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'up':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'down':
        return 'bg-red-500/15 text-red-300 border-red-500/30';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  const upCount = websites.filter((w) => w.ticks[w.ticks.length - 1]?.status === 'Up').length;
  const downCount = websites.filter((w) => w.ticks[w.ticks.length - 1]?.status === 'Down').length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <DashboardShell onLogout={handleLogout}>
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">Monitors</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Manage and monitor the uptime of your websites
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                Add Website
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleAddWebsite}>
                <DialogHeader>
                  <DialogTitle>Add New Website</DialogTitle>
                  <DialogDescription>
                    Enter the details of the website you want to monitor
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="url">Website URL</Label>
                    <Input
                      id="url"
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onBlur={() => setUrl(url.trim())}
                      placeholder="https://example.com"
                      required
                      className={url.length > 0 && !URL_REGEX.test(url) ? 'border-red-500' : ''}
                    />
                    {url.length > 0 && !URL_REGEX.test(url) && (
                      <p className="mt-1 text-xs text-red-400">Invalid URL format</p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Website'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="gap-2 py-5">
            <CardContent className="flex items-center justify-between px-5">
              <div>
                <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
                  Total monitors
                </p>
                <p className="mt-1 text-2xl font-semibold text-zinc-50">{websites.length}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800/60 text-zinc-300">
                <Globe className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="gap-2 py-5">
            <CardContent className="flex items-center justify-between px-5">
              <div>
                <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
                  Currently up
                </p>
                <p className="mt-1 text-2xl font-semibold text-zinc-50">{upCount}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="gap-2 py-5">
            <CardContent className="flex items-center justify-between px-5">
              <div>
                <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
                  Currently down
                </p>
                <p className="mt-1 text-2xl font-semibold text-zinc-50">{downCount}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/15 text-red-400">
                <XCircle className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {websites.length === 0 ? (
          <Card className="items-center border-dashed py-16 text-center">
            <CardContent className="flex flex-col items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800/60 text-zinc-400">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-zinc-200">No websites added yet</p>
                <p className="mt-1 text-sm text-zinc-500">
                  Add your first website to start monitoring uptime.
                </p>
              </div>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Your First Website
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden py-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Checked</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {websites.map((website) => (
                  <TableRow key={website.id}>
                    <TableCell
                      className="cursor-pointer font-medium text-zinc-100"
                      onClick={() => router.push(`/website/${website.id}`)}
                    >
                      {website.url}
                    </TableCell>
                    <TableCell className="text-zinc-400">{website.url}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusColor(
                          website?.ticks[0]?.status === undefined
                            ? 'unknown'
                            : website.ticks[website.ticks.length - 1].status
                        )}
                      >
                        {website?.ticks[website.ticks.length - 1]?.status || 'Checking'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-400">
                      {website?.ticks[0]?.createdAt === undefined
                        ? '-'
                        : formatDistanceToNow(
                            new Date(website?.ticks[website.ticks.length - 1]?.createdAt),
                            {
                              addSuffix: true,
                            }
                          )}
                    </TableCell>
                    <TableCell className="text-right">
                      <a
                        href={website.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-zinc-400 transition-colors hover:text-zinc-100"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
};

export default Dashboard;
