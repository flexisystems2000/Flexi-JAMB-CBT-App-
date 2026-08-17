document.addEventListener("DOMContentLoaded", async () => {

    // Prefer IndexedDB, fall back to localStorage
    if (typeof IDB !== 'undefined') {
        await IDB.migrateFromLocalStorage();
    }

    let savedTheme = null;
    if (typeof IDB !== 'undefined') {
        savedTheme = await IDB.getItem("theme");
    }
    // Always also check localStorage as secondary source / mirror
    if (!savedTheme) {
        savedTheme = localStorage.getItem("theme");
    }

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }

    const toggleBtn = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    if (!toggleBtn || !themeIcon) return;

    const moonSVG = `
        <path d="M21 12.79A9 9 0 1 1 11.21 3
                 7 7 0 0 0 21 12.79z"/>
    `;

    const sunSVG = `
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    `;

    function updateThemeIcon() {
        themeIcon.innerHTML =
            document.body.classList.contains("dark")
                ? sunSVG
                : moonSVG;
    }

    updateThemeIcon();

    toggleBtn.addEventListener("click", async () => {

        document.body.classList.toggle("dark");

        const themeVal = document.body.classList.contains("dark")
            ? "dark"
            : "light";

        // Write to both stores so every page stays in sync
        if (typeof IDB !== 'undefined') {
            await IDB.setItem("theme", themeVal);
        }
        try {
            localStorage.setItem("theme", themeVal);
        } catch (e) {}

        updateThemeIcon();
    });

});
