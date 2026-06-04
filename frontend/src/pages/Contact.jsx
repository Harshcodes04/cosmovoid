import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaGithub, FaHeadset, FaPaperPlane } from "react-icons/fa";
import api from "../api/axios";

const contactCards = [
  {
    Icon: FaEnvelope,
    label: "Email",
    title: "space.cosmovoid@gmail.com",
    copy: "For feature ideas, feedback, and data-source notes.",
    href: "mailto:space.cosmovoid@gmail.com",
    linkText: "Send email ->",
  },
  {
    Icon: FaGithub,
    label: "Code",
    title: "Project repository",
    copy: "Track improvements, fixes, and frontend experiments.",
    href: "https://github.com/Harshcodes04/cosmovoid",
    linkText: "Open repository ->",
  },
  {
    Icon: FaHeadset,
    label: "Support",
    title: "Mission desk",
    copy: "Use the form for bugs, account issues, or content requests.",
  },
];

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSent(false);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    setError("");
    try {
      await api.post("/contact", form);
      setSent(true);
      setForm(initialForm);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen px-6 pt-6 pb-16 md:px-10 lg:px-14 xl:px-20 max-w-7xl mx-auto selection:bg-zinc-800 selection:text-white">
      {/* Narrative Hero */}
      <section className="max-w-2xl mb-8">
        <h1 className="text-3xl sm:text-4xl text-white font-medium tracking-tight mb-4">
          Get in touch.
        </h1>
        <div className="text-zinc-300 space-y-5 text-sm sm:text-base leading-relaxed">
          <p>
            Whether it's a bug in the telemetry feed, a missing feature, or just
            dropping a line about a cool launch, I read everything. This is a
            solo project, so responses might take some time but I'll get back to
            you as soon as possible.
          </p>
        </div>
        <div className="flex gap-8 mt-6 font-mono text-xs uppercase tracking-wide"></div>
      </section>

      {/* Asymmetric Layout */}
      <div className="grid md:grid-cols-[minmax(300px,400px)_1fr] gap-12 md:gap-20 border-t border-dashed border-zinc-700/60 pt-8 items-start">
        {/* Left side: Alternative contact list */}
        <div className="space-y-8">
          {contactCards.map((card) => {
            const CardTag = card.href ? "a" : "div";
            return (
              <CardTag
                key={card.label}
                href={card.href}
                target={card.href ? "_blank" : undefined}
                rel={card.href ? "noopener noreferrer" : undefined}
                className={`block group ${card.href ? "cursor-pointer" : ""}`}
              >
                <h2 className="text-base text-zinc-100 mb-1 font-medium flex items-center gap-3">
                  <card.Icon className="size-4 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                  {card.label}
                </h2>
                <h3 className="text-zinc-200 text-sm font-medium mb-2 pl-7">
                  {card.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed pl-7">
                  {card.copy}
                </p>
                {card.href && (
                  <p className="mt-3 pl-7 text-[10px] uppercase font-mono text-zinc-400 transition-colors group-hover:text-zinc-200">
                    {card.linkText}
                  </p>
                )}
              </CardTag>
            );
          })}
        </div>

        {/* Right side: Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-zinc-700 bg-[linear-gradient(135deg,rgba(12,18,40,0.96)_0%,rgba(10,12,24,0.98)_100%)] p-6 sm:p-8 space-y-8"
        >
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <label className="block text-sm text-zinc-300 font-medium">
                Name
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-3 block w-full border-b border-zinc-700 bg-transparent py-2 text-white focus:border-zinc-400 focus:outline-none transition-colors placeholder:text-zinc-500"
                  placeholder="Anonymous"
                />
              </label>
              <label className="block text-sm text-zinc-300 font-medium">
                Email
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-3 block w-full border-b border-zinc-700 bg-transparent py-2 text-white focus:border-zinc-400 focus:outline-none transition-colors placeholder:text-zinc-500"
                  placeholder="you@gmail.com"
                />
              </label>
            </div>

            <label className="block text-sm text-zinc-300 font-medium">
              Subject
              <input
                required
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="mt-3 block w-full border-b border-zinc-700 bg-transparent py-2 text-white focus:border-zinc-400 focus:outline-none transition-colors placeholder:text-zinc-500"
                placeholder="Subject of Message"
              />
            </label>

            <label className="block text-sm text-zinc-300 font-medium">
              Message
              <textarea
                required
                name="message"
                rows="6"
                value={form.message}
                onChange={handleChange}
                className="mt-3 block w-full border border-zinc-700 bg-transparent p-4 text-sm leading-7 text-white focus:border-zinc-400 focus:outline-none transition-colors placeholder:text-zinc-500 resize-none"
                placeholder="Write the message here"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-6 mt-4">
            <button
              type="submit"
              disabled={sending}
              className="text-sm font-medium text-zinc-200 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FaPaperPlane className="size-3" aria-hidden="true" />
              {sending ? "Sending..." : "Send Signal"}
            </button>
            {sent && (
              <p className="text-sm text-zinc-400">Signal sent successfully.</p>
            )}
            {error && <p className="text-sm text-red-500/80">{error}</p>}
          </div>
        </form>
      </div>
    </main>
  );
};

export default Contact;
