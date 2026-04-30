import React from "react";
import { Link } from "react-router-dom";

const Explore = () => {
  return (
    <div className="py-16 w-full">
      <div className="w-full py-6 bg-linear-to-r from-[#f76c1b65] to-[#367e34ce] text-center">
        <h1 className="font-medium mb-4">
          Ready to Simplify Your Tax Management?
        </h1>
        <p className="mb-4">
          Join thousands of Nigerians managing their taxes efficiently
        </p>
        <Link to="/register">
          {" "}
          <button className="btn-primary cursor-pointer">Start Tracking Now</button>{" "}
        </Link>
      </div>
    </div>
  );
};

export default Explore;
