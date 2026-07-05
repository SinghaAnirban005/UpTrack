'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardShell } from '@/components/dashboard-shell';
import { ArrowLeft, Loader2, Activity, Clock, Signal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { HTTP_URL } from '@/config/var';

interface StatusCheck {
  id: string;
  status: string;
  response_time_ms: number | null;
  region_id: string;
  createdAt: string;
}

interface Website {
  id: string;
  url: string;
}

const WebsiteDetail = () => {
  const [website, setWebsite] = useState<Website | null>(null);
  const [statusChecks, setStatusChecks] = useState<StatusCheck[]>([]);
  const [loading, setLoading] = useState(true);

  const { websiteId } = useParams();

  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchWebsiteAndStatus();
  }, [websiteId]);

  const checkAuth = () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      router.push('/auth');
    }
  };

  const fetchWebsiteAndStatus = async () => {
    try {
      const authToken = localStorage.getItem('authToken');

      const websiteData = await axios.get(`${HTTP_URL}/website/${websiteId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      console.log(websiteData);

      setWebsite(websiteData.data.data.data || []);
      setStatusChecks(websiteData.data.data.status || []);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status.toLowerCase() === 'up'
      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
      : 'bg-red-500/15 text-red-300 border-red-500/30';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (!website) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950">
        <p className="text-zinc-400">Website not found</p>
        <Button onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const latestStatus = statusChecks[statusChecks.length - 1]?.status ?? 'unknown';
  const upChecks = statusChecks.filter((c) => c.status.toLowerCase() === 'up').length;
  const uptimePct =
    statusChecks.length > 0 ? Math.round((upChecks / statusChecks.length) * 100) : null;
  const responseTimes = statusChecks
    .map((c) => c.response_time_ms)
    .filter((t): t is number => t !== null);
  const avgResponseMs =
    responseTimes.length > 0
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : null;

  return (
    <DashboardShell>
      <div className="mx-auto max-w-5xl px-6 py-10 md:px-10">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="mb-6 -ml-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <a
            href={website.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-semibold tracking-tight text-zinc-50 transition-colors hover:text-zinc-300"
          >
            {website.url}
          </a>
          <p className="mt-1 text-sm text-zinc-500">Uptime history and response times</p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="gap-2 py-5">
            <CardContent className="flex items-center justify-between px-5">
              <div>
                <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
                  Current status
                </p>
                <div className="mt-2">
                  <Badge variant="outline" className={getStatusColor(latestStatus)}>
                    {latestStatus}
                  </Badge>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800/60 text-zinc-300">
                <Activity className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="gap-2 py-5">
            <CardContent className="flex items-center justify-between px-5">
              <div>
                <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
                  Uptime
                </p>
                <p className="mt-1 text-2xl font-semibold text-zinc-50">
                  {uptimePct !== null ? `${uptimePct}%` : '—'}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                <Signal className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="gap-2 py-5">
            <CardContent className="flex items-center justify-between px-5">
              <div>
                <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
                  Avg response
                </p>
                <p className="mt-1 text-2xl font-semibold text-zinc-50">
                  {avgResponseMs !== null ? `${avgResponseMs}ms` : '—'}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
                <Clock className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="px-6">
            <h2 className="mb-6 text-lg font-semibold text-zinc-50">
              Status History{' '}
              <span className="font-normal text-zinc-500">({statusChecks.length} checks)</span>
            </h2>

            {statusChecks.length === 0 ? (
              <p className="py-8 text-center text-zinc-500">No status checks recorded yet</p>
            ) : (
              <div className="space-y-2">
                {statusChecks.map((check) => (
                  <div
                    key={check.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-800/60 p-4 transition-colors hover:bg-zinc-800/30"
                  >
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className={getStatusColor(check.status)}>
                        {check.status}
                      </Badge>
                      <div>
                        <p className="text-sm text-zinc-300">
                          {formatDistanceToNow(new Date(check.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {new Date(check.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {check.response_time_ms !== null && (
                        <p className="text-sm text-zinc-200">{check.response_time_ms}ms</p>
                      )}
                      <p className="text-xs text-zinc-500">{check.region_id}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default WebsiteDetail;
