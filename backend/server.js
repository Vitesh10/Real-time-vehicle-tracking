const express = require("express");
const cors = require("cors");

const app = express();   // ✅ FIRST
app.use(cors());

// ✅ NOW routes
app.get("/test", (req, res) => {
  res.send("TEST WORKING");
});

let vehicles = [
  { id: 1, name: "Car A", driver: "Rahul", speed: 60, lat: 18.52, lng: 73.85 },
  { id: 2, name: "Car B", driver: "Amit", speed: 50, lat: 19.07, lng: 72.87 },
  { id: 3, name: "Car C", driver: "Suresh", speed: 40, lat: 28.70, lng: 77.10 },
  { id: 4, name: "Car D", driver: "Ravi", speed: 30, lat: 13.08, lng: 80.27 },
  { id: 5, name: "Car E", driver: "Vijay", speed: 70, lat: 22.57, lng: 88.36 }
];

// update logic...

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/vehicles", (req, res) => {
  console.log("Vehicles API hit");
  res.json(vehicles);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});