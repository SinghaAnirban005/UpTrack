"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, ExternalLink, Loader2 } from "lucide-react";
import { HTTP_URL } from "@/config/var";
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns";
import axios from "axios";

type User = {
    id: string,
    username: string,
    password: string
}

type websiteTicks = {
    id: string,
    status: 'up' | 'down' | 'unknown',
    response_time_ms: number,
    website_id: string,
    region_id: string,
    createdAt: Date
}

interface Website {
  id: string;
  url: string;
  user_id: string;
  time_added: string;
  user: User,
  ticks: websiteTicks[]
}

const Dashboard = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [err, setErr] = useState(null)

  useEffect(() => {
    checkAuth();

    fetchWebsites();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken')

    if(!token){
        router.push("/auth")
    }
  };

  const handleLogout = async() => {

    const authToken = localStorage.getItem("authToken")

    const res = await axios.post(`${HTTP_URL}/logout`, {}, {
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })

    if(res.status !== 200){
      return;
    }

    localStorage.removeItem("authToken")
    router.push("/auth")
  }

  const fetchWebsites = async () => {
    try {

      const authToken = localStorage.getItem('authToken')

    const data = await axios.get(`${HTTP_URL}/website`, {
        withCredentials: true,
        headers: {
            "Authorization": `Bearer ${authToken}`
        }
    })

    const websites = data.data.websites

      setWebsites(websites || []);
    } catch (error: any) {
      setErr(error)
    } finally {
      setLoading(false);
    }
  };

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const authToken = localStorage.getItem('authToken')

    try {

      const websites = await axios.post(`${HTTP_URL}/website`, {
        url: url
      }, {
        withCredentials: true,
        headers: {
            "Authorization": `Bearer ${authToken}`
        }
      })

      setUrl("");
      setIsDialogOpen(false);
      fetchWebsites();

    } catch (error: any) {
    //   toast({
    //     variant: "destructive",
    //     title: "Error",
    //     description: error.message,
    //   });
      console.error(error)
      setErr(error)
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "up":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "down":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
  <div>
    <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
    <p className="text-muted-foreground">Manage and monitor your websites</p>
  </div>

  <div className="flex items-center gap-2">
    <Button 
      variant="outline" 
      onClick={handleLogout}
    >
      Logout
    </Button>
    
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
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
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Website"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</div>

        {websites.length === 0 ? (
          <div className="border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground mb-4">No websites added yet</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Website
            </Button>
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-accent/50">
                  <TableHead className="text-foreground">Name</TableHead>
                  <TableHead className="text-foreground">URL</TableHead>
                  <TableHead className="text-foreground">Status</TableHead>
                  <TableHead className="text-foreground">Last Checked</TableHead>
                  <TableHead className="text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {websites.map((website) => (
                  <TableRow key={website.id} className="border-border hover:bg-accent/50">
                    <TableCell className="font-medium text-foreground">
                      {website.url}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {website.url}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(website?.ticks[0]?.status === undefined ? 'unknown' : website.ticks[website.ticks.length - 1].status)}>
                        {website?.ticks[website.ticks.length - 1]?.status || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                     {
                       website?.ticks[0]?.createdAt === undefined ? "-" : formatDistanceToNow(new Date(website?.ticks[website.ticks.length - 1]?.createdAt), {
                        addSuffix: true,
                      })
                     }
                    </TableCell>
                    <TableCell>
                      <a
                        href={website.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
