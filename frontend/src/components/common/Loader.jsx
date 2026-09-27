export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-ink/60">
      <div className="h-8 w-8 rounded-full border-2 border-secondary border-t-primary animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
