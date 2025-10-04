import { Activity, Bell, BarChart3, Globe, Lock, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Activity,
    title: 'Real-Time Monitoring',
    description:
      'Monitor your websites, APIs, and services with checks every 30 seconds from multiple global locations.',
  },
  {
    icon: Bell,
    title: 'Instant Alerts',
    description:
      'Get notified immediately via email, SMS, Slack, or webhooks when your services go down.',
  },
  {
    icon: Globe,
    title: 'Status Pages',
    description:
      'Beautiful, customizable status pages to keep your users informed about system health.',
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    description:
      'Track response times, uptime percentages, and identify performance trends over time.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Our monitoring infrastructure ensures sub-second detection and alert delivery worldwide.',
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description:
      'SOC 2 compliant with end-to-end encryption and advanced security features built-in.',
  },
];

const Features = () => {
  return (
    <section id="features" className="relative py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            Everything You Need to
            <span className="text-primary"> Stay Online</span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Powerful monitoring tools designed for modern teams who can't afford downtime
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card/50 border-border/50 hover:border-primary/50 group transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.1)]"
            >
              <CardContent className="p-6">
                <div className="bg-primary/10 group-hover:bg-primary/20 mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-colors">
                  <feature.icon className="text-primary h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
