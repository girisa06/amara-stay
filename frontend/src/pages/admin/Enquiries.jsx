import { useEffect, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { getEnquiries, replyEnquiry } from "../../api/enquiries";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);

  const load = () => {
    setLoading(true);
    getEnquiries()
      .then(setEnquiries)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleReply = async (id) => {
    const reply = replyDrafts[id];
    if (!reply?.trim()) return;
    setSavingId(id);
    try {
      await replyEnquiry(id, { reply, is_resolved: true });
      load();
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink mb-1">Enquiries</h1>
        <p className="text-ink/60 text-sm">View and respond to tenant enquiries.</p>
      </div>

      {loading ? (
        <Loader />
      ) : enquiries.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No enquiries yet" />
      ) : (
        <div className="grid gap-4">
          {enquiries.map((enquiry) => (
            <div key={enquiry.id} className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-ink">{enquiry.name}</p>
                <span className={enquiry.is_resolved ? "badge-success" : "badge-warning"}>
                  {enquiry.is_resolved ? "Resolved" : "Follow-up Needed"}
                </span>
              </div>
              <p className="text-xs text-ink/50 mb-3">
                {enquiry.phone} {enquiry.email ? `• ${enquiry.email}` : ""} •{" "}
                {new Date(enquiry.created_at).toLocaleDateString("en-IN")}
              </p>
              <p className="text-sm text-ink/70 bg-secondary/20 rounded-lg p-3 mb-3">
                {enquiry.message}
              </p>

              {enquiry.reply && (
                <p className="text-sm text-primary bg-primary/5 rounded-lg p-3 mb-3">
                  <span className="font-medium">Your reply: </span>
                  {enquiry.reply}
                </p>
              )}

              <div className="flex gap-2">
                <input
                  className="input-field flex-1"
                  placeholder="Type a reply..."
                  value={replyDrafts[enquiry.id] ?? enquiry.reply ?? ""}
                  onChange={(e) =>
                    setReplyDrafts((prev) => ({ ...prev, [enquiry.id]: e.target.value }))
                  }
                />
                <button
                  onClick={() => handleReply(enquiry.id)}
                  disabled={savingId === enquiry.id}
                  className="btn-primary px-4"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
