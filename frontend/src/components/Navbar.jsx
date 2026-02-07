import { Link, NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Products" },
  { to: "/cart", label: "Cart" },
  { to: "/checkout", label: "Checkout" },
  { to: "/admin", label: "Admin" },
];

export default function Navbar() {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link className="text-xl font-semibold text-slate-900" to="/">
          LearnCommerce
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded px-3 py-1 font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `rounded px-3 py-1 font-medium transition ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-indigo-600 hover:bg-indigo-50"
              }`
            }
          >
            Login
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
