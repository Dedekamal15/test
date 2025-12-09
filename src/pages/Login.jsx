import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [kelas, setKelas] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (username.trim() === "" || kelas === "") {
      alert("Harap isi Username dan pilih Kelas!");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, kelas }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("kelas", data.user.kelas);
        alert("Login berhasil!");
        navigate("/dashboard");
      } else {
        alert(data.error || "Login gagal");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 h-screen w-full items-center justify-center bg-white">
      <div className="border-2 p-16 rounded-xl shadow-lg max-w-md mx-auto bg-blue-400">
        <div className="flex flex-col items-center space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-16">Login</h2>
          <input
            className="rounded-md items-center h-8 w-full"
            type="text"
            placeholder="Masukkan Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <select
            className="rounded-md w-full"
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            required
          >
            <option value="">-- Pilih Kelas --</option>
            <option value="4">Kelas 4</option>
            <option value="5">Kelas 5</option>
            <option value="6">Kelas 6</option>
            <option value="7">Kelas 7</option>
            <option value="8">Kelas 8</option>
            <option value="9">Kelas 9</option>
            <option value="10">Kelas 10</option>
            <option value="11">Kelas 11</option>
            <option value="12">Kelas 12</option>
          </select>
          <button
          className="bg-blue-200 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md- w-full" 
          onClick={handleLogin} 
          disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
