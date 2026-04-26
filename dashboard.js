
const API_URL = "https://real-time-vehicle-tracking-8lpk.onrender.com/vehicles";

let markers = {};
let paths = {};
let chart;

// ==============================
// 🚗 ADVANCED VEHICLE ICON
// ==============================
const carIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3202/3202926.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35]
});

// ==============================
// 🗺️ PREMIUM DARK MAP (BEST)
// ==============================
const map = L.map("map", {
  zoomControl: true
}).setView([18.5204, 73.8567], 13);

// Carto Dark (clean)
L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
  attribution: "&copy; OpenStreetMap & CartoDB",
  subdomains: "abcd",
  maxZoom: 20
}).addTo(map);

// ==============================
// 🎨 ROUTE COLORS
// ==============================
const colors = ["#ff4d4d", "#4da6ff", "#33cc33", "#ff9933", "#cc66ff"];

// ==============================
// 📊 CHART SETUP (IMPROVED)
// ==============================
function initChart() {
  const ctx = document.getElementById("speedChart").getContext("2d");

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [{
        label: "Vehicle Speed (km/h)",
        data: [],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      }
    }
  });
}

initChart();

// ==============================
// 🔄 FETCH DATA + UI UPDATE
// ==============================
async function fetchData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const table = document.getElementById("vehicleTable");
    table.innerHTML = "";

    let names = [];
    let speeds = [];

    data.forEach((v, i) => {

      // 🚨 STATUS
      let status = v.speed > 80 ? "Over Speed ⚠️" : "Normal";
      let rowClass = v.speed > 80 ? "overspeed-row" : "";

      // 📋 TABLE
      table.innerHTML += `
        <tr class="${rowClass}">
          <td>${v.id}</td>
          <td>${v.name}</td>
          <td>${v.driver}</td>
          <td>${v.speed} km/h</td>
          <td>${status}</td>
          <td>${v.lat.toFixed(4)}</td>
          <td>${v.lng.toFixed(4)}</td>
        </tr>
      `;

      names.push(v.name);
      speeds.push(v.speed);

      // ==============================
      // 🚗 MARKER WITH SMOOTH UPDATE
      // ==============================
      if (!markers[v.id]) {
        markers[v.id] = L.marker([v.lat, v.lng], {
          icon: carIcon
        })
          .addTo(map)
          .bindPopup(`<b>${v.name}</b><br>Driver: ${v.driver}`);
      } else {
        // Smooth movement (visual improvement)
        markers[v.id].setLatLng([v.lat, v.lng]);
      }

      // ==============================
      // 🛣️ ROUTE TRACKING (IMPROVED)
      // ==============================
      if (!paths[v.id]) {
        paths[v.id] = L.polyline([[v.lat, v.lng]], {
          color: colors[i % colors.length],
          weight: 5,
          opacity: 0.8
        }).addTo(map);
      } else {
        paths[v.id].addLatLng([v.lat, v.lng]);
      }

      // ==============================
      // 📍 POPUP LIVE UPDATE
      // ==============================
      markers[v.id].setPopupContent(`
        <b>${v.name}</b><br>
        Driver: ${v.driver}<br>
        Speed: ${v.speed} km/h
      `);
    });

    // ==============================
    // ⏱ LAST UPDATE TIME
    // ==============================
    document.getElementById("lastUpdate").innerText =
      "Last Updated: " + new Date().toLocaleTimeString();

    // ==============================
    // 📊 UPDATE CHART
    // ==============================
    chart.data.labels = names;
    chart.data.datasets[0].data = speeds;
    chart.update();

  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

// ==============================
// 🔁 REAL-TIME UPDATE (10 sec)
// ==============================
fetchData();
setInterval(fetchData, 10000);

// ==============================
// 🔓 LOGOUT
// ==============================
function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}