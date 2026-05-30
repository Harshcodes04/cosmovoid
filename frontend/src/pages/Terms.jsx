import Navbar from "../components/NavBar";
import { Link } from "react-router-dom";

const Terms = () => {
  const lastUpdated = "May 24, 2026";

  return (
    <main className="relative min-h-screen overflow-x-hidden px-6 pb-16 pt-10 md:px-10 lg:px-14 xl:px-20">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute right-[-10%] top-32 h-96 w-96 rounded-full bg-zinc-600/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl space-y-12">
        {/* Header */}
        <section className="space-y-4">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 transition-colors hover:text-white"
          >
            ← Back to About
          </Link>
          <h1 className="text-4xl font-light tracking-[-0.04em] text-white sm:text-5xl">
            Terms of Service & Privacy
          </h1>
          <p className="text-sm text-zinc-500">Last updated: {lastUpdated}</p>
        </section>

        {/* Content */}
        <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(13,22,48,0.4)_0%,rgba(8,10,22,0.6)_100%)] p-7 shadow-[0_26px_56px_rgba(0,0,0,0.3)] sm:p-10 space-y-12 backdrop-blur-md text-zinc-300">
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">1. Introduction</h2>
            <p className="text-sm leading-7">
              Welcome to Cosmovoid ("we," "our," or "us"). By accessing or using our platform, you agree to be bound by these Terms of Service. Cosmovoid is an independent, non-commercial application built to provide space exploration data, telemetry, and private journaling capabilities to users.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">2. User Accounts and Privacy</h2>
            <p className="text-sm leading-7">
              To use certain features, such as the Mission Control dashboard and personal journal, you must create an account. 
            </p>
            <ul className="list-inside list-disc space-y-2 text-sm leading-7">
              <li><strong>Data Collection:</strong> We collect your email address and an encrypted hash of your password solely for authentication purposes.</li>
              <li><strong>Journal Data:</strong> Your journal entries, observations, and tags are stored securely in our database. We do not sell, rent, or share your private journal data with any third parties.</li>
              <li><strong>Cookies:</strong> We use secure, HTTP-only cookies to maintain your login session. We do not use tracking or advertising cookies.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">3. Third-Party Data and Affiliation</h2>
            <p className="text-sm leading-7">
              Cosmovoid utilizes public APIs provided by NASA, Spaceflight News, and Launch Library 2. 
            </p>
            <ul className="list-inside list-disc space-y-2 text-sm leading-7">
              <li>We are <strong>not affiliated with, endorsed by, or officially connected to NASA, SpaceX, or any other government or commercial entity</strong> mentioned on the platform.</li>
              <li>Data provided by these APIs is subject to their respective terms of use. We do not guarantee the absolute accuracy, completeness, or uptime of third-party data feeds.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">4. Acceptable Use and Rate Limiting</h2>
            <p className="text-sm leading-7">
              We provide this service for free. To ensure stability for all users, we enforce strict rate limits on our backend infrastructure. 
            </p>
            <ul className="list-inside list-disc space-y-2 text-sm leading-7">
              <li>You agree not to use automated scripts, scrapers, or bots to mass-download data from our endpoints.</li>
              <li>If you trigger our rate-limiting defense systems (by making an excessive number of requests in a short period), your IP address will be temporarily blocked.</li>
              <li>We reserve the right to permanently terminate or suspend accounts that maliciously attempt to disrupt our servers or abuse third-party API quotas.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">5. Limitation of Liability</h2>
            <p className="text-sm leading-7">
              Cosmovoid is provided "as is" and "as available" without warranties of any kind. We shall not be liable for any data loss (including journal entries), service interruptions, or damages arising from your use of the platform. We recommend keeping independent backups of any critical journal observations.
            </p>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/10">
            <p className="text-xs leading-6 text-zinc-500">
              For questions regarding these terms, your data, or to request account deletion, please contact the developer via the <Link to="/contact" className="text-zinc-300 hover:text-white underline">Contact page</Link> or view the source code on GitHub.
            </p>
          </div>

        </section>
      </div>
    </main>
  );
};

export default Terms;
