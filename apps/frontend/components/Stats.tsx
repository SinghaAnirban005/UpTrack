const stats = [
  { value: "99.99%", label: "Average Uptime" },
  { value: "50M+", label: "Checks Per Day" },
  { value: "<30s", label: "Alert Response Time" },
  { value: "150+", label: "Countries Monitored" }
];

const Stats = () => {
  return (
    <section className="py-20 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
