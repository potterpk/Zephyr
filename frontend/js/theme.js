const btn = document.getElementById('theme-toggle')
const root = document.documentElement

let dark = true

btn.addEventListener('click', () => {
    dark = !dark
    root.setAttribute('data-theme', dark ? 'dark' : 'light')
    btn.textContent = dark ? '☀️' : '🌙'
})
