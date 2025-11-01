"use client";
import { useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      alert("สมัครสมาชิกสำเร็จ!");
      window.location.href = "/";
    } else {
      alert(data.error || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
    }
  };

  return (
    <div className="flex flex-col items-center mt-32">
      <h1 className="text-2xl font-bold mb-4">สมัครสมาชิก</h1>
      <form onSubmit={handleSignup} className="space-y-3 w-72">
        <input
          placeholder="ชื่อผู้ใช้"
          className="border p-2 w-full rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="อีเมล"
          type="email"
          className="border p-2 w-full rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="รหัสผ่าน"
          type="password"
          className="border p-2 w-full rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button className="bg-blue-500 text-white px-4 py-2 w-full rounded">
          สมัครสมาชิก
        </button>
        <a href="/login" className="text-blue-600 text-sm block text-center">
          มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
        </a>
      </form>
    </div>
  );
}
