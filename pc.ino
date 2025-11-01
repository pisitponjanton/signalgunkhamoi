#include <WiFiS3.h>
#include <EEPROM.h>
#include <WiFiServer.h>

WiFiServer server(80);

const int trigPin = 2;
const int echoPin = 3;
const int buzzerPin = 8;
const int detectLedPin = 13;
const int wifiLedPin = 12;
const int resetBtnPin = 7;

// 🌍 API ของคุณ
const char* apiHost = "signalgunkhamoi.vercel.app";
const char* apiPath = "/api/alert";
const int apiPort = 443; // HTTPS

String ssid = "";
String password = "";
String deviceCode = "";
bool wifiConfigured = false;

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzerPin, OUTPUT);
  pinMode(detectLedPin, OUTPUT);
  pinMode(wifiLedPin, OUTPUT);
  pinMode(resetBtnPin, INPUT_PULLUP);
  EEPROM.begin();

  initSystem();
}

void loop() {
  if (!wifiConfigured) {
    handleWiFiSetupPage();
    return;
  }

  checkDistance();
  updateWifiLED();
  checkResetButton();
}

// ---------- INITIAL SYSTEM ----------
void initSystem() {
  ssid = readStringFromEEPROM(0);
  password = readStringFromEEPROM(50);
  deviceCode = readStringFromEEPROM(100);

  if (ssid.length() > 0) {
    Serial.println("📶 Connecting to Wi-Fi: " + ssid);
    WiFi.begin(ssid.c_str(), password.c_str());
    int tries = 0;
    while (WiFi.status() != WL_CONNECTED && tries++ < 15) {
      delay(500);
      Serial.print(".");
    }
    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("\n✅ Connected! IP: " + WiFi.localIP().toString());
      wifiConfigured = true;
      return;
    }
  }
  startSetupMode();
}

// ---------- DISTANCE SENSOR ----------
long getDistanceCM() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH);
  return duration * 0.034 / 2;
}

void checkDistance() {
  long distance = getDistanceCM();
  if (distance > 0 && distance < 30) {
    digitalWrite(buzzerPin, HIGH);
    digitalWrite(detectLedPin, HIGH);
    Serial.println("🚨 Object Detected!");
    sendAlertToServer();
  } else {
    digitalWrite(buzzerPin, LOW);
    digitalWrite(detectLedPin, LOW);
  }
  delay(400);
}

// ---------- API ALERT ----------
void sendAlertToServer() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ Wi-Fi not connected, skip sending");
    return;
  }

  WiFiSSLClient https;
  Serial.println("🌐 Sending alert to API...");

  if (https.connect(apiHost, apiPort)) {
    String json = "{\"deviceCode\":\"" + deviceCode + "\"}";
    String request =
      "POST " + String(apiPath) + " HTTP/1.1\r\n" +
      "Host: " + String(apiHost) + "\r\n" +
      "Content-Type: application/json\r\n" +
      "Connection: close\r\n" +
      "Content-Length: " + String(json.length()) + "\r\n\r\n" +
      json;

    https.print(request);
    Serial.println("📡 Data sent: " + json);

    unsigned long timeout = millis();
    while (https.connected() && millis() - timeout < 3000) {
      while (https.available()) {
        String line = https.readStringUntil('\n');
        Serial.println(line);
        timeout = millis();
      }
    }
    https.stop();
    Serial.println("✅ Done.");
  } else {
    Serial.println("❌ Failed to connect to API");
  }
}

// ---------- SETUP PAGE ----------
void startSetupMode() {
  Serial.println("🌐 Starting AP mode: Alarm-Setup");
  WiFi.disconnect();
  delay(500);
  int status = WiFi.beginAP("Alarm-Setup");
  if (status != WL_AP_LISTENING) {
    Serial.println("❌ Failed to start AP mode, restarting...");
    delay(2000);
    NVIC_SystemReset();
  }
  server.begin();
  Serial.println("✅ AP mode ready → connect to 'Alarm-Setup'");
  Serial.println("🌍 Open http://192.168.4.1 to configure Wi-Fi");
}

void handleWiFiSetupPage() {
  WiFiClient client = server.available();
  if (!client) return;
  while (!client.available()) delay(1);
  String req = client.readStringUntil('\r');
  client.flush();

  if (req.indexOf("GET /set?") >= 0) {
    int s1 = req.indexOf("ssid=") + 5;
    int s2 = req.indexOf("&pass=");
    int p1 = req.indexOf("&pass=") + 6;
    int p2 = req.indexOf("&device=");
    int d1 = req.indexOf("&device=") + 8;
    int d2 = req.indexOf("HTTP/");

    String newSSID = req.substring(s1, s2);
    String newPASS = req.substring(p1, p2);
    String newDEV = req.substring(d1, d2);

    newSSID.replace("%20", " ");
    newPASS.replace("%20", " ");
    newDEV.replace("%20", " ");

    writeStringToEEPROM(0, newSSID);
    writeStringToEEPROM(50, newPASS);
    writeStringToEEPROM(100, newDEV);

    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: text/html\nConnection: close\n");
    client.println("<h2>✅ Wi-Fi & Device Saved! Restarting...</h2>");
    client.stop();

    delay(2000);
    NVIC_SystemReset();
  } else {
    int n = WiFi.scanNetworks();
    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: text/html\nConnection: close\n");
    client.println("<html><body><h2>🚀 Setup Wi-Fi</h2>");
    client.println("<form action='/set'>");
    client.println("Wi-Fi: <select name='ssid'>");
    for (int i = 0; i < n; i++) {
      client.print("<option value='");
      client.print(WiFi.SSID(i));
      client.print("'>");
      client.print(WiFi.SSID(i));
      client.println("</option>");
    }
    client.println("</select><br>");
    client.println("Password: <input name='pass' type='password'><br>");
    client.println("Device Code: <input name='device' type='text'><br>");
    client.println("<input type='submit' value='Save & Connect'></form>");
    client.println("</body></html>");
    client.stop();
  }
}

// ---------- EEPROM ----------
void writeStringToEEPROM(int addr, const String &data) {
  int len = data.length();
  for (int i = 0; i < len; i++) EEPROM.write(addr + i, data[i]);
  EEPROM.write(addr + len, 0);
}

String readStringFromEEPROM(int addr) {
  char buf[50];
  int len = 0;
  unsigned char k = EEPROM.read(addr);
  while (k != 0 && len < 50) {
    buf[len++] = k;
    k = EEPROM.read(addr + len);
  }
  buf[len] = '\0';
  return String(buf);
}

// ---------- UTILITIES ----------
void updateWifiLED() {
  digitalWrite(wifiLedPin, WiFi.status() == WL_CONNECTED ? HIGH : LOW);
}

void checkResetButton() {
  if (digitalRead(resetBtnPin) == LOW) {
    Serial.println("🔘 Reset pressed → clear EEPROM");
    for (int i = 0; i < EEPROM.length(); i++) EEPROM.write(i, 0);
    delay(1000);
    NVIC_SystemReset();
  }
}
