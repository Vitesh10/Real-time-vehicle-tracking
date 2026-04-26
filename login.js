function login() {
  localStorage.setItem("loggedIn", "true");
  window.location.href = "dashboard.html";
}