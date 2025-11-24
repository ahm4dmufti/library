fetch("includes/footer.html")
  .then(r => r.ok ? r.text() : Promise.reject("Footer not found"))
  .then(html => {
    document.getElementById("footer").innerHTML = html;
    const yEl = document.getElementById("year");
    if (yEl) yEl.textContent = new Date().getFullYear();
  })
  .catch(console.error);