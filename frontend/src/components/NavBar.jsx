import { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { FaAngleDown, FaRocket, FaImages, FaNewspaper, FaUserAstronaut, FaInfoCircle, FaEnvelope } from "react-icons/fa";
import { GiAsteroid, GiMoonOrbit } from "react-icons/gi";
import { MdEvent } from "react-icons/md";

const mainLinks = [
  { label: "Home", to: "/" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Journal", to: "/journal" },
];

const exploreLinks = [
  { label: "Launches",  to: "/launches",  Icon: FaRocket },
  { label: "Rockets",   to: "/rockets",   Icon: GiMoonOrbit },
  { label: "Crew",      to: "/crew",       Icon: FaUserAstronaut },
  { label: "Gallery",   to: "/gallery",   Icon: FaImages },
  { label: "Asteroids", to: "/asteroids", Icon: GiAsteroid },
  { label: "Events",    to: "/events",    Icon: MdEvent },
  { label: "News",      to: "/news",      Icon: FaNewspaper },
];

const extraLinks = [
  { label: "About",   to: "/about" },
  { label: "Contact", to: "/contact" },
];

const mobileNavLinkClass = ({ isActive }) =>
  `px-4 py-2.5 rounded-lg text-sm transition-colors ${
    isActive
      ? "bg-white/10 font-medium text-white"
      : "text-zinc-300 hover:bg-white/6 hover:text-white"
  }`;

const NavItem = ({ to, label, pathname }) => {
  const isActive = pathname === to;
  return (
    <Link to={to} className="relative px-4 py-1.5 text-sm transition-colors group">
      <span className={`relative z-10 transition-colors ${isActive ? "text-white font-medium" : "text-zinc-300 group-hover:text-white"}`}>
        {label}
      </span>
      {isActive && (
        <motion.div
          layoutId="navPill"
          className="absolute inset-0 rounded-full bg-white/10 border border-white/10 shadow-[0_0_12px_rgba(255,255,255,0.1)]"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
    </Link>
  );
};

const DropdownItem = ({ label, links, pathname }) => {
  const [open, setOpen] = useState(false);
  const isActive = links.some(l => pathname === l.to || pathname.startsWith(l.to + '/')) || pathname === '/explore';

  return (
    <div
      className="relative px-2 py-1.5"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className={`relative z-10 flex items-center gap-1.5 text-sm transition-colors ${isActive ? "text-white font-medium" : "text-zinc-300 hover:text-white"}`}>
        {label}
        <FaAngleDown className={`transition-transform duration-200 ${open ? "rotate-180 text-white" : "text-zinc-500"}`} size={12} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-4 min-w-[200px]"
          >
            <div className="flex flex-col gap-0.5 rounded-2xl border border-white/10 bg-zinc-950/95 p-2 shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
              {links.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
                    pathname === l.to ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {l.Icon && (
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/90">
                      <l.Icon size={11} />
                    </span>
                  )}
                  {l.label}
                </Link>
              ))}
              {/* See all link */}
              <div className="mt-1 border-t border-white/8 pt-1">
                <Link
                  to="/explore"
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  See all sections
                  <span>→</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > 100 && latest > previous) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      setMenuOpen(false);
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
          .cosmovoid-nav { font-family: "Geist", sans-serif; }
        `}
      </style>

      {/* Full-width Navbar (Hide-on-scroll preserved) */}
      <motion.nav
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "-100%", opacity: 0 }
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="cosmovoid-nav sticky top-0 z-[100] flex items-center justify-between border-b border-white/10 bg-zinc-900/70 px-6 py-4 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl md:px-12 lg:px-24 xl:px-40"
      >

          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-0.5 outline-none"
            onClick={closeMenu}
          >
            <span className="text-lg font-bold tracking-[0.24em] text-white transition-opacity group-hover:opacity-80">
              COSMO
            </span>
            <span className="text-lg font-bold tracking-[0.24em] text-cyan-300 transition-opacity group-hover:opacity-80">
              VOID
            </span>
            <span className="ml-2 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.9)] animate-pulse" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center md:flex">
            {mainLinks.map((item) => (
              <NavItem key={item.to} to={item.to} label={item.label} pathname={pathname} />
            ))}
            <div className="mx-2 h-4 w-px bg-white/10" />
            <DropdownItem label="Explore" links={exploreLinks} pathname={pathname} />
            <div className="mx-2 h-4 w-px bg-white/10" />
            {extraLinks.map((item) => (
              <NavItem key={item.to} to={item.to} label={item.label} pathname={pathname} />
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 pl-2 pr-4 py-1.5 transition-colors hover:border-white/20 hover:bg-white/10"
                >
                  <div className="flex size-6 items-center justify-center rounded-full bg-linear-to-tr from-cyan-500 to-blue-500 text-[10px] font-bold text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-zinc-100">{user.username}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex cursor-pointer items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loggingOut ? "..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="group flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-zinc-950 transition-transform hover:scale-105"
                >
                  Launch Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex flex-col gap-1.5 border-0 bg-transparent p-1 cursor-pointer md:hidden"
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-6 bg-zinc-100 transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-6 bg-zinc-100 transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-zinc-100 transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-[90px] z-[90] flex max-h-[80vh] flex-col overflow-y-auto rounded-3xl border border-white/10 bg-zinc-950/95 p-6 shadow-2xl backdrop-blur-3xl md:hidden"
          >
            <div className="flex flex-col gap-1 mb-6">
              <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Main</span>
              {mainLinks.map((item) => (
                <NavLink key={item.to} to={item.to} className={mobileNavLinkClass} onClick={closeMenu}>
                  {item.label}
                </NavLink>
              ))}
              {extraLinks.map((item) => (
                <NavLink key={item.to} to={item.to} className={mobileNavLinkClass} onClick={closeMenu}>
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="flex flex-col gap-1 mb-6">
              <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Explore</span>
              {exploreLinks.map((item) => (
                <NavLink key={item.to} to={item.to} className={mobileNavLinkClass} onClick={closeMenu}>
                  <span className="flex items-center gap-2.5">
                    {item.Icon && <item.Icon size={13} className="text-white/80" />}
                    {item.label}
                  </span>
                </NavLink>
              ))}
              <NavLink to="/explore" className={mobileNavLinkClass} onClick={closeMenu}>
                <span className="text-zinc-300">See all sections →</span>
              </NavLink>
            </div>

            <div className="mt-auto pt-4 border-t border-white/10">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="rounded-xl bg-white/5 px-4 py-3 text-sm text-zinc-300">
                    Signed in as <strong className="text-white">{user.username}</strong>
                  </div>
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="w-full rounded-xl border border-white/10 bg-transparent px-5 py-3 text-center text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    View profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full rounded-xl bg-white/10 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/20"
                  >
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    className="w-full rounded-xl border border-white/10 bg-transparent px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-white/5"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="w-full rounded-xl bg-white px-5 py-3 text-center text-sm font-bold text-zinc-950 transition-transform hover:scale-[1.02]"
                    onClick={closeMenu}
                  >
                    Launch Now
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
