import React, { useState } from "react";
import { useLogginMutation } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Login = () => {
  const navigator = useNavigate();
  const [longindata, setlogindata] = useState({
    email: "",
    password: "",
  });
  const [loginuser, myerror] = useLogginMutation();
  const [errors, seterrors] = useState({
    email: "",
    password: "",
  });

  const loghandlesub = async (e) => {
    e.preventDefault();

    seterrors({
      email: "",
      password: "",
    });

    if (!longindata.email) {
      return seterrors((prev) => ({
        ...prev,
        email: "Enter your email",
      }));
    }

    if (!longindata.password) {
      return seterrors((prev) => ({
        ...prev,
        password: "Enter your password",
      }));
    }

    try {
      const res = await loginuser(longindata).unwrap();
      console.log(res);
      toast.success("Login successful!", {
        autoClose: 3000,
      });

      setTimeout(() => {
        navigator("/");
      }, 4000);
      setlogindata({
        email: "",
        password: "",
      });
    } catch (error) {
      console.log("Login error:", error?.data?.message);

      toast.error(error?.data?.message || "Invalid email fffffff or password");
    }
  };

  return (
    <div className="ambient-canvas relative flex min-h-screen max-lg:min-h-dvh w-full items-center justify-center overflow-hidden bg-bg px-5 py-10">
      <div className="ambient-grid pointer-events-none absolute inset-0" />
      <svg
        className="pointer-events-none absolute -left-20 top-16 h-64 w-64 text-accent/20 float-slow"
        viewBox="0 0 260 260"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="130"
          cy="130"
          r="94"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 10"
        />
        <path
          d="M18 164C66 108 116 190 166 122S230 52 250 78"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
      <div className="pointer-events-none absolute -right-8 top-24 h-24 w-24 rounded-full border border-brand/20 bg-brand/5 float-delayed" />
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3 text-2xl font-bold tracking-tight text-coil">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-lg shadow-brand/20">
            C
          </span>
          ChatApp
        </div>
        <div className="form-enter rounded-2xl border border-border bg-surface/95 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-accent">
            Welcome back
          </p>
          <h2 className="text-2xl font-bold text-text-primary">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Your conversations are waiting for you.
          </p>

          <form onSubmit={loghandlesub} className="mt-7 flex flex-col">
            {/* Email */}
            <input
              value={longindata.email}
              onChange={(e) => {
                setlogindata((prev) => ({
                  ...prev,
                  email: e.target.value,
                }));

                seterrors((prev) => ({
                  ...prev,
                  email: "",
                }));
              }}
              placeholder="Email address"
              className="mb-1 rounded-xl border border-border bg-muted px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand/20"
              type="email"
            />

            {errors.email && (
              <p className="mb-3 text-sm font-semibold text-error">
                {errors.email}
              </p>
            )}
            <input
              value={longindata.password}
              onChange={(e) => {
                setlogindata((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));

                seterrors((prev) => ({
                  ...prev,
                  password: "",
                }));
              }}
              placeholder="Password"
              className="mb-1 rounded-xl border border-border bg-muted px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand/20"
              type="password"
            />
            {errors.password && (
              <p className="mb-3 text-sm font-semibold text-error">
                {errors.password}
              </p>
            )}

            <div className="flex items-center justify-between flex-wrap">
              <label
                className="cursor-pointer text-sm text-text-secondary"
                htmlFor="remember-me"
              >
                <input className="mr-2" id="remember-me" type="checkbox" />
                Remember me
              </label>

              <a
                className="mb-0.5 text-sm text-accent transition hover:text-accent-glow"
                href="#"
              >
                Forgot password?
              </a>

              <p className="mt-4 text-sm text-text-secondary">
                Don't have an account?{" "}
                <a
                  className="font-semibold text-accent transition hover:text-accent-glow"
                  href="/Singup"
                >
                  Signup
                </a>
              </p>
            </div>

            <button
              className="mt-6 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-accent/40"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
