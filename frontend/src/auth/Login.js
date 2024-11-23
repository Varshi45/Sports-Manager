import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useGlobalContext } from "../context/Globalcontext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useGlobalContext();

  // Handle email/password login
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Login successful!");

        // Store the token and user data
        localStorage.setItem("token", result.token);
        setUser(result.user);
        localStorage.setItem("user", JSON.stringify(result.user));
        // Navigate based on user role
        if (result.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (result.user.role === "player") {
          navigate("/player/dashboard");
        }
      } else {
        alert(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login");
    }
  };

  // Handle Google Login
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
        alert("Google Login successful!");

        // Store the token and user data
        localStorage.setItem("token", result.token);
        setUser(result.user);
        let user = result.user;
        let role = "player";
        user = { ...user, role };
        console.log(user);
        localStorage.setItem("user", JSON.stringify(user));

        navigate("/player/dashboard");
      } else {
        alert(result.message || "Google Login failed");
      }
    } catch (error) {
      console.error("Error during Google Login:", error);
      alert("An error occurred during Google Login");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md bg-white bg-opacity-90 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-5 text-gray-800">Login</h1>

        {/* Email/Password Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
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
            value="Login"
            className="w-full bg-blue-500 text-white font-bold py-2 rounded"
          />
        </form>

        {/* Google Login */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">Or login with:</p>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.error("Google Login failed")}
          />
        </div>

        {/* Signup Link */}
        <p className="mt-5 text-center">
          <a href="/signup" className="text-blue-500 hover:text-blue-700">
            Create Account..!
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
