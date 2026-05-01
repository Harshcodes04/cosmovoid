import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaGithub, FaHeadset, FaPaperPlane } from "react-icons/fa";

const contactCards = [
  {
    Icon: FaEnvelope,
    label: "Email",
    title: "cosmovoid@gmail.com",
    copy: "For feature ideas, feedback, and data-source notes.",
  },
  {
    Icon: FaGithub,
    label: "Code",
    title: "Project repository",
    copy: "Track improvements, fixes, and frontend experiments.",
    href: "https://github.com/Harshcodes04/cosmovoid",
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSent(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSent(true);
    setForm(initialForm);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden px-6 pb-16 pt-10 md:px-10 lg:px-14 xl:px-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-16 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -right-16 top-24 h-96 w-96 rounded-full bg-fuchsia-500/9 blur-3xl" />
      </div>

      <section className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(12,18,40,0.96)_0%,rgba(10,12,24,0.98)_100%)] p-7 shadow-[0_26px_56px_rgba(0,0,0,0.3)] sm:p-9">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.28em] text-cyan-200">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,1)]" />
              Contact
            </span>
            <h1 className="mt-5 text-4xl font-light tracking-[-0.06em] text-white sm:text-5xl">
              Send a signal to Mission Control.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400">
              Share a bug, request a new page, suggest a data source, or tell us
              which corner of the cosmos should get more attention.
            </p>
            <Link
              to="/explore"
              className="mt-7 inline-flex items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 py-3 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/10"
            >
              Browse before writing
            </Link>
          </div>

          <div className="grid gap-4">
            {contactCards.map((card) => {
              const CardTag = card.href ? "a" : "article";
              return (
                <CardTag
                  key={card.label}
                  href={card.href}
                  target={card.href ? "_blank" : undefined}
                  rel={card.href ? "noopener noreferrer" : undefined}
                  className="group rounded-[1.35rem] border border-white/8 bg-black/20 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/20 hover:bg-white/5"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-cyan-200">
                      <card.Icon className="size-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                        {card.label}
                      </p>
                      <h2 className="mt-1 text-base font-semibold text-white">
                        {card.title}
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-zinc-400">
                        {card.copy}
                      </p>
                      {card.href && (
                        <p className="mt-3 text-[11px] font-medium text-cyan-300 transition-colors group-hover:text-white">
                          Open repository -&gt;
                        </p>
                      )}
                    </div>
                  </div>
                </CardTag>
              );
            })}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-white/10 bg-zinc-950/70 p-5 shadow-[0_26px_56px_rgba(0,0,0,0.34)] backdrop-blur-sm sm:p-7"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-zinc-300">
              Name
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-cyan-300/40"
                placeholder="Your name"
              />
            </label>
            <label className="grid gap-2 text-sm text-zinc-300">
              Email
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-cyan-300/40"
                placeholder="you@example.com"
              />
            </label>
          </div>

          <label className="mt-4 grid gap-2 text-sm text-zinc-300">
            Subject
            <input
              required
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-cyan-300/40"
              placeholder="What should we look at?"
            />
          </label>

          <label className="mt-4 grid gap-2 text-sm text-zinc-300">
            Message
            <textarea
              required
              name="message"
              rows="8"
              value={form.message}
              onChange={handleChange}
              className="resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-cyan-300/40"
              placeholder="Write your transmission..."
            />
          </label>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition-transform duration-300 hover:-translate-y-0.5"
            >
              <FaPaperPlane className="size-4" aria-hidden="true" />
              Send signal
            </button>
            {sent && (
              <p className="rounded-full border border-cyan-300/20 bg-cyan-300/8 px-4 py-2 text-xs text-cyan-200">
                Signal queued. Thanks for reaching out.
              </p>
            )}
          </div>
        </form>
      </section>
    </main>
  );
};

export default Contact;
