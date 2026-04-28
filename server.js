const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

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
// 🌐 Root Route
// ===============================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});


// ===============================
// 🚗 Vehicles API
// ===============================
app.get("/vehicles", (req, res) => {
  res.json(vehicles);
});


// ===============================
// 📊 Dashboard Route
// ===============================
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard.html"));
});


// ===============================
// 📄 PDF REPORT API (NEW)
// ===============================
app.get("/report", (req, res) => {
  const doc = new PDFDocument({ margin: 30 });

  const filePath = path.join(__dirname, "vehicle_report.pdf");
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  // 🏷️ Title
  doc
    .fontSize(20)
    .text("Vehicle Tracking Report", { align: "center" })
    .moveDown();

  doc
    .fontSize(10)
    .text(`Generated At: ${new Date().toLocaleString()}`, {
      align: "right",
    });

  doc.moveDown();

  // 📊 Table Header
  const tableTop = 120;

  doc
    .fontSize(12)
    .text("ID", 50, tableTop)
    .text("Vehicle", 100, tableTop)
    .text("Driver", 200, tableTop)
    .text("Speed", 300, tableTop)
    .text("Lat", 380, tableTop)
    .text("Lng", 460, tableTop);

  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

  // 🚗 Table Data
  let y = tableTop + 25;

  vehicles.forEach(v => {
    doc
      .fontSize(10)
      .text(v.id, 50, y)
      .text(v.name, 100, y)
      .text(v.driver, 200, y)
      .text(v.speed + " km/h", 300, y)
      .text(v.lat.toFixed(4), 380, y)
      .text(v.lng.toFixed(4), 460, y);

    y += 20;

    // Page break
    if (y > 750) {
      doc.addPage();
      y = 50;
    }
  });

  // ✅ Finish
  doc.end();

  stream.on("finish", () => {
    res.download(filePath, "vehicle_report.pdf");
  });
});


// ===============================
// ❌ 404 Handler (ALWAYS LAST)
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