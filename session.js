<script>
document.addEventListener('DOMContentLoaded', function() {
  // -----------------------------------
  // 🔒 Session & Login Check
  // -----------------------------------
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (!isLoggedIn || isLoggedIn !== 'true') {
    alert('Please log in to access this page.');
    window.location.replace('admin-login.html');
    return;
  }

  const expiryTime = localStorage.getItem("session");
  if (!expiryTime) {
    alert("Session not found. Please login again.");
    localStorage.removeItem("isLoggedIn");
    window.location.replace("admin-login.html");
    return;
  }

  // -----------------------------------
  // ⏳ Session Countdown Timer
  // -----------------------------------
  const counter = document.getElementById("counter");
  let intervalId;

  function updateCountdown() {
    const remaining = parseInt(expiryTime, 10) - Date.now();

    if (remaining <= 0) {
      clearInterval(intervalId);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("session");
      alert("⏳ Session expired! Please login again.");
      window.location.replace("admin-login.html");
      return;
    }

    const totalSeconds = Math.floor(remaining / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formatted = `${minutes}:${seconds.toString().padStart(2,'0')}`;
    if (counter) counter.textContent = formatted;
  }

  updateCountdown();
  intervalId = setInterval(updateCountdown, 1000);

  // -----------------------------------
  // 🚪 Logout Button
  // -----------------------------------
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearInterval(intervalId);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("session");
      alert("✅ Logout Successfully");
      window.location.replace("admin-login.html");
    });
  }

  // -----------------------------------
  // 🔄 Prevent Back After Logout
  // -----------------------------------
  window.history.pushState(null, "", window.location.href);
  window.onpopstate = function () {
    window.history.pushState(null, "", window.location.href);
  };
});
</script>
