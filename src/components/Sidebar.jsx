import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const links = [
  {
    to: "/blogs",
    label: "Blogs",
    caption: "Articles and editorial content",
    icon: assets.add_icon,
  },
  {
    to: "/open-positions",
    label: "Open Positions",
    caption: "Hiring and role management",
    icon: assets.add_icon,
  },
];

const Sidebar = () => {
  return (
    <aside className="panel-shell h-fit rounded-[30px] p-4 lg:sticky lg:top-4">
      <div className="mb-5 border-b border-[var(--line)] pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--muted)]">
          Workspace
        </p>
        <h2 className="font-display mt-3 text-3xl text-[var(--ink)]">
          Content modules
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Manage the two core CMS collections requested for Drishya.
        </p>
      </div>

      <nav className="flex gap-3 overflow-x-auto lg:flex-col">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `min-w-[220px] rounded-[24px] border px-4 py-4 transition duration-200 lg:min-w-0 ${
                isActive
                  ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--card)] shadow-[0_16px_28px_rgba(31,23,16,0.25)]"
                  : "border-[var(--line)] bg-white/55 text-[var(--ink)] hover:bg-white/80"
              }`
            }
          >
            {({ isActive }) => (
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                    isActive ? "bg-white/30" : "bg-[rgba(166,106,44,0.12)]"
                  }`}
                >
                  <img src={link.icon} alt={link.label} className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{link.label}</p>
                  <p
                    className={`mt-1 text-xs leading-5 ${
                      isActive ? "text-white/72" : "text-[var(--muted)]"
                    }`}
                  >
                    {link.caption}
                  </p>
                </div>
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
