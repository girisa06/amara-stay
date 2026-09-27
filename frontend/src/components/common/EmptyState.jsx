export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      {Icon && (
        <div className="h-14 w-14 rounded-full bg-secondary/40 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="text-ink/60 max-w-sm">{description}</p>}
    </div>
  );
}
