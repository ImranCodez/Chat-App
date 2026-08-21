import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Singup";
import Layout from "./components";

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>

      </Routes>
    </BrowserRouter>

    <ToastContainer/>
    
    </>
  );
}

export default App;