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



window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", event => {
    const newColorScheme = event.matches ? "dark" : "light";
    changeTheme(newColorScheme);
});



window.onload = () => {
    const savedTheme = localStorage.getItem("theme");

    if (!savedTheme) {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            changeTheme("dark");
        } else {
            changeTheme("light");
        }
    } else {
        if (savedTheme === "dark" || savedTheme === "light") {
            changeTheme(savedTheme);
        } else {
            changeTheme("light");
        }
    }
}
