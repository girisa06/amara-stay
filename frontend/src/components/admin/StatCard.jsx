export default function StatCard({ icon: Icon, label, value, accent = "primary" }) {
  const accentClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
  };

  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${accentClasses[accent]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-ink font-display">{value}</p>
        <p className="text-xs text-ink/50">{label}</p>
      </div>
    </div>
  );
}
