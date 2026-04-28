const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve frontend files
app.use(express.static(__dirname));

// ===============================
// 🚗 Dummy Vehicle Data
// ===============================
let vehicles = [
  { id: 1, name: "Car A", driver: "Rahul", speed: 60, lat: 18.52, lng: 73.85 },
  { id: 2, name: "Car B", driver: "Amit", speed: 50, lat: 19.07, lng: 72.87 },
  { id: 3, name: "Car C", driver: "Suresh", speed: 40, lat: 28.70, lng: 77.10 },
  { id: 4, name: "Car D", driver: "Ravi", speed: 30, lat: 13.08, lng: 80.27 },
  { id: 5, name: "Car E", driver: "Vijay", speed: 70, lat: 22.57, lng: 88.36 }
];

// ===============================
// 🔄 Simulate Real-time Updates
// ===============================
setInterval(() => {
  vehicles.forEach(v => {
    v.speed = Math.floor(Math.random() * 120);
    v.lat += (Math.random() - 0.5) * 0.01;
    v.lng += (Math.random() - 0.5) * 0.01;
  });
}, 8000);

// ===============================
// 🧪 Test Route
// ===============================
app.get("/test", (req, res) => {
  res.send("TEST WORKING 🚀");
});

// ===============================
// 🌐 Root Route (Login Page)
// ===============================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// ===============================
// 🚗 Vehicles API
// ===============================
app.get("/vehicles", (req, res) => {
  console.log("Vehicles API hit");
  res.json(vehicles);
});

// ===============================
// 📄 Report API (Download JSON)
// ===============================
app.get("/report", (req, res) => {
  try {
    const reportData = vehicles.map(v => ({
      ID: v.id,
      Vehicle: v.name,
      Driver: v.driver,
      Speed: v.speed,
      Latitude: v.lat,
      Longitude: v.lng
    }));

    const filePath = path.join(__dirname, "vehicle_report.json");

    fs.writeFileSync(filePath, JSON.stringify(reportData, null, 2));

    res.download(filePath, "vehicle_report.json");

  } catch (error) {
    console.error("Report generation error:", error);
    res.status(500).send("Error generating report");
  }
});

// ===============================
// 📊 Dashboard Route
// ===============================
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard.html"));
});

// ===============================
// ❌ 404 Handler
// ===============================
app.use((req, res) => {
  res.status(404).send("Route not found ❌");
});

// ===============================
// 🚀 Start Server
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});