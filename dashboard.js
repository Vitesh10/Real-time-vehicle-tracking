
// ================= GLOBALS =================
let chart;
let alertedVehicles = new Set();

let map;
let markers = {};
let paths = {};   // 📍 ROUTE STORAGE

// 🚗 Car Icon
const carIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

// 🎨 Route Colors
const routeColors = ["red", "blue", "green", "orange", "purple"];

// 🔔 Enable Notifications
function enableNotifications() {
  if ("Notification" in window) {
    Notification.requestPermission().then(p => {
      console.log("Notification permission:", p);
    });
  }
}

// 🔊 Alert Sound
const alertSound = new Audio("https://www.soundjay.com/buttons/sounds/beep-07.mp3");

// 📢 Alert Popup UI
function showAlert(msg) {
  let container = document.getElementById("alertContainer");

  if (!container) {
    container = document.createElement("div");
    container.id = "alertContainer";
    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.right = "20px";
    container.style.zIndex = "9999";
    document.body.appendChild(container);
  }

  const box = document.createElement("div");
  box.innerText = msg;
  box.style.background = "red";
  box.style.color = "white";
  box.style.padding = "12px";
  box.style.marginTop = "10px";
  box.style.borderRadius = "8px";
  box.style.fontWeight = "bold";

  container.appendChild(box);

  setTimeout(() => box.remove(), 4000);
}

// ================= MAP =================
function initMap() {
  map = L.map('map').setView([18.5204, 73.8567], 13);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CartoDB'
  }).addTo(map);
}

initMap();

// ================= FETCH DATA =================
async function fetchData() {
  try {
    const res = await fetch("http://localhost:3000/vehicles");
    const data = await res.json();

    const table = document.getElementById("vehicleTable");
    if (!table) return;   // ✅ safety check

    table.innerHTML = "";

    let names = [];
    let speeds = [];

    data.forEach(v => {

      let status = v.speed > 80 ? "Overspeed" : "Normal";
      let rowClass = v.speed > 80 ? "overspeed-row" : "";

      // 🚨 ALERT SYSTEM
      if (v.speed > 80 && !alertedVehicles.has(v.id)) {

        alertSound.play().catch(() => {});

        showAlert(`${v.name} (${v.driver}) Overspeed: ${v.speed} km/h`);

        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("🚨 Overspeed Alert!", {
            body: `${v.name} (${v.driver}) speed: ${v.speed} km/h`
          });
        }

        alertedVehicles.add(v.id);
      }

      // 📋 TABLE
      table.innerHTML += `
        <tr class="${rowClass}">
          <td>${v.id}</td>
          <td>${v.name}</td>
          <td>${v.driver}</td>
          <td>${v.speed}</td>
          <td>${status}</td>
          <td>${v.lat.toFixed(4)}</td>
          <td>${v.lng.toFixed(4)}</td>
        </tr>
      `;

      names.push(v.name);
      speeds.push(v.speed);

      // 🚗 MARKERS
      if (!markers[v.id]) {
        markers[v.id] = L.marker([v.lat, v.lng], { icon: carIcon })
          .addTo(map)
          .bindPopup(`${v.name} (${v.driver})`);
      } else {
        markers[v.id].setLatLng([v.lat, v.lng]);
      }

      // 📍 ROUTE TRACKING
      if (!paths[v.id]) {
        paths[v.id] = L.polyline([[v.lat, v.lng]], {
          color: routeColors[v.id % routeColors.length],
          weight: 4
        }).addTo(map);
      } else {
        paths[v.id].addLatLng([v.lat, v.lng]);

        // 🔥 LIMIT ROUTE SIZE
        let latlngs = paths[v.id].getLatLngs();
        if (latlngs.length > 20) latlngs.shift();
        paths[v.id].setLatLngs(latlngs);
      }

      // 🔄 Update Popup
      markers[v.id].setPopupContent(
        `${v.name} (${v.driver})<br>Speed: ${v.speed} km/h`
      );
    });

    // ⏱ Last Update Time (safe)
    const timeEl = document.getElementById("lastUpdate");
    if (timeEl) {
      timeEl.innerText =
        "Last Updated: " + new Date().toLocaleTimeString();
    }

    // 📊 CHART
    const chartEl = document.getElementById("speedChart");

    if (chartEl) {
      if (!chart) {
        chart = new Chart(chartEl, {
          type: "bar",
          data: {
            labels: names,
            datasets: [{
              label: "Speed",
              data: speeds
            }]
          }
        });
      } else {
        chart.data.labels = names;
        chart.data.datasets[0].data = speeds;
        chart.update();
      }
    }

  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

// ================= LOOP =================
fetchData();
setInterval(fetchData, 8000);

// ================= LOGOUT =================
function logout() {
  window.location.href = "login.html";
}