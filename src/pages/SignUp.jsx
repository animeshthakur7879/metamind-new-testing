import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Changed initial value to "Student" to match the backend ENUM values.
  const [category, setCategory] = useState("Student");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    // Prepare the data object to send to your backend
    const signupData = {
      fullName,
      email,
      password,
      category,
    };

    try {
      // Send a POST request to your backend endpoint
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      // If the response is not OK, throw an error
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Signup failed");
      }

      // Parse the JSON response from the backend.
      // Expected response: { message, token, user: { id, fullName, email, category, ... } }
      const data = await response.json();

      // Store the JWT token in localStorage for subsequent authenticated requests.
      localStorage.setItem("token", data.token);

      alert("Account created successfully!");

      // Conditionally navigate based on the selected category
      if (category === "Industry") {
        navigate("/industrywelcome");
      } else {
        navigate("/studentdashboard");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat bg-gradient-to-r from-black via-[#0a0a3c] to-[#000033] overflow-hidden">
      <div
        className="w-full max-w-5xl flex flex-col md:flex-row items-center backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8"
        style={{ height: "85vh" }}
      >
        <div className="w-full md:w-1/2 flex justify-center">
          <div
            className="bg-black/50 text-white p-6 pe-12 md:rounded-l-2xl shadow-2xl w-full max-w-lg backdrop-blur-xl"
            style={{ height: "80vh" }}
          >
            <h2 className="text-xl md:text-5xl font-semibold text-center">
              Sign Up
            </h2>
            <p className="text-md text-gray-400 text-center mt-2">
              Join us and explore the future!
            </p>
            {error && (
              <p className="text-red-500 text-center">{error}</p>
            )}
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-md text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 bg-[#2A2A2A] rounded-lg text-lg"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-md text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-2 bg-[#2A2A2A] rounded-lg text-lg"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-md text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full p-2 bg-[#2A2A2A] rounded-lg text-lg"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-md text-gray-300">
                  Category
                </label>
                <select
                  className="w-full p-2 bg-[#2A2A2A] rounded-lg text-lg text-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {/* Option values to match the ENUM values in your database */}
                  <option value="Student">Student</option>
                  <option value="Industry">Industry</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-400 to-purple-600 p-4 rounded-lg mt-6 text-lg text-white font-semibold"
              >
                Sign Up
              </button>
            </form>
            <p className="text-gray-400 text-center mt-4 text-md">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
        <div
          className="w-full md:w-1/2 flex flex-col justify-center items-center text-white p-6 md:p-10 relative"
          style={{ height: "80vh" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            }}
          ></div>
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 relative z-10 text-center md:text-right">
            MetaMind
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-md leading-relaxed relative z-10 text-center md:text-right">
            Discover the world of AI and innovation with MetaMind. Your journey to limitless possibilities starts here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
