import { useAuth } from "../../context/AuthContext";

export default function AdminSettings() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink mb-1">Settings</h1>
        <p className="text-ink/60 text-sm">Manage your account and property contact details.</p>
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
        <p className="text-xs text-ink/40 mt-3">
          To change account credentials, please contact your system administrator.
        </p>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-ink mb-4">Property Contact Details</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Owner Phone</label>
            <input className="input-field" value="+91 90000 00000" disabled />
          </div>
          <div>
            <label className="label-field">Owner WhatsApp</label>
            <input className="input-field" value="+91 90000 00000" disabled />
          </div>
          <div className="sm:col-span-2">
            <label className="label-field">Owner Email</label>
            <input className="input-field" value="owner@amarastay.in" disabled />
          </div>
        </div>
        <p className="text-xs text-ink/40 mt-3">
          Contact details are configured via environment variables on the backend
          (OWNER_PHONE, OWNER_WHATSAPP, OWNER_EMAIL).
        </p>
      </div>
    </div>
  );
}
