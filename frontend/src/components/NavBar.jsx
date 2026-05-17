import { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { FaAngleDown } from "react-icons/fa";

const mainLinks = [
  { label: "Home", to: "/" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Journal", to: "/journal" },
];

const exploreLinks = [
  { label: "Launches", to: "/launches" },
  { label: "Crew", to: "/crew" },
  { label: "Rockets", to: "/rockets" },
  { label: "Gallery", to: "/gallery" },
  { label: "Asteroids", to: "/asteroids" },
];

const moreLinks = [
  { label: "News", to: "/news" },
  { label: "Events", to: "/events" },
  { label: "About", to: "/about" },
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
  const isActive = links.some(l => pathname === l.to || pathname.startsWith(l.to + '/'));

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
      
      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-4 min-w-[160px]"
          >
            <div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-zinc-950/90 p-2 shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
              {links.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`px-3 py-2 rounded-xl text-sm transition-colors ${pathname === l.to ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}
                >
                  {l.label}
                </Link>
              ))}
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
        className="cosmovoid-nav sticky top-0 z-[100] flex items-center justify-between border-b border-white/10 bg-zinc-950/80 px-6 py-4 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl md:px-12 lg:px-24 xl:px-40"
      >

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-[0.24em] text-zinc-50 outline-none"
            onClick={closeMenu}
          >
            COSMOVOID
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.9)] animate-pulse" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center md:flex">
            {mainLinks.map((item) => (
              <NavItem key={item.to} to={item.to} label={item.label} pathname={pathname} />
            ))}
            <div className="mx-2 h-4 w-px bg-white/10" />
            <DropdownItem label="Explore" links={exploreLinks} pathname={pathname} />
            <DropdownItem label="More" links={moreLinks} pathname={pathname} />
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 pl-2 pr-4 py-1.5">
                  <div className="flex size-6 items-center justify-center rounded-full bg-linear-to-tr from-cyan-500 to-blue-500 text-[10px] font-bold text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-zinc-100">{user.username}</span>
                </div>
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
                  Get started
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
            </div>

            <div className="flex flex-col gap-1 mb-6">
              <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Explore</span>
              {exploreLinks.map((item) => (
                <NavLink key={item.to} to={item.to} className={mobileNavLinkClass} onClick={closeMenu}>
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="flex flex-col gap-1 mb-6">
              <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">More</span>
              {moreLinks.map((item) => (
                <NavLink key={item.to} to={item.to} className={mobileNavLinkClass} onClick={closeMenu}>
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="mt-auto pt-4 border-t border-white/10">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="rounded-xl bg-white/5 px-4 py-3 text-sm text-zinc-300">
                    Signed in as <strong className="text-white">{user.username}</strong>
                  </div>
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
                    Get started
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
