import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGlobalContext } from "../context/Globalcontext";
function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useGlobalContext();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

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
        // Clear form fields
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");

        if (result.token) {
          localStorage.setItem("token", result.token); // Store the token
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

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md bg-white bg-opacity-90 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-5 text-gray-800">Sign-Up</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input fields */}
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
