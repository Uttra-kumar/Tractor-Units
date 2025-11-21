document.addEventListener('DOMContentLoaded', function() {

    /* ------------------------------------------
       🔥 BACK BUTTON FIX + CACHE DISABLE
       ------------------------------------------ */

    // Back se cache load ho to reload force
    window.addEventListener("pageshow", function(event) {
        if (event.persisted) window.location.reload();
    });

    // Back button block
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", function() {
        window.history.pushState(null, "", window.location.href);
        location.reload();
    });

    /* ------------------------------------------
       🔐 SESSION CHECK (TOP)
       ------------------------------------------ */
    const SESSION_KEYS = {
        LOGIN_STATUS: 'isLoggedIn',
        EXPIRY_TIME: 'session'
    };

    const REDIRECT_URL = "admin-login.html";

    const isLoggedIn = localStorage.getItem(SESSION_KEYS.LOGIN_STATUS);

    if (!isLoggedIn || isLoggedIn !== "true") {
        clearSessionData();
        window.location.href = REDIRECT_URL;
        return;
    }

    /* ------------------------------------------
       ⏳ SESSION TIMER
       ------------------------------------------ */
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
        const remaining = parseInt(expiryTime) - Date.now();

        if (remaining <= 0) {
            clearInterval(sessionInterval);
            clearSessionData();
            showMessage("⏳ Session expired! Please login again.", "error");
            setTimeout(() => window.location.href = REDIRECT_URL, 1500);
            return;
        }

        updateCounter(remaining);
    }

    function updateCounter(ms) {
        const total = Math.floor(ms / 1000);
        const m = Math.floor(total / 60);
        const s = total % 60;

        if (counter)
            counter.textContent = `${m}:${s.toString().padStart(2, "0")}`;
    }

    /* ------------------------------------------
       🚪 LOGOUT FUNCTION
       ------------------------------------------ */
    function setupLogoutHandler() {
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
    }

    function handleLogout() {
        clearInterval(sessionInterval);
        clearSessionData();
        showMessage("✔ Logout successful!", "success");
        setTimeout(() => window.location.href = REDIRECT_URL, 1500);
    }

    function clearSessionData() {
        localStorage.removeItem(SESSION_KEYS.LOGIN_STATUS);
        localStorage.removeItem(SESSION_KEYS.EXPIRY_TIME);
    }

    /* ------------------------------------------
       🔔 NOTIFICATION UI (ICON + CENTER BOX)
       ------------------------------------------ */
    function showMessage(message, type = "info") {

        const styles = {
            success: {
                icon: "fas fa-check-circle",
                bg: "linear-gradient(135deg, #27ae60, #2ecc71)"
            },
            error: {
                icon: "fas fa-times-circle",
                bg: "linear-gradient(135deg, #e74c3c, #c0392b)"
            },
            warning: {
                icon: "fas fa-exclamation-triangle",
                bg: "linear-gradient(135deg, #f39c12, #e67e22)"
            },
            info: {
                icon: "fas fa-info-circle",
                bg: "linear-gradient(135deg, #3498db, #2980b9)"
            }
        };

        const cfg = styles[type] || styles.info;

        const old = document.getElementById("session-notification");
        if (old) old.remove();

        const box = document.createElement("div");
        box.id = "session-notification";
        box.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 22px 32px;
            border-radius: 12px;
            color: white;
            z-index: 9999;
            background: ${cfg.bg};
            font-size: 17px;
            display: flex;
            align-items: center;
            gap: 14px;
            box-shadow: 0px 8px 25px rgba(0,0,0,0.3);
            animation: fadeIn 0.25s ease-out;
            font-family: 'Poppins', sans-serif;
        `;

        box.innerHTML = `
            <i class="${cfg.icon}" style="font-size: 22px;"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(box);

        setTimeout(() => {
            box.style.animation = "fadeOut 0.25s ease-in";
            setTimeout(() => box.remove(), 250);
        }, 2200);
    }

    /* ------------------------------------------
       ✨ CSS Animations (Auto Inject)
       ------------------------------------------ */
    const anim = document.createElement("style");
    anim.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -60%); }
            to   { opacity: 1; transform: translate(-50%, -50%); }
        }

        @keyframes fadeOut {
            from { opacity: 1; transform: translate(-50%, -50%); }
            to   { opacity: 0; transform: translate(-50%, -60%); }
        }
    `;
    document.head.appendChild(anim);

});
