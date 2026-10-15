import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Phone, MessageCircle, CheckCircle2, Send } from "lucide-react";
import { createEnquiry } from "../api/enquiries";

const QUICK_CONTACTS = [
  {
    icon: Phone,
    label: "Call 9841321999",
    href: "tel:+919841321999",
    className: "btn-outline",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp Owner",
    href: "https://wa.me/919841321999",
    className: "btn bg-success text-white hover:bg-success/90",
  },
  {
    icon: Phone,
    label: "Call 8939934999",
    href: "tel:+918939934999",
    className: "btn-light",
  },
];

export default function Enquiry() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const onSubmit = async (data) => {
    setSubmitError("");
    try {
      await createEnquiry(data);
      setSubmitted(true);
      reset();
    } catch (err) {
      setSubmitError(err.response?.data?.detail || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="section container-page">
      <div className="text-center mb-10 max-w-xl mx-auto">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink mb-2">
          Get In Touch
        </h1>
        <p className="text-ink/60">
          Have a question about AMARA Ladies PG? Send us a message or reach out directly.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="lg:col-span-2 card p-6 sm:p-8">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-10"
            >
              <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-ink mb-2">Message Sent!</h3>
              <p className="text-ink/60 mb-5">
                Thank you for reaching out. We'll get back to you within a few hours.
              </p>
              <button onClick={() => setSubmitted(false)} className="btn-outline">
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {submitError && (
                <p className="text-danger text-sm bg-danger/10 rounded-lg px-4 py-2.5">
                  {submitError}
                </p>
              )}
              <div>
                <label className="label-field">Name</label>
                <input
                  className="input-field"
                  placeholder="Your name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="label-field">Phone</label>
                  <input
                    className="input-field"
                    placeholder="10-digit phone number"
                    {...register("phone", {
                      required: "Phone is required",
                      pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" },
                    })}
                  />
                  {errors.phone && (
                    <p className="text-danger text-xs mt-1">{errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <label className="label-field">Email (optional)</label>
                  <input type="email" className="input-field" {...register("email")} />
                </div>
              </div>
              <div>
                <label className="label-field">Message</label>
                <textarea
                  rows={5}
                  className="input-field"
                  placeholder="Tell us how we can help..."
                  {...register("message", { required: "Message is required" })}
                />
                {errors.message && (
                  <p className="text-danger text-xs mt-1">{errors.message.message}</p>
                )}
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3">
                <Send className="h-4 w-4" /> {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-ink mb-1">Quick Contact</p>
          {QUICK_CONTACTS.map((contact) => (
            <a
              key={contact.label}
              href={contact.href}
              target={contact.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className={`${contact.className} w-full justify-center`}
            >
              <contact.icon className="h-4 w-4" /> {contact.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
