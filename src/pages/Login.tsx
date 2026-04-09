import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("/auth/login", {
        username,
        password,
      });

      console.log(res.data);

      // simpan token
      localStorage.setItem("token", res.data.token);

      // redirect
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert("Login gagal");
    }
  };

  return (
    <div>
      <h1>Login Page</h1>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}