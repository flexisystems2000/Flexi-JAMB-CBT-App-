// back-handler.js
// Central Android / Capacitor Back Button Controller
// ============================================================
// RULES:
// 1. index.html = Home screen → Android Back exits the app.
// 2. Login iframe does NOT change Home screen Back behaviour.
// 3. Other pages → Android Back uses browser/WebView history.
// 4. Pages can register special Back behaviour when necessary.
// 5. There must be only ONE Capacitor backButton listener.
// ============================================================

(function () {
    'use strict';

    // Prevent duplicate initialization
    if (window.__FlexiBackInitialized) {
        console.log('FlexiBack: Already initialized.');
        return;
    }

    window.__FlexiBackInitialized = true;


    // ============================================================
    // FLEXI BACK CONTROLLER
    // ============================================================

    window.FlexiBack = {

        // Optional page-specific handler
        _handler: null,


        // ========================================================
        // REGISTER PAGE-SPECIFIC BACK HANDLER
        // ========================================================

        setHandler: function (handler) {

            if (typeof handler === 'function') {
                this._handler = handler;
            } else {
                this._handler = null;
            }

        },


        // ========================================================
        // CLEAR PAGE-SPECIFIC BACK HANDLER
        // ========================================================

        clearHandler: function () {
            this._handler = null;
        },


        // ========================================================
        // CHECK HOME PAGE
        // ========================================================

        isHomePage: function () {

            const path = window.location.pathname
                .split('/')
                .pop()
                .toLowerCase();

            return (
                path === '' ||
                path === 'index.html'
            );
        },


        // ========================================================
        // EXIT APPLICATION
        // ========================================================

        exitApp: function () {

            try {

                const App =
                    window.Capacitor?.Plugins?.App;

                if (
                    App &&
                    typeof App.exitApp === 'function'
                ) {

                    App.exitApp();
                    return true;
                }

            } catch (error) {

                console.warn(
                    'FlexiBack: Capacitor exit failed:',
                    error
                );

            }


            // Browser fallback
            try {

                window.close();

            } catch (error) {

                console.warn(
                    'FlexiBack: Browser close failed:',
                    error
                );

            }

            return true;
        },


        // ========================================================
        // GO TO A SPECIFIC PAGE
        // ========================================================

        goTo: function (url) {

            if (!url) {
                return false;
            }

            window.location.href = url;

            return true;
        },


        // ========================================================
        // NORMAL BACK
        // ========================================================

        goBack: function (fallbackUrl) {

            fallbackUrl = fallbackUrl || 'index.html';


            // First allow the page to handle Back itself.
            if (typeof this._handler === 'function') {

                try {

                    const handled = this._handler();

                    if (handled === true) {
                        return true;
                    }

                } catch (error) {

                    console.warn(
                        'FlexiBack: Page handler failed:',
                        error
                    );

                }

            }


            // Normal browser / WebView history
            if (window.history.length > 1) {

                window.history.back();

                return true;
            }


            // No history available
            if (fallbackUrl) {

                window.location.replace(
                    fallbackUrl
                );

                return true;
            }


            return false;
        },


        // ========================================================
        // HANDLE ANDROID HARDWARE BACK
        // ========================================================

        handleAndroidBack: function () {

            // ----------------------------------------------------
            // HOME SCREEN
            // ----------------------------------------------------
            //
            // IMPORTANT:
            //
            // Whether the login iframe is OPEN or CLOSED,
            // index.html is still the HOME SCREEN.
            //
            // Therefore:
            //
            // Android Back → EXIT APP
            //
            // We deliberately DO NOT inspect the iframe here.
            // ----------------------------------------------------

            if (this.isHomePage()) {

                console.log(
                    'FlexiBack: Home screen → exiting app.'
                );

                this.exitApp();

                return true;
            }


            // ----------------------------------------------------
            // OTHER PAGES
            // ----------------------------------------------------
            //
            // Give the page an opportunity to handle Back
            // before using normal history.
            // ----------------------------------------------------

            if (typeof this._handler === 'function') {

                try {

                    const handled =
                        this._handler();

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


            // ----------------------------------------------------
            // NORMAL HISTORY
            // ----------------------------------------------------

            if (window.history.length > 1) {

                console.log(
                    'FlexiBack: Going back through history.'
                );

                window.history.back();

                return true;
            }


            // ----------------------------------------------------
            // NO HISTORY
            // ----------------------------------------------------
            //
            // If a page was opened directly and has no history,
            // return to Home rather than doing nothing.
            // ----------------------------------------------------

            console.log(
                'FlexiBack: No history → returning to home.'
            );

            window.location.replace('index.html');

            return true;
        }
    };


    // ============================================================
    // CAPACITOR BACK BUTTON
    // ============================================================

    function initializeCapacitorBackButton() {

        if (!window.Capacitor) {

            console.log(
                'FlexiBack: Capacitor not detected.'
            );

            return;
        }


        try {

            const App =
                window.Capacitor?.Plugins?.App;


            if (
                !App ||
                typeof App.addListener !== 'function'
            ) {

                console.warn(
                    'FlexiBack: Capacitor App plugin unavailable.'
                );

                return;
            }


            // ----------------------------------------------------
            // SINGLE ANDROID BACK LISTENER
            // ----------------------------------------------------

            App.addListener(
                'backButton',
                function () {

                    console.log(
                        'FlexiBack: Android Back pressed.'
                    );

                    window.FlexiBack
                        .handleAndroidBack();

                }
            );


            console.log(
                '✅ FlexiBack: Android Back listener initialized.'
            );


        } catch (error) {

            console.error(
                'FlexiBack: Failed to initialize Android Back:',
                error
            );

        }
    }


    // ============================================================
    // INITIALIZATION
    // ============================================================

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
