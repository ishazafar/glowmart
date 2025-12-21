// Cookie Utility Functions
class CookieManager {
  // Set a cookie
  static set(name, value, days = 30) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
  }

  // Get a cookie
  static get(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Delete a cookie
  static delete(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  // Check if cookies are accepted
  static isAccepted() {
    return this.get('cookieConsent') === 'accepted';
  }

  // Accept cookies
  static accept() {
    this.set('cookieConsent', 'accepted', 365);
    this.set('cookieConsentDate', new Date().toISOString(), 365);
  }

  // Set session data
  static setSession(key, data, days = 7) {
    if (this.isAccepted()) {
      this.set(`session_${key}`, JSON.stringify(data), days);
    } else {
      // Fallback to localStorage if cookies not accepted
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  // Get session data
  static getSession(key) {
    if (this.isAccepted()) {
      const data = this.get(`session_${key}`);
      return data ? JSON.parse(data) : null;
    } else {
      // Fallback to localStorage
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
  }

  // Clear session
  static clearSession(key) {
    this.delete(`session_${key}`);
    localStorage.removeItem(key);
  }
}

// Cookie Consent Popup
class CookieConsent {
  constructor() {
    this.popup = null;
    this.init();
  }

  init() {
    // Check if already accepted
    if (CookieManager.isAccepted()) {
      return;
    }

    // Create popup HTML
    this.createPopup();
    this.showPopup();
  }

  createPopup() {
    const popup = document.createElement('div');
    popup.id = 'cookieConsentPopup';
    popup.innerHTML = `
      <div class="cookie-consent-content">
        <div class="cookie-consent-header">
          <span class="cookie-icon">🍪</span>
          <h3>We Use Cookies</h3>
        </div>
        <div class="cookie-consent-body">
          <p>We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies.</p>
          <div class="cookie-consent-links">
            <a href="#" id="cookiePolicyLink">Cookie Policy</a>
            <a href="#" id="cookieSettingsLink">Settings</a>
          </div>
        </div>
        <div class="cookie-consent-actions">
          <button id="acceptAllCookies" class="btn-accept">Accept All</button>
          <button id="acceptNecessaryCookies" class="btn-necessary">Necessary Only</button>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #cookieConsentPopup {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        z-index: 10000;
        padding: 20px;
        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.5s ease-out;
      }
      @keyframes slideUp {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      .cookie-consent-content {
        max-width: 1200px;
        margin: 0 auto;
        background: white;
        border-radius: 15px;
        padding: 25px;
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      .cookie-consent-header {
        display: flex;
        align-items: center;
        gap: 15px;
      }
      .cookie-icon {
        font-size: 32px;
      }
      .cookie-consent-header h3 {
        color: #ff4d7e;
        margin: 0;
        font-size: 24px;
      }
      .cookie-consent-body {
        color: #333;
        line-height: 1.6;
      }
      .cookie-consent-body p {
        margin: 0 0 10px 0;
      }
      .cookie-consent-links {
        display: flex;
        gap: 20px;
        margin-top: 10px;
      }
      .cookie-consent-links a {
        color: #ff4d7e;
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
      }
      .cookie-consent-links a:hover {
        text-decoration: underline;
      }
      .cookie-consent-actions {
        display: flex;
        gap: 15px;
        justify-content: flex-end;
        margin-top: 10px;
      }
      .cookie-consent-actions button {
        padding: 12px 30px;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
      }
      .btn-accept {
        background: #ff4d7e;
        color: white;
      }
      .btn-accept:hover {
        background: #e04470;
        transform: translateY(-2px);
      }
      .btn-necessary {
        background: #f0f0f0;
        color: #333;
      }
      .btn-necessary:hover {
        background: #e0e0e0;
      }
      @media (max-width: 768px) {
        .cookie-consent-content {
          padding: 20px;
        }
        .cookie-consent-actions {
          flex-direction: column;
        }
        .cookie-consent-actions button {
          width: 100%;
        }
        .cookie-consent-header {
          flex-direction: column;
          text-align: center;
        }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(popup);
    this.popup = popup;

    // Add event listeners
    this.attachEvents();
  }

  attachEvents() {
    const acceptAll = document.getElementById('acceptAllCookies');
    const acceptNecessary = document.getElementById('acceptNecessaryCookies');
    const policyLink = document.getElementById('cookiePolicyLink');
    const settingsLink = document.getElementById('cookieSettingsLink');

    acceptAll.addEventListener('click', () => {
      CookieManager.accept();
      this.hidePopup();
      console.log('✅ All cookies accepted');
    });

    acceptNecessary.addEventListener('click', () => {
      CookieManager.set('cookieConsent', 'necessary', 365);
      CookieManager.set('cookieConsentDate', new Date().toISOString(), 365);
      this.hidePopup();
      console.log('✅ Necessary cookies only');
    });

    policyLink.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Cookie Policy: We use cookies to improve your experience. Essential cookies are required for the site to function. Analytics cookies help us understand how visitors interact with our website.');
    });

    settingsLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.showSettings();
    });
  }

  showPopup() {
    if (this.popup) {
      this.popup.style.display = 'block';
    }
  }

  hidePopup() {
    if (this.popup) {
      this.popup.style.animation = 'slideDown 0.5s ease-out';
      setTimeout(() => {
        if (this.popup) {
          this.popup.remove();
        }
      }, 500);
    }
  }

  showSettings() {
    const settings = prompt(
      'Cookie Settings:\n\n' +
      '1. Essential Cookies (Always Active)\n' +
      '   - Required for site functionality\n' +
      '   - Session management\n\n' +
      '2. Analytics Cookies\n' +
      '   - Help us understand site usage\n' +
      '   - Improve user experience\n\n' +
      'Type "accept" to accept all, or "necessary" for essential only:'
    );
    
    if (settings && settings.toLowerCase() === 'accept') {
      CookieManager.accept();
      this.hidePopup();
    } else if (settings && settings.toLowerCase() === 'necessary') {
      CookieManager.set('cookieConsent', 'necessary', 365);
      this.hidePopup();
    }
  }
}

// Initialize cookie consent on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CookieConsent();
  });
} else {
  new CookieConsent();
}

// Export for use in other files
window.CookieManager = CookieManager;
window.CookieConsent = CookieConsent;

