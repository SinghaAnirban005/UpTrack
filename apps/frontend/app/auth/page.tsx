'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { HTTP_URL } from '@/config/var';

export default function Auth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast('Error', {
        description: 'Please fill in all fields',
      });
      return;
    }

    if (password.length < 6) {
      toast('Error', {
        description: 'Password must be at least 6 characters',
      });
      return;
    }

    setLoading(true);

    const res = await axios.post(`${HTTP_URL}/signup`, {
      username: username,
      password: password,
    });

    setUsername(username)
    setPassword(password)
    setLoading(false);

    if (res.status !== 200) {
      toast('Sign up failed', {
        description: 'Sign up failed',
      });
    } else {
      toast('Success', {
        description: 'Account created successfully. You can now sign in.',
      });

      handleSignIn(e);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast('Error', {
        description: 'Please fill in all fields',
      });
      return;
    }

    setLoading(true);

    const res = await axios.post(`${HTTP_URL}/login`, {
      username: username,
      password: password,
    });

    setLoading(false);

    const userData = res.data;

    const userToken = userData.message.token;
    localStorage.setItem('authToken', userToken);

    if (res.status !== 200) {
      toast('Sign in failed', {
        description: res.statusText,
      });
    } else {
      toast('Welcome Back !!', {
        description: "You've have succesfully signed in",
      });

      router.push('/dashboard');
    }
  };

  return (
    <div className="from-card to-background flex min-h-screen items-center justify-center bg-gradient-to-b p-4">
      <Card className="border-primary/30 shadow-glow w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="from-primary to-accent bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent">
            UpTrack
          </CardTitle>
          <CardDescription>Monitor your services with confidence</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-username">Username</Label>
                  <Input
                    id="signin-username"
                    placeholder="anirban-123"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-username">Username</Label>
                  <Input
                    id="signin-username"
                    placeholder="anirban-123"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-muted-foreground text-xs">Must be at least 6 characters</p>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
