document.addEventListener('DOMContentLoaded', function() {
// Prevent Back Button After Logout
window.history.pushState(null, "", window.location.href);
window.addEventListener("popstate", function () {
    window.history.pushState(null, "", window.location.href);
});
    

    // Disable browser caching
if (performance.navigation.type === performance.navigation.TYPE_BACK_FORWARD) {
    location.reload(true);
}
    
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!isLoggedIn || isLoggedIn !== 'true') {
        clearSessionData();
         redirectToLogin();
        showMessage('Please log in to access this page.', 'warning');
        window.location.replace('admin-login.html');
        return;
    }

    // -------------------------------
    // ✅ Login ok, ab session check
    // -------------------------------
    const expiryTime = localStorage.getItem("session");
    if (!expiryTime) {
        showMessage('Session not found. Please login again.', 'error');
        localStorage.removeItem("isLoggedIn");
        location.reload();
        window.location.replace("admin-login.html");
        return;
    }

    const counter = document.getElementById("counter");
    let intervalId;

    function updateCountdown() {
        const remaining = parseInt(expiryTime, 10) - Date.now();

        if (remaining <= 0) {
            clearInterval(intervalId);
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("session");
            showMessage('⏳ Session expired! Please login again.', 'info');
            setTimeout(() => {
                window.location.href = "admin-login.html";
            }, 2000);
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

    // -------------------------------
    // ✅ Logout button
    // -------------------------------
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            clearInterval(intervalId);
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("session");
            showMessage('Logout successful! Redirecting to login page...', 'success');
            setTimeout(() => {
                location.reload()!
                window.location.href = "admin-login.html";
            }, 1500);
        });
    }

    // -------------------------------
    // ✅ Beautiful Centered Notifications
    // -------------------------------
    function showMessage(message, type = 'info') {
        const messageTypes = {
            success: { 
                icon: 'fas fa-check-circle', 
                bgColor: 'linear-gradient(135deg, #27ae60, #2ecc71)'
            },
            error: { 
                icon: 'fas fa-times-circle', 
                bgColor: 'linear-gradient(135deg, #e74c3c, #c0392b)'
            },
            warning: { 
                icon: 'fas fa-exclamation-triangle', 
                bgColor: 'linear-gradient(135deg, #f39c12, #e67e22)'
            },
            info: { 
                icon: 'fas fa-info-circle', 
                bgColor: 'linear-gradient(135deg, #3498db, #2980b9)'
            }
        };

        const config = messageTypes[type] || messageTypes.info;
        
        // Remove existing notification if any
        const existingNotification = document.getElementById('session-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create new notification
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
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            width: 350px;
            height: auto;
            min-height: 80px;
            text-align: center;
            animation: fadeIn 0.3s ease-out;
            font-size: 16px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: ${config.bgColor};
            border: 2px solid rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1.5;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%;">
                <i class="${config.icon}" style="font-size: 22px; color: white;"></i>
                <span style="font-weight: 600; font-size: 16px; line-height: 1.4;">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'fadeOut 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);
    }

    // Add CSS animations
    if (!document.getElementById('session-styles')) {
        const style = document.createElement('style');
        style.id = 'session-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { 
                    opacity: 0; 
                    transform: translate(-50%, -60%); 
                }
                to { 
                    opacity: 1; 
                    transform: translate(-50%, -50%); 
                }
            }
            @keyframes fadeOut {
                from { 
                    opacity: 1; 
                    transform: translate(-50%, -50%); 
                }
                to { 
                    opacity: 0; 
                    transform: translate(-50%, -60%); 
                }
            }
        `;
        document.head.appendChild(style);
    }
});        clearInterval(sessionInterval);
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
