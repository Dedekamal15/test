import React, { use, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [usernam, setUsername] = useState("");
  const [kelas] = useState("");
  const naviagate = useNavigate();

  const handleLogin = async () => {
    if (username.trim === "" || kelas === "") {
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
        // Simpan data ke localStorage
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
    <div class="login-box">
      <h2>Login</h2>
      <input
        type="text"
        id="username"
        placeholder="Masukkan Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <select value={kelas} onChange={(e) => setKelas(e.target.value)} required>
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
       <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Memproses...' : 'Masuk'}
      </button>
    </div>
  );
}

export default Login;
