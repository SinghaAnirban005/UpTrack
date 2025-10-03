"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { HTTP_URL } from "@/config/var";

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

  const { websiteId } = useParams()

  const router = useRouter()

  useEffect(() => {
    checkAuth();
    fetchWebsiteAndStatus();
  }, [websiteId]);

  const checkAuth = () => {
    const authToken = localStorage.getItem("authToken")
    if(!authToken){
        router.push("/auth")
    }
  };

  const fetchWebsiteAndStatus = async () => {
    try {
      const authToken = localStorage.getItem("authToken")

      const websiteData = await axios.get(`${HTTP_URL}/website/${websiteId}`, {
        withCredentials: true,
        headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
      })

      console.log(websiteData)

      setWebsite(websiteData.data.data.data || []);
      setStatusChecks(websiteData.data.data.status || [])
    } catch (error: any) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status.toLowerCase() === "up"
      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
      : "bg-red-500/20 text-red-300 border-red-500/30";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!website) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Website not found</p>
          <Button onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            <a
            href={website.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            {website.url}
          </a>
          </h1>
        </div>

        <div className="border border-border rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Status History ({statusChecks.length} checks)
          </h2>

          {statusChecks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No status checks recorded yet
            </p>
          ) : (
            <div className="space-y-4">
              {statusChecks.map((check) => (
                <div
                  key={check.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Badge
                      variant="outline"
                      className={getStatusColor(check.status)}
                    >
                      {check.status}
                    </Badge>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(check.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(check.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {check.response_time_ms !== null && (
                      <p className="text-sm text-foreground">
                        {check.response_time_ms}ms
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {check.region_id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsiteDetail;
