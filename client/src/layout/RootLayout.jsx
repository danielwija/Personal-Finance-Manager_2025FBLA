import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import WelcomeBanner from "../components/WelcomeBanner";
import Footer from "../components/Footer";

const RootLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <WelcomeBanner />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default RootLayout;
