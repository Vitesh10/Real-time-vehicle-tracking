document.getElementById("loginBtn").addEventListener("click", function () {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;

  if (u === "admin" && p === "admin") {
    localStorage.setItem("auth", "true");
    window.location.href = "dashboard.html";
  } else {
    alert("Wrong username or password");
  }
});