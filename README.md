# 🛰️ Physical Computing Project 2025 – IT KMITL

## 📌 Project Name
### **Signalgunkhamoi (สัญญาณกันขโมย)**

---

## 👥 Group Members
- นางสาวพิมพ์มณี นิมิตราภรณ์ — 67070311  
- นายพิสิษฐ์ภณ จันทร — 67070119  
- นายภาษาณฑ์ ศิวธนเณศ — 67070133  
- นายวศิน จันทร์ก้อน — 67070161  

---

## 🎯 Project Objective
โปรเจกต์นี้มีวัตถุประสงค์เพื่อพัฒนา **ระบบสัญญาณกันขโมยอัจฉริยะ (Smart Anti-Theft System)** ที่สามารถ:

- ตรวจจับวัตถุหรือบุคคลผ่าน **Ultrasonic Sensor**
- ส่งเสียงเตือนผ่าน **Buzzer**
- เชื่อมต่อ **Wi-Fi** และส่งข้อมูลไปยัง **API Server (Next.js / Node.js)**
- รองรับการตั้งค่า Wi-Fi ผ่านหน้าเว็บ (Access Point Mode)
- เก็บค่าการตั้งค่าไว้ใน **EEPROM**
- แสดงสถานะการเชื่อมต่อด้วย LED
- สามารถรีเซ็ตค่าทั้งหมดผ่านปุ่ม Reset

---

## ⚙️ Hardware Components
| อุปกรณ์ | หน้าที่ |
|----------|----------|
| **Arduino UNO R4 WiFi** | ควบคุมหลักของระบบ เชื่อมต่อ Wi-Fi และส่งข้อมูลไปยัง API |
| **Ultrasonic Sensor (HC-SR04)** | ตรวจจับระยะวัตถุ เพื่อระบุการบุกรุก |
| **Buzzer** | ส่งเสียงแจ้งเตือนเมื่อมีการตรวจพบ |
| **LED (2 ดวง)** | แสดงสถานะการตรวจจับ (detect LED) และสถานะ Wi-Fi |
| **Push Button** | ใช้สำหรับ Reset การตั้งค่า (ล้าง EEPROM) |

---

## 💻 Software Components
| ส่วน | รายละเอียด |
|------|-------------|
| **Arduino IDE / PlatformIO** | ใช้พัฒนาและอัปโหลดโปรแกรมไปยังบอร์ด |
| **WiFiS3.h** | ไลบรารีเชื่อมต่อ Wi-Fi สำหรับบอร์ด UNO R4 WiFi |
| **EEPROM.h** | บันทึกข้อมูล Wi-Fi และ Device Code ถาวร |
| **WiFiServer.h** | สร้างเว็บเซิร์ฟเวอร์เพื่อเปิดหน้า “Setup Page” สำหรับตั้งค่า Wi-Fi |
| **HTTPS Client (WiFiSSLClient)** | ใช้ส่งข้อมูลแจ้งเตือนไปยัง API ผ่าน HTTPS |
| **Next.js + Node.js Backend** | ฝั่งเซิร์ฟเวอร์รับข้อมูลแจ้งเตือนจากอุปกรณ์และบันทึกลงฐานข้อมูล |
| **Database (MySQL / SQLite)** | เก็บข้อมูลเหตุการณ์การตรวจจับ |

---

## 🌐 System Flow

### 1. **Initial Setup (ครั้งแรก)**
- บอร์ดเปิดในโหมด **Access Point (AP)** ชื่อ `"Alarm-Setup"`
- ผู้ใช้เชื่อมต่อ Wi-Fi → เปิดหน้าเว็บ `http://192.168.4.1`
- กรอกค่า:
  - ชื่อ Wi-Fi (SSID)
  - รหัสผ่าน Wi-Fi
  - Device Code (รหัสประจำอุปกรณ์)
- บอร์ดบันทึกค่าใน EEPROM และรีสตาร์ทเข้าสู่โหมดปกติ

---

### 2. **Normal Mode**
1. Arduino เชื่อมต่อ Wi-Fi ตามค่าที่บันทึกไว้  
2. ตรวจจับระยะด้วย Ultrasonic Sensor  
3. หากพบวัตถุใกล้กว่า **30 cm**:
   - เปิดเสียง Buzzer  
   - เปิดไฟ LED แจ้งเตือน  
   - ส่งข้อมูล (`deviceCode`) ไปยัง API:
     ```json
     POST https://signalgunkhamoi.vercel.app/api/alert
     {
       "deviceCode": "YOUR_DEVICE_CODE"
     }
     ```
4. Server รับข้อมูลและบันทึกลงฐานข้อมูล / แจ้งเตือนผ่านเว็บ Dashboard  

---

## 💡 System Features

- ✅ **Web Setup Mode (Wi-Fi Config Page)**  
  ผู้ใช้สามารถตั้งค่า Wi-Fi ได้โดยไม่ต้องแก้โค้ด

- 💾 **EEPROM Save**  
  เก็บค่าที่ตั้งไว้ถาวร แม้รีเซ็ตบอร์ด

- 📶 **Wi-Fi LED Indicator**  
  ไฟสถานะ Wi-Fi แสดงผลต่อเนื่อง

- 🚨 **Intrusion Detection**  
  ตรวจจับระยะใกล้กว่า 30cm แล้วส่งเสียงเตือน + ส่งข้อมูลไป API

- 🔘 **Reset Button**  
  ล้างค่าทั้งหมดใน EEPROM เพื่อกลับเข้าสู่โหมด Setup

---

## 📊 Example API Response
```json
{
  "status": "success",
  "message": "Alert received",
  "deviceCode": "A1B2C3D4"
}
