import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGlobalContext } from "../context/Globalcontext";
import { GoogleLogin } from "@react-oauth/google";

function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useGlobalContext();

  // Handle form-based sign-up
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      firstName,
      lastName,
      email,
      password,
      role: "player",
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Sign-Up successful!");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");

        if (result.token) {
          localStorage.setItem("token", result.token);
          setUser(result.user);
          localStorage.setItem("user", JSON.stringify(result.user));
        }
        navigate("/player/dashboard");
      } else {
        alert(result.message || "Sign-Up failed");
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      alert("An error occurred during sign-up");
    }
  };

  // Handle Google Sign-Up
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER}/api/auth/google-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: credentialResponse.credential }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Google Sign-Up successful!");

        if (result.token) {
          localStorage.setItem("token", result.token);
          setUser(result.user);
          localStorage.setItem("user", JSON.stringify(result.user));
        }

        // Navigate based on the role
        navigate("/player/dashboard");
      } else {
        alert(result.message || "Google Sign-Up failed");
      }
    } catch (error) {
      console.error("Error during Google Sign-Up:", error);
      alert("An error occurred during Google Sign-Up");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md bg-white bg-opacity-90 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-5 text-gray-800">Sign-Up</h1>

        {/* Form-based Sign-Up */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border rounded p-2"
          />
          <input
            type="text"
            placeholder="Last Name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border rounded p-2"
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded p-2"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded p-2"
          />
          <input
            type="submit"
            value="Submit"
            className="w-full bg-blue-500 text-white font-bold py-2 rounded"
          />
        </form>

        {/* Divider */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">Or sign up with:</p>
        </div>

        {/* Google Sign-Up */}
        <div className="mt-4 text-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.error("Google Sign-Up failed")}
          />
        </div>

        {/* Link to Login */}
        <p className="mt-5 text-center">
          <Link to="/login" className="text-blue-500 hover:text-blue-700">
            Already have an account?
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
