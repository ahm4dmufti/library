document.addEventListener('DOMContentLoaded', () => {

    // Data Rendering: JS array of books (kept in sync with featured books on index)
    const bookData = [
        { title: "The 48 Laws of Power", author: "Robert Greene", genre: "Personal Development" },
        { title: "Moby-Dick; or, The Whale", author: "Herman Melville", genre: "Classic" },
        { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", genre: "Finance" }
    ];

    const catalogContainer = document.getElementById('bookCatalog');
    const searchInput = document.getElementById('searchInput');

    /**
     * Returns an image filename for a known book title.
     * Falls back to `default.jpg` if no match.
     */
    function getImageFileName(title) {
        const key = title.toLowerCase();
        if (key.includes('48')) return '48lawsofpower.jpg';
        if (key.includes('moby')) return 'moby-dick.jpg';
        if (key.includes('rich')) return 'richdadpoordad.jpg';
        return 'default.svg';
    }

    /**
     * Renders the Bootstrap cards for each book in the array.
     */
    function renderBookCards() {
        catalogContainer.innerHTML = ''; // Clear existing content
        bookData.forEach(book => {
            // Create the card structure using template literals
            // IMPORTANT: We store the title in a data attribute for easy searching later
            const cardHTML = `
                <div class="col book-card" data-title="${book.title.toLowerCase()}">
                    <div class="card h-100 shadow-sm border-0">
                        <div class="card-body d-flex flex-column align-items-center">
                            <img src="assets/images/${getImageFileName(book.title)}" alt="${book.title} cover" style="width:120px; height:170px; object-fit:cover; border-radius:4px;" class="mb-2">
                            <h5 class="card-title text-primary text-center small">${book.title}</h5>
                            <h6 class="card-subtitle mb-2 text-muted small text-center">By: ${book.author}</h6>
                            <span class="badge bg-secondary small">${book.genre}</span>
                        </div>
                    </div>
                </div>
            `;
            catalogContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
        // Add the same hover bob interaction used on the index page
        setupHoverBob();
    }

    /**
     * Adds a subtle bob/tilt effect to each card on mouse movement.
     * Uses requestAnimationFrame for smooth updates and resets on mouseleave.
     */
    function setupHoverBob() {
        const cards = document.querySelectorAll('.card');

        cards.forEach(card => {
            card.style.transition = 'transform 180ms ease-out';
            let rafId = null;

            const onMove = (e) => {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const relY = (e.clientY - rect.top) / rect.height; // 0..1
                    const relX = (e.clientX - rect.left) / rect.width;  // 0..1

                    // Tilt based on pointer position, and a small upward bob
                    const rotateX = (relY - 0.5) * 6;    // +/-6deg
                    const rotateY = (relX - 0.5) * -6;   // +/-6deg
                    const bob = -6 * (1 - Math.abs(relY - 0.5) * 2); // up to -6px

                    card.style.transform = `perspective(600px) translateY(${bob}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                });
            };

            const onLeave = () => {
                if (rafId) cancelAnimationFrame(rafId);
                card.style.transition = 'transform 300ms cubic-bezier(.2,.8,.2,1)';
                card.style.transform = 'none';
                setTimeout(() => {
                    card.style.transition = 'transform 180ms ease-out';
                }, 300);
            };

            card.addEventListener('mousemove', onMove);
            card.addEventListener('mouseleave', onLeave);
        });
    }

    /**
     * Interactivity: Handles the live search functionality.
     * Toggles card visibility based on the search input.
     */
    function handleLiveSearch() {
        // Get the search term and convert to lowercase for case-insensitive matching
        const searchTerm = searchInput.value.toLowerCase();
        
        // Get all the card elements that were just rendered
        const cards = document.querySelectorAll('.book-card');

        // Loop through all cards to check for a title match
        cards.forEach(card => {
            // Get the stored title from the data attribute (which is already lowercase)
            const cardTitle = card.getAttribute('data-title');
            
            // Toggle card visibility based on match using includes()
            // If the card's title includes the search term, show it.
            if (cardTitle.includes(searchTerm)) {
                card.style.display = 'block'; // Show the column container
            } else {
                card.style.display = 'none'; // Hide the column container
            }
        });
    }

    // 1. Initial Render: Display all books when the page loads
    renderBookCards();

    // 2. Add live search using keyup event listener
    // Every time a key is released in the input field, the search function runs
    searchInput.addEventListener('keyup', handleLiveSearch);

});