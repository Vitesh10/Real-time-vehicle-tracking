const API_URL = "https://real-time-vehicle-tracking-8lpk.onrender.com/vehicles";

// Table body
const tableBody = document.getElementById("table-body");

// Initialize map (Pune default)
const map = L.map("map").setView([18.5204, 73.8567], 11);

// Add map tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Store markers
let markers = {};

// Fetch vehicles from API
async function fetchVehicles() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("API not responding");
    }

    const vehicles = await response.json();

    // Clear table
    tableBody.innerHTML = "";

    vehicles.forEach((v) => {
      // -----------------------------
      // TABLE DATA
      // -----------------------------
      const status = v.speed > 80 ? "Over Speed ⚠️" : "Normal";

      const row = `
        <tr>
          <td>${v.id}</td>
          <td>${v.name}</td>
          <td>${v.driver}</td>
          <td>${v.speed} km/h</td>
          <td>${status}</td>
          <td>${v.lat.toFixed(4)}</td>
          <td>${v.lng.toFixed(4)}</td>
        </tr>
      `;

      tableBody.innerHTML += row;

      // -----------------------------
      // MAP MARKERS
      // -----------------------------
      if (markers[v.id]) {
        // Update existing marker
        markers[v.id].setLatLng([v.lat, v.lng]);
      } else {
        // Create new marker
        const marker = L.marker([v.lat, v.lng])
          .addTo(map)
          .bindPopup(
            `<b>${v.name}</b><br>
             Driver: ${v.driver}<br>
             Speed: ${v.speed} km/h`
          );

        markers[v.id] = marker;
      }
    });

  } catch (error) {
    console.error("Error fetching vehicles:", error);
  }
}

// Initial load
fetchVehicles();

// Auto update every 3 seconds
setInterval(fetchVehicles, 10000);