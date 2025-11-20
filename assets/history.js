// بيانات السجل - ممكن تعدلها
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


// مكان عرض السجل
const historyList = document.getElementById("historyList");


// عرض السجل باستخدام جافاسكربت
historyData.forEach((item, index) => {

    // إنشاء بلوك السجل
    const entry = document.createElement("div");
    entry.className = "card mb-3";

    entry.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text"><strong>Date Borrowed:</strong> ${item.dateBorrowed}</p>
            <p class="card-text"><strong>Status:</strong> ${item.status}</p>

            <button class="btn btn-primary btn-sm" id="btn-${index}">
                Show Details
            </button>

            <div class="details mt-3 d-none" id="details-${index}">
                <p><strong>Return Date:</strong> ${item.returnDate}</p>
                <p><strong>Fine:</strong> ${item.fine}</p>
            </div>
        </div>
    `;

    historyList.appendChild(entry);


    // زر إظهار التفاصيل
    const btn = document.getElementById(`btn-${index}`);
    const details = document.getElementById(`details-${index}`);

    btn.addEventListener("click", () => {
        details.classList.toggle("d-none");

        // تغيير النص
        if (details.classList.contains("d-none")) {
            btn.textContent = "Show Details";
        } else {
            btn.textContent = "Hide Details";
        }
    });

});
