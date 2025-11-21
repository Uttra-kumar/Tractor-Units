document.addEventListener('DOMContentLoaded', function() {

    
    // Back se page agar cache se aaye to force reload hoga
    window.addEventListener("pageshow", function (event) {
        if (event.persisted) {
            window.location.reload();
        }
    });

    // User back dabaye to page me rukne na do
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", function() {
        window.history.pushState(null, "", window.location.href);
        location.reload();
    });

    /* ---------------------------------------
       🔐 SESSION SECURITY CHECK (Very Top)
       --------------------------------------- */

    const SESSION_KEYS = {
        LOGIN_STATUS: 'isLoggedIn',
        EXPIRY_TIME: 'session'
    };

    const REDIRECT_URL = 'admin-login.html';

    const isLoggedIn = localStorage.getItem(SESSION_KEYS.LOGIN_STATUS);

    // Agar login nahi to direct redirect
    if (!isLoggedIn || isLoggedIn !== "true") {
        localStorage.removeItem(SESSION_KEYS.LOGIN_STATUS);
        localStorage.removeItem(SESSION_KEYS.EXPIRY_TIME);
        window.location.href = REDIRECT_URL;
        return;
    }

    /* ---------------------------------------
       ⏳ TIMER + SESSION EXPIRY SYSTEM
       --------------------------------------- */

    const counter = document.getElementById("counter");
    let sessionInterval;

    const expiryTime = localStorage.getItem(SESSION_KEYS.EXPIRY_TIME);

    if (!expiryTime) {
        clearSessionData();
        window.location.href = REDIRECT_URL;
        return;
    }

    initializeSessionCountdown();
    setupLogoutHandler();

    function initializeSessionCountdown() {
        updateCountdown();
        sessionInterval = setInterval(updateCountdown, 1000);
    }

    function updateCountdown() {
        const remainingTime = parseInt(expiryTime) - Date.now();

        if (remainingTime <= 0) {
            clearInterval(sessionInterval);
            clearSessionData();
            showMessage("⏳ Session expired! Please login again.", "error");
            setTimeout(() => window.location.href = REDIRECT_URL, 1500);
            return;
        }

        updateCounterDisplay(remainingTime);
    }

    function updateCounterDisplay(remainingTime) {
        const totalSeconds = Math.floor(remainingTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;
        if (counter) counter.textContent = formatted;
    }

    /* ---------------------------------------
       🚪 LOGOUT SYSTEM
       --------------------------------------- */
    
    function setupLogoutHandler() {
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
    }

    function handleLogout() {
        clearInterval(sessionInterval);
        clearSessionData();
        showMessage("Logout successful!", "success");
        setTimeout(() => window.location.href = REDIRECT_URL, 1500);
    }

    function clearSessionData() {
        localStorage.removeItem(SESSION_KEYS.LOGIN_STATUS);
        localStorage.removeItem(SESSION_KEYS.EXPIRY_TIME);
    }

    /* ---------------------------------------
       🔔 BEAUTIFUL NOTIFICATION SYSTEM
       --------------------------------------- */

    function showMessage(message, type = 'info') {
        const colors = {
            success: "linear-gradient(135deg, #27ae60, #2ecc71)",
            error: "linear-gradient(135deg, #e74c3c, #c0392b)",
            warning: "linear-gradient(135deg, #f39c12, #e67e22)",
            info: "linear-gradient(135deg, #3498db, #2980b9)"
        };

        const existing = document.getElementById("session-notification");
        if (existing) existing.remove();

        const box = document.createElement("div");
        box.id = "session-notification";
        box.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px 30px;
            background: ${colors[type]};
            color: white;
            z-index: 9999;
            font-size: 16px;
            border-radius: 10px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            animation: fadeIn 0.3s ease-out;
        `;
        box.textContent = message;

        document.body.appendChild(box);

        setTimeout(() => box.remove(), 2000);
    }

});
