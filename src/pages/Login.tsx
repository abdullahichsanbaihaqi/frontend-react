import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!username || !password) {
      setError("Username dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("displayName", res.data.data.displayName);
      localStorage.setItem("refreshToken", res.data.data.refreshToken);
      navigate("/products");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 transition-all duration-300 hover:scale-[1.02]">
        
        {/* TITLE */}
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Welcome Back 
        </h2>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        {/* INPUT USERNAME */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none p-2 transition-all"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                handleLogin();
                }
            }}
          />
        </div>

        {/* INPUT PASSWORD */}
        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none p-2 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                handleLogin();
                }
            }}
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        {/* FOOTER */}
        <p className="text-sm text-center mt-4 text-gray-600">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}