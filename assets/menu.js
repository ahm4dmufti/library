fetch("includes/menu.html")
  .then(r => r.ok ? r.text() : Promise.reject("Menu not found"))
  .then(html => {
    document.getElementById("menu").innerHTML = html;
    const yEl = document.getElementById("year");
    if (yEl) yEl.textContent = new Date().getFullYear();
  })
  .catch(console.error);