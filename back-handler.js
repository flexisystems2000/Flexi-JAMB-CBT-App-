// back-handler.js
//
// Central Android Back Button Controller
// index.html is the parent/home page.
// login.html is loaded inside an iframe.

document.addEventListener('DOMContentLoaded', () => {
    // Only run inside Capacitor
    if (!window.Capacitor) return;

    try {
        const App = window.Capacitor?.Plugins?.App;

        if (!App) {
            console.warn('Capacitor App plugin not available.');
            return;
        }

        App.addListener('backButton', ({ canGoBack }) => {

            // --------------------------------------------------
            // LOGIN MODAL / IFRAME
            // --------------------------------------------------
            // If login.html is currently displayed inside the
            // iframe, pressing Android Back should CLOSE THE APP.
            const loginModal = document.getElementById('loginModal');

            if (loginModal && !loginModal.classList.contains('hidden')) {
                App.exitApp();
                return;
            }

            // --------------------------------------------------
            // NORMAL APP NAVIGATION
            // --------------------------------------------------
            // If another page exists in the browser history,
            // navigate back normally.
            if (canGoBack) {
                window.history.back();
                return;
            }

            // --------------------------------------------------
            // HOME SCREEN
            // --------------------------------------------------
            // No history means we are at the root/home screen.
            // Android Back should close the app.
            App.exitApp();
        });

        console.log('✅ Android Back button handler initialized');

    } catch (err) {
        console.warn('Back button handler failed:', err);
    }
});
