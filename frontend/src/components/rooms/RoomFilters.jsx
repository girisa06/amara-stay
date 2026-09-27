import { SlidersHorizontal, X } from "lucide-react";

const ROOM_TYPES = [
  { value: "", label: "All Types" },
  { value: "single", label: "Single Sharing" },
  { value: "double", label: "Double Sharing" },
  { value: "triple", label: "Triple Sharing" },
  { value: "four", label: "Four Sharing" },
];

const AVAILABILITY_OPTIONS = [
  { value: "", label: "Any Availability" },
  { value: "available", label: "Available" },
  { value: "few_beds_left", label: "Few Beds Left" },
  { value: "fully_occupied", label: "Fully Occupied" },
];

const SORT_OPTIONS = [
  { value: "", label: "Sort By" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

export default function RoomFilters({ filters, onChange, onReset }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });
  const hasActiveFilters = Object.values(filters).some((v) => v);

  return (
    <div className="card p-5 mb-8">
      <div className="flex items-center gap-2 mb-4 text-ink font-medium">
        <SlidersHorizontal className="h-4 w-4 text-primary" /> Filter & Sort
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <select
          className="input-field"
          value={filters.room_type}
          onChange={(e) => update("room_type", e.target.value)}
        >
          {ROOM_TYPES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Rent"
          className="input-field"
          value={filters.min_rent}
          onChange={(e) => update("min_rent", e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Rent"
          className="input-field"
          value={filters.max_rent}
          onChange={(e) => update("max_rent", e.target.value)}
        />

        <select
          className="input-field"
          value={filters.availability}
          onChange={(e) => update("availability", e.target.value)}
        >
          {AVAILABILITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          className="input-field"
          value={filters.sort}
          onChange={(e) => update("sort", e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary font-medium"
        >
          <X className="h-3.5 w-3.5" /> Clear Filters
        </button>
      )}
    </div>
  );
}
