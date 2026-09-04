import React, { useState } from "react";
import { useSignupMutation } from "../lib/api";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const nvaigator = useNavigate();
  const [signupdata, setsignupdata] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const [Singuperror, setsignuperror] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const [signupbackendata] = useSignupMutation();

  const signuphnadle = async (e) => {
    e.preventDefault();

    try {
      let errors = {};

      // Full name validation
      if (!signupdata.fullname.trim()) {
        errors.fullname = "Full name is required";
      }

      // Email validation
      if (!signupdata.email.trim()) {
        errors.email = "Email is required";
      }

      // Password validation
      if (!signupdata.password.trim()) {
        errors.password = "Password is required";
      }

      // Set validation errors
      setsignuperror(errors);

      // যদি কোনো validation error থাকে তাহলে এখানেই stop করবে
      if (Object.keys(errors).length > 0) {
        return;
      }

      // সব input ঠিক থাকলে backend এ data পাঠাবে
      console.log(signupdata);

      const res = await signupbackendata(signupdata).unwrap();

      console.log(res);

      // =========================================
      // SIGNUP SUCCESS হলে সব input খালি করে দিবে
      // =========================================
      setsignupdata({
        fullname: "",
        email: "",
        password: "",
      });
      nvaigator("/Login");
      // =========================================
      // পুরোনো error message-ও clear করে দিবে
      // =========================================
      setsignuperror({
        fullname: "",
        email: "",
        password: "",
      });
    } catch (error) {
      // Backend থেকে error এলে এখানে আসবে
      console.log(error);
    }
  };

  return (
    <div className="ambient-canvas relative flex min-h-screen max-lg:min-h-dvh w-full items-center justify-center overflow-hidden bg-bg px-5 py-10">
      <div className="ambient-grid pointer-events-none absolute inset-0" />
      <svg
        className="pointer-events-none absolute -right-24 bottom-8 h-80 w-80 text-accent/20 float-delayed"
        viewBox="0 0 320 320"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="160"
          cy="160"
          r="116"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="5 12"
        />
        <path
          d="M20 218C76 152 126 250 184 172S270 96 304 120"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
      <div className="pointer-events-none absolute -left-10 top-20 h-20 w-20 rounded-2xl border border-brand/20 bg-brand/5 float-slow" />
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3 text-2xl font-bold tracking-tight text-coil">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-lg shadow-brand/20">
            C
          </span>
          ChatApp
        </div>
        <div className="form-enter rounded-2xl border border-border bg-surface/95 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-accent">
            Get started
          </p>
          <h2 className="text-2xl font-bold text-text-primary">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Join the conversation in a few seconds.
          </p>

          <form onSubmit={signuphnadle} className="mt-7 flex flex-col">
            {/* ================= Full Name ================= */}
            <input
              value={signupdata.fullname}
              onChange={(e) => {
                // Full name state update
                setsignupdata((prev) => ({
                  ...prev,
                  fullname: e.target.value,
                }));

                // User আবার type করলে আগের error remove হবে
                setsignuperror((prev) => ({
                  ...prev,
                  fullname: "",
                }));
              }}
              placeholder="Full Name"
              className="mb-1 rounded-xl border border-border bg-muted px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand/20"
              type="text"
            />

            {Singuperror.fullname && (
              <p className="mb-3 text-sm font-semibold text-error">
                {Singuperror.fullname}
              </p>
            )}

            {/* ================= Email ================= */}
            <input
              value={signupdata.email}
              onChange={(e) => {
                // Email state update
                setsignupdata((prev) => ({
                  ...prev,
                  email: e.target.value,
                }));

                // User আবার type করলে email error remove হবে
                setsignuperror((prev) => ({
                  ...prev,
                  email: "",
                }));
              }}
              placeholder="Email address"
              className="mb-1 rounded-xl border border-border bg-muted px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand/20"
              type="email"
            />

            {Singuperror.email && (
              <p className="mb-3 text-sm font-semibold text-error">
                {Singuperror.email}
              </p>
            )}

            {/* ================= Password ================= */}
            <input
              value={signupdata.password}
              onChange={(e) => {
                // Password state update
                setsignupdata((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));

                // User আবার type করলে password error remove হবে
                setsignuperror((prev) => ({
                  ...prev,
                  password: "",
                }));
              }}
              placeholder="Password"
              className="mb-1 rounded-xl border border-border bg-muted px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand/20"
              type="password"
            />

            {Singuperror.password && (
              <p className="mb-3 text-sm font-semibold text-error">
                {Singuperror.password}
              </p>
            )}

            {/* ================= Remember Me ================= */}
            <div className="flex items-center justify-between flex-wrap">
              <label
                className="cursor-pointer text-sm text-text-secondary"
                htmlFor="remember-me"
              >
                <input className="mr-2" id="remember-me" type="checkbox" />
                Remember me
              </label>

              <p className="mt-4 text-sm text-text-secondary">
                Already have an account?{" "}
                <a
                  className="font-semibold text-accent transition hover:text-accent-glow"
                  href="/Login"
                >
                  Login
                </a>
              </p>
            </div>

            {/* ================= Submit ================= */}
            <button
              className="mt-6 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-accent/40"
              type="submit"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
