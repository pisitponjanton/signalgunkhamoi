"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [device, setDevice] = useState({ deviceName: "", location: "" });
  const router = useRouter();

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/device/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(device),
    });
    const data = await res.json();
    if (res.ok) {
      alert("เพิ่มอุปกรณ์สำเร็จ!");
      router.push("/devices"); // ✅ ไปหน้า list ทันทีหลังเพิ่ม
    } else {
      alert(data.error || "เกิดข้อผิดพลาด");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <main className="max-w-lg mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4 text-center">เพิ่มอุปกรณ์กันขโมย</h1>

      <form onSubmit={handleAdd} className="space-y-3">
        <input
          placeholder="ชื่ออุปกรณ์"
          className="border p-2 w-full rounded"
          onChange={(e) => setDevice({ ...device, deviceName: e.target.value })}
          required
        />
        <input
          placeholder="Location"
          className="border p-2 w-full rounded"
          onChange={(e) => setDevice({ ...device, location: e.target.value })}
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded w-full">
          เพิ่มอุปกรณ์
        </button>
      </form>

      {/* ✅ ปุ่มไปหน้ารายการอุปกรณ์ */}
      <div className="mt-4">
        <button
          onClick={() => router.push("/devices")}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          ดูอุปกรณ์ทั้งหมด
        </button>
      </div>

      {/* ปุ่ม logout */}
      <button
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded w-full"
        onClick={handleLogout}
      >
        Logout
      </button>
    </main>
  );
}
