import { Link } from "react-router-dom";
import React from "react";

const Home = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="py-2 text-2xl font-semibold">Welcome to Sports Manager</p>
      <p className="py-2">
        New Here?{" "}
        <Link className="text-green-600 hover:text-green-700" to="/signup">
          Sign-Up now...
        </Link>
      </p>
      <p className="py-2">
        Already have an Account?{" "}
        <Link className="text-green-600 hover:text-green-700" to="/login">
          Sign-In
        </Link>
      </p>
    </div>
  );
};

export default Home;
