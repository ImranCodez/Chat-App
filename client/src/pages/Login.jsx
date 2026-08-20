import React, { useState } from "react";
import { useLogginMutation } from "../lib/api";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigator=useNavigate()
  const [longindata, setlogindata] = useState({
    email: "",
    password: "",
  });
  console.log(longindata);
  
const [loginuser,myerror]=useLogginMutation()
  const [errors, seterrors] = useState({
    email: "",
    password: "",
  });

  const loghandlesub =async (e) => {
    e.preventDefault();
   try {
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
   const res =await loginuser(longindata)
    console.log(res);
    if(res?.data){
     return navigator("/")    }
    
     
    setlogindata({
      email: "",
      password: "",
    });


   } catch (error) {
    console.log(error.data)
   }
      };

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="dark">
        <div className="w-full max-w-md bg-gray-800  rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-200 mb-4">Login</h2>

          <form onSubmit={loghandlesub} className="flex flex-col">
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
              className="bg-gray-700 pl-3 text-gray-200 border-0 rounded-md p-2 mb-1 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              type="email"
            />

            {errors.email && (
              <p className="text-red-500 text-[15px] font-semibold mb-3">
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
              className="bg-gray-700 pl-3 text-gray-200 border-0 rounded-md p-2 mb-1 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              type="password"
            />
            {errors.password && (
              <p className="text-red-500 text-[15px] font-semibold mb-3">
                {errors.password}
              </p>
            )}

            <div className="flex items-center justify-between flex-wrap">
              <label
                className="text-sm text-gray-200 cursor-pointer"
                htmlFor="remember-me"
              >
                <input className="mr-2" id="remember-me" type="checkbox" />
                Remember me
              </label>

              <a
                className="text-sm text-blue-500 hover:underline mb-0.5"
                href="#"
              >
                Forgot password?
              </a>

              <p className="text-white mt-4">
                Don't have an account?{" "}
                <a
                  className="text-sm text-blue-500 hover:underline mt-4"
                  href="/signup"
                >
                  Signup
                </a>
              </p>
            </div>

            <button
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 transition ease-in-out duration-150"
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
