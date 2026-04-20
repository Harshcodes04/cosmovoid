import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Explore", to: "/explore" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Journal", to: "/journal" },
  { label: "News", to: "/news" },
  { label: "Gallery", to: "/gallery" },
];

const navLinkClass = ({ isActive }) =>
  `px-4 py-1.5 rounded-full text-sm transition-colors ${
    isActive
      ? "bg-white/12 border border-white/10 font-medium text-white"
      : "text-zinc-300 hover:bg-white/6 hover:text-white"
  }`;

const mobileNavLinkClass = ({ isActive }) =>
  `px-4 py-2.5 rounded-lg text-sm transition-colors ${
    isActive
      ? "bg-white/10 font-medium text-white"
      : "text-zinc-300 hover:bg-white/6 hover:text-white"
  }`;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

          .cosmovoid-nav {
            font-family: "Geist", sans-serif;
          }
        `}
      </style>

      <nav className="cosmovoid-nav relative flex items-center justify-between border-b border-white/10 bg-zinc-950/80 px-6 py-4 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl md:px-12 lg:px-24 xl:px-40">
        <Link
          to="/"
          className="text-lg font-semibold tracking-[0.24em] text-zinc-50"
          onClick={closeMenu}
        >
          COSMOVOID
        </Link>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-1 py-1 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-100">
                {user.username}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex cursor-pointer items-center gap-2.5 rounded-full border-0 bg-linear-to-r from-zinc-100 to-zinc-300 py-2 pl-5 pr-4 text-sm font-medium text-zinc-950 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-100 transition-colors hover:bg-white/6"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-2.5 rounded-full border-0 bg-linear-to-r from-zinc-100 to-zinc-300 py-2 pl-5 pr-2 text-sm font-medium text-zinc-950 transition-opacity hover:opacity-90"
              >
                Get started
                <span className="flex size-7 items-center justify-center rounded-full bg-zinc-950">
                  <svg
                    width="12"
                    height="10"
                    viewBox="0 0 12 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M.6 4.602h10m-4-4 4 4-4 4"
                      stroke="#f8fafc"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex flex-col gap-1.5 border-0 bg-transparent p-1 text-zinc-50 cursor-pointer md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`block h-0.5 w-6 bg-zinc-100 transition-transform ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-6 bg-zinc-100 transition-opacity ${
              menuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-6 bg-zinc-100 transition-transform ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>

        {menuOpen && (
          <div className="absolute left-0 top-full z-50 flex w-full flex-col gap-1 border-t border-white/10 bg-zinc-950/95 p-5 shadow-2xl md:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={mobileNavLinkClass}
                onClick={closeMenu}
              >
                {item.label}
              </NavLink>
            ))}

            {user ? (
              <>
                <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100">
                  Signed in as {user.username}
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="mt-3 flex cursor-pointer items-center justify-center gap-2.5 rounded-full border-0 bg-linear-to-r from-zinc-100 to-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-950 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <div className="mt-3 flex flex-col gap-3">
                <Link
                  to="/login"
                  className="rounded-full border border-white/15 px-5 py-2.5 text-center text-sm text-zinc-100"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center justify-center gap-2.5 rounded-full bg-linear-to-r from-zinc-100 to-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-950"
                  onClick={closeMenu}
                >
                  Get started
                  <span className="flex size-7 items-center justify-center rounded-full bg-zinc-950">
                    <svg
                      width="12"
                      height="10"
                      viewBox="0 0 12 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M.6 4.602h10m-4-4 4 4-4 4"
                        stroke="#f8fafc"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
