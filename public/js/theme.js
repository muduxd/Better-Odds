const changeTheme = (theme) => {
    if (theme == "dark") {
        localStorage.setItem("theme", "dark")
        document.body.className = "dark"
    }
    else {
        localStorage.setItem("theme", "light")
        document.body.className = ""
    }
}




document.getElementById("theme-toggle").addEventListener("click", () => {
    document.body.className === "dark" ? changeTheme("light") : changeTheme("dark")
})



window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", event => {
    const newColorScheme = event.matches ? "dark" : "light"

    newColorScheme === "dark" ? changeTheme("dark") : changeTheme("light")
})




window.onload = () => {
    const savedTheme = localStorage.getItem("theme")


    if (!savedTheme) {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            changeTheme("dark")
        } else {
            changeTheme("light")
        }
    } else {
        if (savedTheme !== "light" && savedTheme !== "dark") {
            changeTheme("light")
        }
        else {
            changeTheme(savedTheme)
        }
    }
}
