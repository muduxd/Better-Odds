const changeTheme = (theme) => {
    if (theme === "dark") {
        localStorage.setItem("theme", "dark");
        document.documentElement.classList.add("dark");
    } else {
        localStorage.setItem("theme", "light");
        document.documentElement.classList.remove("dark");
    }
}

const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    changeTheme(isDark ? "light" : "dark");
});

// Listen for system theme changes
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", event => {
    const newColorScheme = event.matches ? "dark" : "light";
    changeTheme(newColorScheme);
});

// Initial theme setup (this won't cause a flash because we have the early check in HTML)
window.onload = () => {
    const savedTheme = localStorage.getItem("theme");

    if (!savedTheme) {
        // No saved preference, use system preference
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            changeTheme("dark");
        } else {
            changeTheme("light");
        }
    } else {
        // Use saved preference
        if (savedTheme === "dark" || savedTheme === "light") {
            changeTheme(savedTheme);
        } else {
            changeTheme("light"); // fallback
        }
    }
}
