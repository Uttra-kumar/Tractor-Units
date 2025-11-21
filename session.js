document.addEventListener('DOMContentLoaded', function() {
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
    // ✅ Helper Functions
    // -------------------------------

    function initializeSessionCountdown() {
        updateCountdown(); // Initial call
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
            
            // Visual warning when less than 2 minutes remaining
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
        showMessage('⏳ Session expired! Please login again to continue.', 'info');
        clearSessionData();
        setTimeout(() => {
            redirectToLogin();
        }, 2000); // Give user time to read the message
    }

    function setupLogoutHandler() {
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", handleLogout);
        }
    }

    function handleLogout() {
        clearInterval(sessionInterval);
        showMessage('Logout successful! Redirecting to login page...', 'success');
        clearSessionData();
        
        setTimeout(() => {
            redirectToLogin();
        }, 1500);
    }

    function clearSessionData() {
        localStorage.removeItem(SESSION_KEYS.LOGIN_STATUS);
        localStorage.removeItem(SESSION_KEYS.EXPIRY_TIME);
    }

    function redirectToLogin() {
        window.location.href = REDIRECT_URL;
    }

    const messageTypes = {
    success: { 
        icon: 'fas fa-check-circle', 
        color: '#27ae60',
        bgColor: 'linear-gradient(135deg, #27ae60, #2ecc71)'
    },
    error: { 
        icon: 'fas fa-times-circle', 
        color: '#e74c3c',
        bgColor: 'linear-gradient(135deg, #e74c3c, #c0392b)'
    },
    warning: { 
        icon: 'fas fa-exclamation-triangle', 
        color: '#f39c12',
        bgColor: 'linear-gradient(135deg, #f39c12, #e67e22)'
    },
    info: { 
        icon: 'fas fa-info-circle', 
        color: '#3498db',
        bgColor: 'linear-gradient(135deg, #3498db, #2980b9)'
    }
};

function showMessage(message, type = 'info') {
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
            @keyframes pulse {
                0% { 
                    transform: scale(1); 
                }
                50% { 
                    transform: scale(1.05); 
                }
                100% { 
                    transform: scale(1); 
                }
            }
            
            #session-notification {
                font-family: 'Poppins', sans-serif;
            }
        `;
        document.head.appendChild(style);
    }
});
