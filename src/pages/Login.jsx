import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();

      // Save the token for subsequent requests.
      localStorage.setItem("token", data.token);
      
      

      alert("Logged in successfully!");

      // Debug: log the full response to inspect its structure
      console.log("Login response data:", data);

      // Attempt to extract the category:
      // - If the backend sends the user data under 'user'
      // - Otherwise, check if it is available directly on data.
      const userCategory =
        (data.user && data.user.category) || data.category || "";
      console.log("Extracted user category:", userCategory);

      // Use a case-insensitive comparison to decide the route.
      if (userCategory.toLowerCase() === "industry") {
        navigate("/industrywelcome");
      } else {
        // Default to the student dashboard if category is "Student" or empty/unknown.
        navigate("/studentdashboard");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-gradient-to-r from-black via-[#0a0a3c] to-[#000033] p-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-white p-10 relative">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: "url('')" }}
          ></div>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 relative z-10 text-center md:text-left">
            MetaMind
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-md leading-relaxed relative z-10 text-center md:text-center">
            Your gateway to limitless knowledge, creativity, and success. Unlock the
            power of AI and innovation with MetaMind.
          </p>
        </div>
        <div className="w-full md:w-1/2 flex justify-center mt-6 md:mt-0">
          <div className="bg-black/40 text-white p-6 md:p-10 rounded-2xl md:rounded-r-2xl shadow-2xl w-full max-w-md backdrop-blur-xl">
            <h2 className="text-3xl md:text-4xl font-semibold text-center">Login</h2>
            <p className="text-lg text-gray-400 text-center mt-1">
              Welcome back! Let’s get you in.
            </p>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-md text-gray-300">Email</label>
                <input
                  type="email"
                  className="w-full p-3 bg-[#2A2A2A] rounded-lg text-lg"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-md text-gray-300">Password</label>
                <input
                  type="password"
                  className="w-full p-3 bg-[#2A2A2A] rounded-lg text-lg"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-between items-center mt-4 text-md text-gray-400">
                <div>
                  <input type="checkbox" id="remember" className="mr-2" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="#" className="hover:text-blue-400">
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-400 to-purple-600 p-3 rounded-lg mt-6 text-lg text-white font-semibold"
              >
                Login
              </button>
            </form>
            <p className="text-gray-400 text-center mt-6 text-md">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-400 hover:underline">
                Signup
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
