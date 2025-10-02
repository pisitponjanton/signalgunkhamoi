"use client";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("ONLINE");

  // // โหลดข้อมูลการตรวจจับล่าสุด
  // useEffect(() => {
  //   fetchEvents();
  //   const interval = setInterval(fetchEvents, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  // async function fetchEvents() {
  //   try {
  //     const res = await fetch("/api/events");
  //     const data = await res.json();
  //     if (data.success) setEvents(data.events.slice(-5)); // เก็บ 5 รายการล่าสุด
  //   } catch (err) {
  //     console.error(err);
  //     setStatus("OFFLINE");
  //   }
  // }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-700 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">🔒 Signalgunkhamoi</h1>
        <p className="text-sm">Smart Anti-Theft System Dashboard</p>
      </header>

      <div className="max-w-5xl mx-auto p-6 grid gap-6">
        {/* Status Card */}
        <div className="bg-white shadow rounded-lg p-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">System Status</h2>
          <span
            className={`px-4 py-2 rounded-full text-white text-sm ${
              status === "ONLINE" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Real-time Alerts */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">⚡ Recent Alerts</h2>
          <div className="h-48 overflow-y-auto space-y-2">
            {events.length === 0 ? (
              <p className="text-gray-500">No alerts detected yet.</p>
            ) : (
              events.map((e) => (
                <div
                  key={e.id}
                  className="p-3 border-l-4 border-red-500 bg-red-50 rounded"
                >
                  <p className="text-sm">
                    {e.message || "Motion detected!"}
                  </p>
                  <span className="text-xs text-gray-500">
                    {new Date(e.timestamp).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">📊 Detection Statistics</h2>
          <div className="h-48 flex items-center justify-center text-gray-400">
            [ กราฟสถิติ (Chart.js / Recharts) ใส่ตรงนี้ ]
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">📢 Notifications</h2>
          <ul className="space-y-2">
            <li className="flex items-center justify-between">
              <span>Email Alerts</span>
              <span className="text-green-600 font-medium">Enabled</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Telegram Bot</span>
              <span className="text-green-600 font-medium">Enabled</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
