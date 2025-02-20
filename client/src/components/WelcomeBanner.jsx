import React from "react";

const WelcomeBanner = () => {
  return (
    <div
      className="jumbotron pt-4 pb-2 mb-2"
      id="header"
      style={{
        backgroundColor: "#007aff",
        borderRadius: "15px",
      }}
    >
      <h1 className="text-white text-center" style={{ fontSize: "1.5rem" }}>
        Personal Finance Manager
      </h1>
      <p className="text-white text-center" style={{ fontSize: "1rem" }}>
        Start tracking your income and expenses and understand your spending
        habits.
      </p>
    </div>
  );
};

export default WelcomeBanner;
