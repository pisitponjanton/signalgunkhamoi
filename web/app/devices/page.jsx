"use client";
import { useEffect, useState } from "react";

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);

  const loadDevices = async () => {
    const res = await fetch("/api/device/list");
    const data = await res.json();
    if (res.ok) setDevices(data.devices || []);
    else alert(data.error || "ไม่สามารถโหลดอุปกรณ์ได้");
  };

  const removeDevice = async (code) => {
    if (!confirm("ต้องการลบอุปกรณ์นี้หรือไม่?")) return;
    const res = await fetch("/api/device/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceCode: code }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("ลบอุปกรณ์เรียบร้อย");
      loadDevices();
    } else {
      alert(data.error || "ลบไม่สำเร็จ");
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  return (
    <main className="max-w-2xl mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-6 text-center">รายการอุปกรณ์ของคุณ</h1>
      {devices.length === 0 ? (
        <p className="text-center text-gray-600">ยังไม่มีอุปกรณ์</p>
      ) : (
        <div className="space-y-3">
          {devices.map((d) => (
            <div
              key={d.deviceCode}
              className="flex justify-between items-center border p-3 rounded shadow-sm bg-white"
            >
              <div>
                <p className="font-semibold">{d.deviceName}</p>
                <p className="text-sm text-gray-500">รหัส: {d.deviceCode}</p>
                {d.location && (
                  <p className="text-sm text-gray-600">📍 {d.location}</p>
                )}
              </div>
              <button
                onClick={() => removeDevice(d.deviceCode)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                ลบ
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <a
          href="/"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded"
        >
          ➕ เพิ่มอุปกรณ์ใหม่
        </a>
      </div>
    </main>
  );
}
