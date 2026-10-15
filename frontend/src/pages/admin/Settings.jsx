import { useAuth } from "../../context/AuthContext";
import { CONTACT } from "../../constants/content";

export default function AdminSettings() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink mb-1">Settings</h1>
        <p className="text-ink/60 text-sm">Account and property contact details.</p>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-ink mb-4">Admin Profile</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Name</label>
            <input className="input-field" value={user?.name || ""} disabled />
          </div>
          <div>
            <label className="label-field">Email</label>
            <input className="input-field" value={user?.email || ""} disabled />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-ink mb-4">Property Contact Numbers</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {CONTACT.phones.map((p) => (
            <input key={p} className="input-field" value={p} disabled />
          ))}
        </div>
        <p className="text-xs text-ink/40 mt-3">
          Contact numbers are set in src/constants/content.js.
        </p>
      </div>
    </div>
  );
}
