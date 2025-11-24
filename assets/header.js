fetch("includes/header.html")
  .then(r => r.ok ? r.text() : Promise.reject("Header not found"))
  .then(html => {
    document.getElementById("header").innerHTML = html;
    const yEl = document.getElementById("year");
    if (yEl) yEl.textContent = new Date().getFullYear();
  })
  .catch(console.error);