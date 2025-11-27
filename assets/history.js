document.addEventListener('DOMContentLoaded', () => {
  const state = document.getElementById('history-state');
  const list = document.getElementById('history-list'); 
  const user = localStorage.getItem('currentUser');

  if (!user) {
    state.innerHTML = '<div class="alert alert-warning">\
    You are not signed in. Please <a href="register.html">login or register</a>.</div>';
    return;
  }

  state.innerHTML = `<div class="alert alert-success">\
  Signed in as <strong>${user}</strong></div>`;

  // مفتاح الـ history في localStorage
  const key = `history_${user}`;
  let history = [];
  try { history = JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { history = []; }

  // بيانات تجريبية احتياطية إذا ما لقينا سجلات في localStorage
  const historyData = [
    {
      title: "JavaScript Basics",
      dateBorrowed: "2025-01-15",
      status: "Returned",
      returnDate: "2025-01-20",
      fine: "0 LYD"
    },
    {
      title: "HTML & CSS Guide",
      dateBorrowed: "2025-01-10",
      status: "Late",
      returnDate: "2025-01-18",
      fine: "5 LYD"
    },
    {
      title: "Python for Beginners",
      dateBorrowed: "2025-01-05",
      status: "Returned",
      returnDate: "2025-01-12",
      fine: "0 LYD"
    }
  ];

  // إذا ما في history من localStorage، استعمل historyData
  if (!history.length) {
    // هنا بنحوّل historyData لشكل أبسط لو أحببت
    history = historyData.map(item => ({
      date: item.dateBorrowed,
      titles: [item.title],
      status: item.status,
      returnDate: item.returnDate,
      fine: item.fine
    }));
  } else {
    // لو history جاي من localStorage تأكد من البنية (مثلاً: {date:..., titles:[...]})
    // يمكن تحتاج تعديل بحسب البنية الفعلية عندك
  }

  if (!history.length) {
    list.innerHTML = '<p class="text-muted">No borrowing records yet.</p>';
    return;
  }

  // نمط العرض: نستخدم عناصر DOM ونتجنّب innerHTML الثقيلة للإنترأكشن
  list.innerHTML = ''; // نظف المكان
  history.forEach((entryData, index) => {
    const card = document.createElement('div');
    card.className = 'card mb-3';

    // تهيئة قيم عرض آمنة
    const dateStr = entryData.date ? new Date(entryData.date).toLocaleString() : 'Unknown date';
    const title = (entryData.titles && entryData.titles.length) ? entryData.titles.join(', ') : (entryData.title || 'Unknown title');

    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">Borrowed on ${dateStr}</h5>
        <p class="card-text"><strong>Titles:</strong> ${title}</p>
        <p class="card-text"><strong>Status:</strong> ${entryData.status || '—'}</p>
        <button type="button" class="btn btn-sm btn-secondary" data-index="${index}">Show Details</button>

        <div class="mt-3 details d-none" data-index="${index}">
            <p class="mb-1"><strong>Return Date:</strong> ${entryData.returnDate || '—'}</p>
            <p class="mb-0"><strong>Fine:</strong> ${entryData.fine || '—'}</p>
        </div>
      </div>
    `;

    list.appendChild(card);

    // اربط الزر بالـ details داخل نفس البطاقة
    const btn = card.querySelector('button[data-index]');
    const details = card.querySelector('.details');

    btn.addEventListener('click', () => {
      details.classList.toggle('d-none');
      btn.textContent = details.classList.contains('d-none') ? 'Show Details' : 'Hide Details';
    });
  });
});
