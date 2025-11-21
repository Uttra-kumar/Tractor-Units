document.addEventListener('DOMContentLoaded', function() {

    // ----------------------------------
    // 🔒 BACK BUTTON COMPLETELY DISABLED
    // ----------------------------------
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", function () {
        window.history.pushState(null, "", window.location.href);
        // Force reload so session check runs again
        location.reload();
    });

    // Prevent page loading from cache
    if (performance.getEntriesByType("navigation")[0].type === "back_forward") {
        location.reload();
    }

    // Session management variables
    const SESSION_KEYS = {
        LOGIN_STATUS: 'isLoggedIn',
        EXPIRY_TIME: 'session'
    };

    const REDIRECT_URL = 'admin-login.html';
    const counter = document.getElementById("counter");
    let sessionInterval;

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem(SESSION_KEYS.LOGIN_STATUS);

    if (!isLoggedIn || isLoggedIn !== 'true') {
        showMessage('Please log in to access this page.', 'warning');
        clearSessionData();
        redirectToLogin();
        return;
    }

    // Check session expiry
    const expiryTime = localStorage.getItem(SESSION_KEYS.EXPIRY_TIME);

    if (!expiryTime) {
        showMessage('Session not found. Please login again.', 'error');
        clearSessionData();
        redirectToLogin();
        return;
    }

    // Initialize session countdown
    initializeSessionCountdown();

    // Setup logout functionality
    setupLogoutHandler();

    // -------------------------------
    // Helper Functions
    // -------------------------------

    function initializeSessionCountdown() {
        updateCountdown();
        sessionInterval = setInterval(updateCountdown, 1000);
    }

    function updateCountdown() {
        const remainingTime = parseInt(expiryTime, 10) - Date.now();

        if (remainingTime <= 0) {
            handleSessionExpiry();
            return;
        }

        updateCounterDisplay(remainingTime);
    }

    function updateCounterDisplay(remainingTime) {
        const totalSeconds = Math.floor(remainingTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (counter) {
            counter.textContent = formattedTime;

            if (minutes < 2) {
                counter.style.background = 'linear-gradient(45deg, #e74c3c, #c0392b)';
                counter.style.animation = 'pulse 1s infinite';
            } else if (minutes < 5) {
                counter.style.background = 'linear-gradient(45deg, #f39c12, #e67e22)';
            }
        }
    }

    function handleSessionExpiry() {
        clearInterval(sessionInterval);
        showMessage('⏳ Session expired! Please login again.', 'info');
        clearSessionData();
        setTimeout(() => {
            window.location.href = REDIRECT_URL;
        }, 2000);
    }

    function setupLogoutHandler() {
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", handleLogout);
        }
    }

    function handleLogout() {
        clearInterval(sessionInterval);
        showMessage('Logout successful! Redirecting...', 'success');
        clearSessionData();

        setTimeout(() => {
            window.location.href = REDIRECT_URL;
        }, 1500);
    }

    function clearSessionData() {
        localStorage.removeItem(SESSION_KEYS.LOGIN_STATUS);
        localStorage.removeItem(SESSION_KEYS.EXPIRY_TIME);
    }

    function redirectToLogin() {
        window.location.href = REDIRECT_URL;
    }

    function showMessage(message, type = 'info') {
        const messageTypes = {
            success: { icon: 'fas fa-check-circle', bgColor: 'linear-gradient(135deg, #27ae60, #2ecc71)' },
            error: { icon: 'fas fa-times-circle', bgColor: 'linear-gradient(135deg, #e74c3c, #c0392b)' },
            warning: { icon: 'fas fa-exclamation-triangle', bgColor: 'linear-gradient(135deg, #f39c12, #e67e22)' },
            info: { icon: 'fas fa-info-circle', bgColor: 'linear-gradient(135deg, #3498db, #2980b9)' }
        };

        const config = messageTypes[type] || messageTypes.info;

        const existingNotification = document.getElementById('session-notification');
        if (existingNotification) existingNotification.remove();

        const notification = document.createElement('div');
        notification.id = 'session-notification';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px 30px;
            border-radius: 10px;
            color: white;
            z-index: 10000;
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            width: 350px;
            font-size: 16px;
            background: ${config.bgColor};
        `;

        notification.innerHTML = `
            <i class="${config.icon}" style="font-size: 22px; margin-right: 10px;"></i>
            ${message}
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }

});
