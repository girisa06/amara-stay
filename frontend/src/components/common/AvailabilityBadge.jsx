const STATUS_MAP = {
  available: { label: "Available", className: "badge-success" },
  few_beds_left: { label: "Few Beds Left", className: "badge-warning" },
  fully_occupied: { label: "Fully Occupied", className: "badge-danger" },
};

export default function AvailabilityBadge({ status }) {
  const config = STATUS_MAP[status] || STATUS_MAP.available;
  return <span className={config.className}>{config.label}</span>;
}
