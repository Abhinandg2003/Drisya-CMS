/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { backendUrl } from "../lib/config";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post(`${backendUrl}/api/user/admin`, {
        email,
        password,
      });

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      setToken(data.token);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[36px] border border-[var(--line)] bg-[rgba(113,26,25,0.08)] shadow-[0_28px_70px_rgba(113,26,25,0.25)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">

  <div className="relative hidden min-h-[640px] overflow-hidden bg-[linear-gradient(135deg,#711a19,#7e2e1e_58%,#711a19)] p-10 text-[var(--card)] lg:block">

    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(113,26,25,0.45),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(126,46,30,0.40),transparent_40%)]" />

          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="flex h-20 w-20 items-center justify-center rounded-[28px] border border-white/15 bg-white/8">
                <img src={assets.logo} alt="Drishya logo" className="h-12 w-12 object-contain" />
              </div>
              <p className="mt-10 text-xs font-semibold uppercase tracking-[0.4em] text-white/72">
                Drishya Marbles & Tiles
              </p>
              <h1 className="font-display mt-4 text-6xl leading-[0.92]">
                Manage stories and showroom careers with one CMS.
              </h1>
            </div>

            <div className="max-w-md rounded-[28px] border border-white/12 bg-white/8 p-6">
              <p className="text-sm uppercase tracking-[0.32em] text-white/68">
                Content Focus
              </p>
              <p className="mt-4 text-lg leading-8 text-white/88">
                Publish brand blogs, maintain hiring roles, and keep the website
                content aligned with the premium in-store experience.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
          <div className="mx-auto max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[var(--accent-dark)]">
              Secure Access
            </p>
            <h2 className="font-display mt-4 text-5xl leading-none text-[var(--ink)]">
              CMS login
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              Sign in with the configured admin credentials to manage Drishya
              blogs and open positions.
            </p>

            <form onSubmit={onSubmitHandler} className="mt-10 space-y-5">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-[var(--ink)]">Email Address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@drishya.com"
                  required
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-[var(--ink)]">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </label>

              <button type="submit" className="primary-button w-full justify-center">
                Login to CMS
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
