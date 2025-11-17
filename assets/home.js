function initHome() {
    // 1. Data Rendering: JavaScript array of featured books
    const featuredBooks = [
        {
            title: "The 48 Laws of Power",
            author: "Robert Greene",
            image: "assets/images/48lawsofpower.jpg",
            description: "with practical laws for gaining and defending power. A guide to understanding power dynamics, illustrated with historical examples and practical laws for gaining, defending, and exercising power.",
            shortDescription: "A guide to understanding power dynamics "
        },
        {
            title: "Moby-Dick; or, The Whale",
            author: "Herman Melville",
            image: "assets/images/moby-dick.jpg",
            description: ", who is obsessed with hunting the great white whale Moby Dick — a classic tale of obsession and the sea.",
            shortDescription: "Ishmael joins the whaling ship Pequod under Captain Ahab"
        },
        {
            title: "Rich Dad Poor Dad",
            author: "Robert Kiyosaki",
            image: "assets/images/richdadpoordad.jpg",
            description: "Personal-finance book contrasting two approaches to money and investing — one from the author's biological father (the 'poor dad') and one from his friend's father (the 'rich dad').",
            shortDescription: "Contrasts two approaches to money and investing from the author's two fathers."
        }
    ];

    const booksContainer = document.getElementById('featured-books');

    /**
     * Renders the Bootstrap cards for each book in the array.
     */
    function renderBookCards() {
        featuredBooks.forEach((book, index) => {
            // Create the card structure using template literals
            const cardHTML = `
                <div class="col">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body d-flex flex-column align-items-center">
                            <img src="${book.image || 'assets/images/default.jpg'}" alt="${book.title} cover" style="width:140px; height:200px; object-fit:cover; border-radius:4px;" class="mb-2">
                            <h5 class="card-title text-center">${book.title}</h5>
                            <h6 class="card-subtitle mb-2 text-muted small text-center">${book.author}</h6>
                            
                            <p class="card-text small text-center">
                                ${book.shortDescription}
                                <span class="collapse" id="desc-${index}">
                                    ${book.description.substring(book.shortDescription.length)}
                                </span>
                            </p>
                            
                            <button 
                                class="btn btn-sm btn-outline-primary mt-auto read-more-toggle" 
                                type="button" 
                                data-bs-toggle="collapse" 
                                data-bs-target="#desc-${index}" 
                                aria-expanded="false" 
                                aria-controls="desc-${index}"
                                data-toggle-index="${index}"
                            >
                                Read More
                            </button>
                        </div>
                    </div>
                </div>
            `;
            // Dynamically insert the card into the container
            booksContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
        
        // 2. Interactivity: Set up event listeners for the toggle buttons
        setupToggleListeners();
        // 3. Add a subtle 'bob' interaction when the user moves the mouse over a card
        setupHoverBob();
        // 4. Keep button labels in sync with Bootstrap collapse events (handles programmatic toggles)
        setupCollapseSync();
    }

    /**
     * Adds event listeners to all 'Read More' buttons to toggle visibility and update label.
     */
    function setupToggleListeners() {
        const toggleButtons = document.querySelectorAll('.read-more-toggle');

        // Use addEventListener to toggle visibility
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Get the target element's ID from the data-bs-target attribute (e.g., #desc-0)
                const targetId = button.getAttribute('data-bs-target');
                const targetElement = document.querySelector(targetId);

                // Check if the element has the 'show' class (meaning it is currently visible)
                const isExpanded = targetElement.classList.contains('show');

                // Update button label using textContent
                if (isExpanded) {
                    // It is visible, so the button should now say "Read More"
                    button.textContent = 'Read More';
                } else {
                    // It is NOT visible, so the button should now say "Read Less"
                    button.textContent = 'Read Less';
                }
                
                // NOTE: The actual visibility toggle is handled by Bootstrap's collapse.js 
                // which is linked in index.html, but this handles the label update.
            });
        });
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
     * Keeps each button label in sync with its collapse element.
     * Uses Bootstrap's custom events `shown.bs.collapse` and `hidden.bs.collapse`.
     */
    function setupCollapseSync() {
        const collapses = document.querySelectorAll('.collapse');

        collapses.forEach(col => {
            if (!col.id) return;
            const btn = document.querySelector(`[data-bs-target="#${col.id}"]`);
            if (!btn) return;

            col.addEventListener('shown.bs.collapse', () => {
                btn.textContent = 'Read Less';
            });

            col.addEventListener('hidden.bs.collapse', () => {
                btn.textContent = 'Read More';
            });
        });
    }

    // Initialize the rendering of the book cards
    renderBookCards();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHome);
} else {
    initHome();
}