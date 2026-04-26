// 🔐 LOGIN PROTECTION
if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "login.html";
}

const API_URL = "https://real-time-vehicle-tracking-8lpk.onrender.com/vehicles";

let markers = {};
let paths = {};
let chart;

// 🚗 Car icon
const carIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

// 🗺️ Better dark map (professional look)
const map = L.map("map").setView([18.5204, 73.8567], 12);

L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
  attribution: "&copy; OpenStreetMap & CartoDB"
}).addTo(map);

// 🎨 Route colors
const colors = ["red", "blue", "green", "orange", "purple"];

// 📊 Chart setup
function initChart() {
  const ctx = document.getElementById("speedChart").getContext("2d");

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [{
        label: "Speed",
        data: []
      }]
    }
  });
}

initChart();

// 🔄 Fetch data
async function fetchData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const table = document.getElementById("table-body");
    table.innerHTML = "";

    let names = [];
    let speeds = [];

    data.forEach((v, i) => {

      // 🚨 status
      let status = v.speed > 80 ? "Over Speed ⚠️" : "Normal";
      let rowClass = v.speed > 80 ? "overspeed-row" : "";

      // 📋 table
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

      // 🚗 marker
      if (!markers[v.id]) {
        markers[v.id] = L.marker([v.lat, v.lng], { icon: carIcon })
          .addTo(map)
          .bindPopup(`${v.name} (${v.driver})`);
      } else {
        markers[v.id].setLatLng([v.lat, v.lng]);
      }

      // 📍 route tracking
      if (!paths[v.id]) {
        paths[v.id] = L.polyline([[v.lat, v.lng]], {
          color: colors[i % colors.length],
          weight: 4
        }).addTo(map);
      } else {
        paths[v.id].addLatLng([v.lat, v.lng]);
      }

      // popup update
      markers[v.id].setPopupContent(
        `${v.name}<br>Driver: ${v.driver}<br>Speed: ${v.speed}`
      );
    });

    // ⏱ last update
    document.getElementById("lastUpdate").innerText =
      "Last Updated: " + new Date().toLocaleTimeString();

    // 📊 update chart
    chart.data.labels = names;
    chart.data.datasets[0].data = speeds;
    chart.update();

  } catch (err) {
    console.error(err);
  }
}

// 🔁 update every 10 sec
fetchData();
setInterval(fetchData, 10000);

// 🔓 logout
function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}