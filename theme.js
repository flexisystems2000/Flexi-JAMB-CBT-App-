// theme.js

document.addEventListener("DOMContentLoaded", async () => {

    // ==========================================
    // PREFER INDEXEDDB, FALL BACK TO LOCALSTORAGE
    // ==========================================

    if (typeof IDB !== "undefined") {
        try {
            await IDB.migrateFromLocalStorage();
        } catch (err) {
            console.warn("IndexedDB migration failed:", err);
        }
    }

    let savedTheme = null;

    if (typeof IDB !== "undefined") {
        try {
            savedTheme = await IDB.getItem("theme");
        } catch (err) {
            console.warn("Could not read theme from IndexedDB:", err);
        }
    }

    if (!savedTheme) {
        try {
            savedTheme = localStorage.getItem("theme");
        } catch (err) {
            console.warn("Could not read theme from localStorage:", err);
        }
    }


    // ==========================================
    // APPLY SAVED THEME
    // ==========================================

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }


    // ==========================================
    // APPLY STATUS BAR ON LOAD
    // ==========================================

    await applyStatusBar();


    // ==========================================
    // THEME TOGGLE
    // ==========================================

    const toggleBtn = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    if (!toggleBtn || !themeIcon) {
        return;
    }


    // ==========================================
    // THEME ICONS
    // ==========================================

    const moonSVG = `
        <path d="M21 12.79A9 9 0 1 1 11.21 3
                 7 7 0 0 0 21 12.79z"/>
    `;

    const sunSVG = `
        <circle cx="12" cy="12" r="5"></circle>

        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>

        <line x1="4.22" y1="4.22"
              x2="5.64" y2="5.64"></line>

        <line x1="18.36" y1="18.36"
              x2="19.78" y2="19.78"></line>

        <line x1="1" y1="12"
              x2="3" y2="12"></line>

        <line x1="21" y1="12"
              x2="23" y2="12"></line>

        <line x1="4.22" y1="19.78"
              x2="5.64" y2="18.36"></line>

        <line x1="18.36" y1="5.64"
              x2="19.78" y2="4.22"></line>
    `;


    // ==========================================
    // UPDATE THEME ICON
    // ==========================================

    function updateThemeIcon() {

        themeIcon.innerHTML =
            document.body.classList.contains("dark")
                ? sunSVG
                : moonSVG;
    }


    updateThemeIcon();


    // ==========================================
    // THEME TOGGLE EVENT
    // ==========================================

    toggleBtn.addEventListener("click", async () => {

        document.body.classList.toggle("dark");

        const themeVal =
            document.body.classList.contains("dark")
                ? "dark"
                : "light";


        // Save to IndexedDB
        if (typeof IDB !== "undefined") {

            try {
                await IDB.setItem("theme", themeVal);
            } catch (err) {
                console.warn(
                    "Could not save theme to IndexedDB:",
                    err
                );
            }
        }


        // Save to localStorage as fallback
        try {
            localStorage.setItem("theme", themeVal);
        } catch (err) {
            console.warn(
                "Could not save theme to localStorage:",
                err
            );
        }


        // Update icon
        updateThemeIcon();


        // Update native Android status bar
        await applyStatusBar();
    });

});


// =====================================================
// STATUS BAR CONTROL
// =====================================================

async function applyStatusBar() {

    // Only run inside Capacitor
    if (
        !window.Capacitor ||
        !window.Capacitor.isNativePlatform()
    ) {
        return;
    }


    try {

        // Use the already-loaded Capacitor plugin.
        // Do NOT dynamically import @capacitor/status-bar.
        const StatusBar =
            window.Capacitor?.Plugins?.StatusBar;


        if (!StatusBar) {

            console.warn(
                "Capacitor StatusBar plugin not available."
            );

            return;
        }


        const isDark =
            document.body.classList.contains("dark");


        // =================================================
        // DARK THEME
        // =================================================
        //
        // Background: dark
        // Icons/text: light
        //

        if (isDark) {

            await StatusBar.setBackgroundColor({
                color: "#121212"
            });

            await StatusBar.setStyle({
                style: "LIGHT"
            });

        }


        // =================================================
        // LIGHT THEME
        // =================================================
        //
        // Background: light
        // Icons/text: dark
        //

        else {

            await StatusBar.setBackgroundColor({
                color: "#f0f2f5"
            });

            await StatusBar.setStyle({
                style: "DARK"
            });
        }


        console.log(
            `✅ Status bar updated: ${isDark ? "dark" : "light"} theme`
        );


    } catch (err) {

        console.warn(
            "StatusBar update failed:",
            err
        );
    }
}
