const stats = [
  { value: '99.99%', label: 'Average Uptime' },
  { value: '50M+', label: 'Checks Per Day' },
  { value: '<30s', label: 'Alert Response Time' },
  { value: '150+', label: 'Countries Monitored' },
];

const Stats = () => {
  return (
    <section className="border-border/50 border-y py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-primary mb-2 text-4xl font-bold md:text-5xl">{stat.value}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
