"use client";
import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(form),
    });
    if (res.ok) window.location.href = "/";
    else alert("Invalid credentials");
  };

  return (
    <div className="flex flex-col items-center mt-32">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="space-y-3 w-72">
        <input placeholder="Email" className="border p-2 w-full" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" className="border p-2 w-full" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="bg-blue-500 text-white px-4 py-2 w-full rounded">Login</button>
        <a href="/signup" className="text-blue-600 text-sm">Sign up</a>
      </form>
    </div>
  );
}
