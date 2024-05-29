import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById("username").focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError("Username and password cannot be empty.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.access_token);
        navigate("/manage-patients");
      } else {
        setError(
          "Failed to login. Please check your credentials and try again."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-gray-50 to-sky-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-extrabold text-center text-gray-800">
            Login to Your Account
          </h2>
          {error && (
            <p
              className="text-sm text-red-600 font-semibold mb-4"
              aria-live="assertive"
            >
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                className="px-4 py-3 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm sm:text-sm transition duration-200 ease-in-out"
                value={credentials.username}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                className="px-4 py-3 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm sm:text-sm transition duration-200 ease-in-out"
                value={credentials.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-3 px-4 text-sm font-medium rounded-md text-white ${
                loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <a
              href="#"
              className="text-sm text-indigo-600 hover:text-indigo-700 focus:outline-none focus:underline mt-2 text-right"
            >
              Forgot Password?
            </a>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
