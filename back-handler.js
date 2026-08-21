// back-handler.js
// Central Android / Capacitor Back Button Controller
// The HTML back buttons and Android hardware back button
// use the same navigation system.

(function () {
    'use strict';

    // Prevent this script from being initialized more than once
    if (window.__FlexiBackInitialized) return;
    window.__FlexiBackInitialized = true;


    // =========================================================
    // FLEXI BACK CONTROLLER
    // =========================================================

    window.FlexiBack = {

        // Page-specific back handler
        _handler: null,

        // Register a page-specific back action
        setHandler: function (handler) {
            if (typeof handler === 'function') {
                this._handler = handler;
            } else {
                this._handler = null;
            }
        },

        // Remove the current page-specific handler
        clearHandler: function () {
            this._handler = null;
        },


        // =====================================================
        // EXIT APP
        // =====================================================

        exitApp: function () {
            try {
                const App = window.Capacitor?.Plugins?.App;

                if (App && typeof App.exitApp === 'function') {
                    App.exitApp();
                    return true;
                }
            } catch (error) {
                console.warn('FlexiBack: Unable to exit app:', error);
            }

            // Browser fallback
            try {
                window.close();
            } catch (error) {
                console.warn('FlexiBack: Browser close failed:', error);
            }

            return true;
        },


        // =====================================================
        // NORMAL PAGE BACK
        // =====================================================

        goBack: function (fallbackUrl) {

            fallbackUrl = fallbackUrl || 'index.html';

            // If the current page has registered its own
            // back behaviour, use it first.
            if (typeof this._handler === 'function') {
                try {
                    const handled = this._handler();

                    // Returning true means the page handled Back.
                    if (handled === true) {
                        return true;
                    }
                } catch (error) {
                    console.warn(
                        'FlexiBack: Page back handler failed:',
                        error
                    );
                }
            }

            // Normal browser/WebView history
            if (window.history.length > 1) {
                window.history.back();
                return true;
            }

            // No previous page → go to fallback
            if (fallbackUrl) {
                window.location.replace(fallbackUrl);
                return true;
            }

            return false;
        },


        // =====================================================
        // HANDLE ANDROID BACK BUTTON
        // =====================================================

        handleAndroidBack: function () {

            /*
             * IMPORTANT:
             *
             * index.html is the HOME SCREEN.
             *
             * Whether the login iframe is open or closed,
             * Android Back must EXIT the app.
             */

            const currentPage =
                window.location.pathname
                    .split('/')
                    .pop()
                    .toLowerCase();

            const isHomePage =
                currentPage === '' ||
                currentPage === 'index.html';


            // -------------------------------------------------
            // HOME SCREEN
            // -------------------------------------------------

            if (isHomePage) {
                this.exitApp();
                return true;
            }


            // -------------------------------------------------
            // OTHER PAGES
            // -------------------------------------------------

            // Give the current page its registered back action.
            if (typeof this._handler === 'function') {
                try {
                    const handled = this._handler();

                    if (handled === true) {
                        return true;
                    }
                } catch (error) {
                    console.warn(
                        'FlexiBack: Android page handler failed:',
                        error
                    );
                }
            }


            // -------------------------------------------------
            // NORMAL WEBVIEW HISTORY
            // -------------------------------------------------

            if (window.history.length > 1) {
                window.history.back();
                return true;
            }


            // -------------------------------------------------
            // NO HISTORY
            // -------------------------------------------------

            this.exitApp();
            return true;
        }
    };


    // =========================================================
    // CAPACITOR ANDROID BACK BUTTON
    // =========================================================

    function initializeCapacitorBackButton() {

        if (!window.Capacitor) {
            console.log(
                'FlexiBack: Capacitor not detected. Web mode enabled.'
            );
            return;
        }

        try {

            const App = window.Capacitor?.Plugins?.App;

            if (!App || typeof App.addListener !== 'function') {
                console.warn(
                    'FlexiBack: Capacitor App plugin not available.'
                );
                return;
            }

            App.addListener('backButton', function () {

                // Everything goes through the same controller
                // used by the HTML buttons.
                window.FlexiBack.handleAndroidBack();

            });

            console.log(
                '✅ FlexiBack: Capacitor Android Back handler ready'
            );

        } catch (error) {

            console.warn(
                'FlexiBack: Capacitor back handler failed:',
                error
            );

        }
    }


    // =========================================================
    // INITIALIZE
    // =========================================================

    if (document.readyState === 'loading') {

        document.addEventListener(
            'DOMContentLoaded',
            initializeCapacitorBackButton,
            { once: true }
        );

    } else {

        initializeCapacitorBackButton();

    }

})();
