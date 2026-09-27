import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

const ROOM_TYPES = ["single", "double", "triple", "four"];

export default function RoomFormModal({ room, onClose, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: room
      ? {
          ...room,
          facilities: room.facilities?.join(", ") || "",
          photo_urls: room.photos?.map((p) => p.url).join("\n") || "",
        }
      : {
          room_number: "",
          room_type: "single",
          rent: "",
          deposit: "",
          total_beds: 1,
          available_beds: 1,
          room_size: "",
          description: "",
          facilities: "",
          food_plan: "",
          house_rules: "",
          photo_urls: "",
        },
  });

  useEffect(() => {
    reset(
      room
        ? {
            ...room,
            facilities: room.facilities?.join(", ") || "",
            photo_urls: room.photos?.map((p) => p.url).join("\n") || "",
          }
        : undefined
    );
  }, [room, reset]);

  const submit = async (data) => {
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        rent: Number(data.rent),
        deposit: Number(data.deposit),
        total_beds: Number(data.total_beds),
        available_beds: Number(data.available_beds),
        facilities: data.facilities
          ? data.facilities.split(",").map((f) => f.trim()).filter(Boolean)
          : [],
        photo_urls: data.photo_urls
          ? data.photo_urls.split("\n").map((u) => u.trim()).filter(Boolean)
          : [],
      };
      await onSubmit(payload);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl2 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary sticky top-0 bg-white">
          <h3 className="font-semibold text-ink text-lg">{room ? "Edit Room" : "Add Room"}</h3>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-ink/50" />
          </button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="p-6 space-y-4">
          {error && <p className="text-danger text-sm bg-danger/10 rounded-lg px-4 py-2.5">{error}</p>}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Room Number</label>
              <input className="input-field" {...register("room_number", { required: true })} />
              {errors.room_number && <p className="text-danger text-xs mt-1">Required</p>}
            </div>
            <div>
              <label className="label-field">Room Type</label>
              <select className="input-field" {...register("room_type", { required: true })}>
                {ROOM_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)} Sharing
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Monthly Rent (₹)</label>
              <input type="number" className="input-field" {...register("rent", { required: true })} />
            </div>
            <div>
              <label className="label-field">Deposit (₹)</label>
              <input type="number" className="input-field" {...register("deposit", { required: true })} />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="label-field">Total Beds</label>
              <input type="number" className="input-field" {...register("total_beds", { required: true })} />
            </div>
            <div>
              <label className="label-field">Available Beds</label>
              <input
                type="number"
                className="input-field"
                {...register("available_beds", { required: true })}
              />
            </div>
            <div>
              <label className="label-field">Room Size</label>
              <input className="input-field" placeholder="e.g. 120 sq.ft" {...register("room_size")} />
            </div>
          </div>

          <div>
            <label className="label-field">Description</label>
            <textarea rows={2} className="input-field" {...register("description")} />
          </div>

          <div>
            <label className="label-field">Facilities (comma-separated)</label>
            <input className="input-field" placeholder="WiFi, AC, Wardrobe" {...register("facilities")} />
          </div>

          <div>
            <label className="label-field">Food Plan</label>
            <textarea rows={2} className="input-field" {...register("food_plan")} />
          </div>

          <div>
            <label className="label-field">House Rules</label>
            <textarea rows={2} className="input-field" {...register("house_rules")} />
          </div>

          <div>
            <label className="label-field">Photo URLs (one per line)</label>
            <textarea
              rows={3}
              className="input-field"
              placeholder="https://..."
              {...register("photo_urls")}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-light flex-1">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? "Saving..." : room ? "Update Room" : "Add Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
