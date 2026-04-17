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
      ? "bg-white border border-zinc-200 font-medium text-zinc-800"
      : "text-zinc-500 hover:text-zinc-700"
  }`;

const mobileNavLinkClass = ({ isActive }) =>
  `px-4 py-2.5 rounded-lg text-sm transition-colors ${
    isActive
      ? "bg-zinc-50 font-medium text-zinc-800"
      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
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

      <nav className="cosmovoid-nav bg-white px-6 md:px-12 lg:px-24 xl:px-40 py-4 flex items-center justify-between relative border-b border-zinc-200/80">
        <Link
          to="/"
          className="text-lg font-semibold tracking-[0.24em] text-zinc-900"
          onClick={closeMenu}
        >
          COSMOVOID
        </Link>

        <div className="hidden md:flex items-center bg-zinc-50 border border-zinc-200 rounded-full px-1 py-1 gap-2">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-700">
                {user.username}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2.5 bg-linear-to-r from-zinc-950 to-zinc-500 text-zinc-50 hover:text-zinc-200 text-sm font-medium pl-5 pr-4 py-2 rounded-full cursor-pointer border-0 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-2.5 bg-linear-to-r from-zinc-950 to-zinc-500 text-zinc-50 hover:text-zinc-200 text-sm font-medium pl-5 pr-2 py-2 rounded-full border-0"
              >
                Get started
                <span className="size-7 rounded-full bg-white flex items-center justify-center">
                  <svg
                    width="12"
                    height="10"
                    viewBox="0 0 12 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M.6 4.602h10m-4-4 4 4-4 4"
                      stroke="#3f3f47"
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
          className="md:hidden flex flex-col gap-1.5 cursor-pointer bg-transparent border-0 p-1"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`block w-6 h-0.5 bg-zinc-800 transition-transform ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-zinc-800 transition-opacity ${
              menuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-zinc-800 transition-transform ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>

        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-t border-zinc-200 flex flex-col p-5 gap-1 md:hidden z-50 shadow-lg">
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
                <div className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
                  Signed in as {user.username}
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center justify-center gap-2.5 bg-linear-to-r from-zinc-950 to-zinc-500 text-zinc-50 text-sm font-medium px-5 py-2.5 rounded-full cursor-pointer border-0 mt-3 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <div className="mt-3 flex flex-col gap-3">
                <Link
                  to="/login"
                  className="rounded-full border border-zinc-200 px-5 py-2.5 text-center text-sm text-zinc-700"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center justify-center gap-2.5 bg-linear-to-r from-zinc-950 to-zinc-500 text-zinc-50 text-sm font-medium px-5 py-2.5 rounded-full"
                  onClick={closeMenu}
                >
                  Get started
                  <span className="size-7 rounded-full bg-white flex items-center justify-center">
                    <svg
                      width="12"
                      height="10"
                      viewBox="0 0 12 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M.6 4.602h10m-4-4 4 4-4 4"
                        stroke="#3f3f47"
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
