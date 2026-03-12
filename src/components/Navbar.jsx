/* eslint-disable react/prop-types */
import { assets } from "../assets/assets";

const Navbar = ({ setToken }) => {
  return (
    <header className="panel-shell rounded-[30px] px-5 py-4 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-[24px] border border-[var(--line)] bg-white/65 p-3">
            <img className="h-12 w-12 object-contain sm:h-14 sm:w-14" src={assets.logored} alt="Drishya logo" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--muted)]">
              Drishya Marbles & Tiles
            </p>
            <h1 className="font-display text-3xl text-[var(--ink)] sm:text-4xl">
              CMS control room
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Blogs and careers content for the brand website.
            </p>
          </div>
        </div>

        <button onClick={() => setToken("")} className="secondary-button">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
