// back-handler.js
// Central Android / Capacitor Back Button Controller
// Works hand-in-hand with the in-page back buttons.

(function () {
    'use strict';

    // --------------------------------------------------
    // Shared goBack() that every page should call
    // --------------------------------------------------
    window.FlexiBack = {
        /**
         * Smart back navigation.
         * Prefer history.back() when possible.
         * Falls back to a safe home page.
         */
        goBack: function (fallbackUrl) {
            fallbackUrl = fallbackUrl || 'index.html';

            // If we have real history, use it
            if (window.history.length > 1) {
                window.history.back();
                return;
            }

            // No history → go home cleanly (replace so we don't create another entry)
            window.location.replace(fallbackUrl);
        },

        /**
         * Force exit the app (used on root pages)
         */
        exitApp: function () {
            if (window.Capacitor?.Plugins?.App) {
                window.Capacitor.Plugins.App.exitApp();
            } else {
                // Web fallback
                window.close();
            }
        }
    };


    // --------------------------------------------------
    // Capacitor hardware back button listener
    // --------------------------------------------------
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.Capacitor) return;

        try {
            const App = window.Capacitor.Plugins?.App;
            if (!App) {
                console.warn('Capacitor App plugin not available');
                return;
            }

            App.addListener('backButton', ({ canGoBack }) => {

                // 1. Special case: Login modal / iframe is open
                const loginModal = document.getElementById('loginModal');
                if (loginModal && !loginModal.classList.contains('hidden')) {
                    App.exitApp();
                    return;
                }

                // 2. If the page itself has a custom back handler, let it decide
                if (typeof window.onFlexiBackButton === 'function') {
                    const handled = window.onFlexiBackButton();
                    if (handled === true) return; // page handled it
                }

                // 3. Normal navigation
                if (canGoBack || window.history.length > 1) {
                    window.history.back();
                    return;
                }

                // 4. We are at the real root → close the app
                App.exitApp();
            });

            console.log('✅ Flexi Back handler ready');

        } catch (err) {
            console.warn('Back button handler failed:', err);
        }
    });

})();
