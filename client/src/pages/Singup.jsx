import React, { useState } from "react";
import { useSignupMutation } from "../lib/api";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const nvaigator =useNavigate()
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
      nvaigator("/login")
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
    <div className="flex items-center justify-center h-screen w-full">
      <div className="dark">
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6">

          <h2 className="text-2xl font-bold text-gray-200 mb-4">
            Sign Up
          </h2>

          <form onSubmit={signuphnadle} className="flex flex-col">

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
              className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-1 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              type="text"
            />

            {Singuperror.fullname && (
              <p className="text-red-500 text-sm font-semibold mb-3">
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
              className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-1 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              type="email"
            />

            {Singuperror.email && (
              <p className="text-red-500 text-sm font-semibold mb-3">
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
              className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-1 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              type="password"
            />

            {Singuperror.password && (
              <p className="text-red-500 text-sm font-semibold mb-3">
                {Singuperror.password}
              </p>
            )}

            {/* ================= Remember Me ================= */}
            <div className="flex items-center justify-between flex-wrap">
              <label
                className="text-sm text-gray-200 cursor-pointer"
                htmlFor="remember-me"
              >
                <input
                  className="mr-2"
                  id="remember-me"
                  type="checkbox"
                />
                Remember me
              </label>

              <p className="text-white text-sm mt-4">
                Already have an account?{" "}
                <a
                  className="text-blue-500 hover:underline"
                  href="/login"
                >
                  Login
                </a>
              </p>
            </div>

            {/* ================= Submit ================= */}
            <button
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 transition ease-in-out duration-150"
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