const STATUS_MAP = {
  available: {
    label: "Available",
    dot: "#45664B",
    style: {
      backgroundColor: "#E7EFE7",
      color: "#45664B",
      border: "1px solid #D4E2D4",
    },
  },
  few_beds_left: {
    label: "Few Beds Left",
    dot: "#9C6A1A",
    style: {
      backgroundColor: "#FEF3E2",
      color: "#9C6A1A",
      border: "1px solid #F0DFB8",
    },
  },
  fully_occupied: {
    label: "Fully Occupied",
    dot: "#9B3B35",
    style: {
      backgroundColor: "#FDECEA",
      color: "#9B3B35",
      border: "1px solid #F5C8C5",
    },
  },
  unavailable: {
    label: "Temporarily Unavailable",
    dot: "#6B5B55",
    style: {
      backgroundColor: "#EEE9E6",
      color: "#5D4037",
      border: "1px solid #D7CCC8",
    },
  },
};

export default function AvailabilityBadge({ status }) {
  const config = STATUS_MAP[status] || STATUS_MAP.available;
  const isPulse = (status ?? "available") === "available";

  return (
    <span
      className="availability-badge"
      style={config.style}
    >
      <span
        className={`availability-badge__dot${isPulse ? " availability-badge__dot--pulse" : ""}`}
        style={{ backgroundColor: config.dot }}
      />
      {config.label}
    </span>
  );
}
