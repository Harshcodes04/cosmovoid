const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      <h1 className="text-xl font-bold">Cosmovoid</h1>

      <div className="flex gap-6">
        <a href="/">Home</a>
        <a href="/explore">Explore</a>
        <a href="/dashboard">Dashboard</a>
      </div>

      <div className="flex gap-3">
        <button className="border px-4 py-1 rounded">Login</button>
        <button className="bg-black text-white px-4 py-1 rounded">
          Signup
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
