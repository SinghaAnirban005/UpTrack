import { Activity, Bell, BarChart3, Globe, Lock, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Activity,
    title: "Real-Time Monitoring",
    description: "Monitor your websites, APIs, and services with checks every 30 seconds from multiple global locations."
  },
  {
    icon: Bell,
    title: "Instant Alerts",
    description: "Get notified immediately via email, SMS, Slack, or webhooks when your services go down."
  },
  {
    icon: Globe,
    title: "Status Pages",
    description: "Beautiful, customizable status pages to keep your users informed about system health."
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track response times, uptime percentages, and identify performance trends over time."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Our monitoring infrastructure ensures sub-second detection and alert delivery worldwide."
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "SOC 2 compliant with end-to-end encryption and advanced security features built-in."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to
            <span className="text-primary"> Stay Online</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful monitoring tools designed for modern teams who can't afford downtime
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="bg-card/50 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.1)] group"
            >
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
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
