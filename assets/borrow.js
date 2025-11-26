// --- DATA SETUP ---
// Prefer the shared BOOK_DATA (populated by assets/book-data.js). If unavailable,
// fall back to a minimal local set.
const BOOK_DATA = (window && window.BOOK_DATA)


// --- STATE MANAGEMENT ---
let cart = [];
let books = [...BOOK_DATA]; // Create a mutable copy of the book data

// --- DOM ELEMENTS ---
const bookListContainer = document.getElementById('book-list-container');
const cartList = document.getElementById('cart-list');
const emptyCartMessage = document.getElementById('empty-cart-message');
const totalItemsCount = document.getElementById('total-items-count');
const checkoutButton = document.getElementById('checkout-button');
const searchInput = document.getElementById('borrow-search-input');
const genreSelect = document.getElementById('borrow-genre-select');
const messageBox = document.getElementById('message-box');

// --- UTILITY FUNCTIONS ---

/**
 * Renders the book list based on the current 'books' array and search filter.
 * @param {string} filterText - The text used to filter book titles/authors/ISBNs.
 */
function renderBookList(filterText = '') {
    // Check if the container element exists before proceeding
    if (!bookListContainer) return;

    bookListContainer.innerHTML = '';
    const normalizedFilter = filterText.toLowerCase().trim();

    const selectedGenre = (genreSelect && genreSelect.value) ? genreSelect.value.toLowerCase() : 'all';
    const filteredBooks = books.filter(book => {
        const searchString = `${book.title} ${book.author} ${book.isbn} ${book.genre}`.toLowerCase();
        const matchesText = searchString.includes(normalizedFilter);
        const matchesGenre = (selectedGenre === 'all') || (book.genre && book.genre.toLowerCase() === selectedGenre);
        return matchesText && matchesGenre;
    });

    if (filteredBooks.length === 0) {
         bookListContainer.innerHTML = '<p class="col-span-2 text-center text-lg text-gray-500 p-8">No books matched your search criteria.</p>';
         return;
    }

    filteredBooks.forEach(book => {
        const isBorrowed = !book.available || cart.some(item => item.id === book.id);

                const cardHtml = `
            <div id="book-${book.id}" class="book-card p-4 rounded-lg shadow-md ${isBorrowed ? 'bg-red-50 borrowed' : 'bg-white hover:shadow-lg'}" data-book-id="${book.id}">
                <h3 class="text-xl font-semibold text-gray-800">${book.title}</h3>
                <p class="text-sm text-gray-600 mt-1">Author: ${book.author}</p>
                <span class="inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${isBorrowed ? 'bg-red-200 text-red-800' : 'bg-indigo-100 text-indigo-800'}" data-genre="${(book.genre || '').toLowerCase()}">
                    ${book.genre}
                </span>
                <p class="text-xs text-gray-400 mt-1">ISBN: ${book.isbn}</p>
                <button class="borrow-button w-full mt-3 py-2 text-white font-medium rounded-md text-sm transition duration-150 ${isBorrowed ? 'bg-gray-500' : 'bg-indigo-600 hover:bg-indigo-700'}"
                        data-book-id="${book.id}" ${isBorrowed ? 'disabled' : ''}>
                    ${isBorrowed ? 'Unavailable' : 'Add to Cart'}
                </button>
            </div>
        `;
        bookListContainer.insertAdjacentHTML('beforeend', cardHtml);
    });
    attachBookCardListeners();
}

/**
 * Populate the borrow page genre select with unique genres from `books`.
 */
function populateBorrowGenres() {
    if (!genreSelect) return;
    const genres = Array.from(new Set(books.map(b => (b.genre || 'Unknown').toString().trim()))).filter(Boolean);
    const current = genreSelect.value || 'all';
    genreSelect.innerHTML = '<option value="all">All Genres</option>';
    genres.forEach(g => {
        const opt = document.createElement('option');
        opt.value = g.toLowerCase();
        opt.textContent = g;
        genreSelect.appendChild(opt);
    });
    genreSelect.value = current;
}

/**
 * Renders the current state of the borrowing cart.
 */
function renderCart() {
    // Check if the cart list element exists before proceeding
    if (!cartList) return;

    cartList.innerHTML = '';
    totalItemsCount.textContent = cart.length;

    if (cart.length === 0) {
        emptyCartMessage.classList.remove('hidden');
        checkoutButton.disabled = true;
    } else {
        emptyCartMessage.classList.add('hidden');
        checkoutButton.disabled = false;

        cart.forEach(book => {
            const cartItemHtml = `
                <div class="d-flex justify-content-between align-items-center p-3 bg-light rounded shadow-sm">
                    <span class="text-sm fw-medium text-dark text-truncate me-2">${book.title}</span>
                    <button class="remove-from-cart-button text-danger p-1 rounded-circle border-0 bg-transparent d-flex align-items-center justify-content-center"
                            data-book-id="${book.id}" title="Remove from cart" style="width: 32px; height: 32px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.backgroundColor='rgba(220, 38, 38, 0.1)'" onmouseout="this.style.backgroundColor='transparent'">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            `;
            cartList.insertAdjacentHTML('beforeend', cartItemHtml);
        });
    }
    // Re-render the book list to update button states (e.g., if a book is added/removed)
    renderBookList(searchInput.value);
}

/**
 * Shows a temporary status message to the user.
 * @param {string} message - The message content.
 * @param {string} type - 'success' or 'error'.
 */
function showMessage(message, type) {
    // Check if the message box element exists before proceeding
    if (!messageBox) return;

    messageBox.textContent = message;
    // Remove Bootstrap's d-none class and any existing alert type classes
    messageBox.classList.remove('d-none', 'alert-success', 'alert-danger', 'alert-info', 'alert-warning');

    // Add appropriate Bootstrap alert class based on type
    if (type === 'success') {
        messageBox.classList.add('alert-success');
    } else if (type === 'error') {
        messageBox.classList.add('alert-danger');
    } else {
        messageBox.classList.add('alert-info');
    }

    // Hide the message after 5 seconds
    setTimeout(() => {
        messageBox.classList.add('d-none');
    }, 5000);
}


// --- EVENT HANDLERS ---

/**
 * Adds click listeners to all "Add to Cart" buttons.
 */
function attachBookCardListeners() {
    document.querySelectorAll('.borrow-button:not([disabled])').forEach(button => {
        button.onclick = (e) => {
            const bookId = parseInt(e.target.dataset.bookId);
            const book = books.find(b => b.id === bookId);

            if (book && book.available) {
                cart.push(book);
                showMessage(`'${book.title}' added to cart!`, 'success');
                renderCart();
            } 
        };
    });
}

/**
 * Handles removal of an item from the cart.
 */
function handleRemoveFromCart(e) {
    const removeButton = e.target.closest('.remove-from-cart-button');
    if (removeButton) {
        const bookId = parseInt(removeButton.dataset.bookId);
        const index = cart.findIndex(book => book.id === bookId);
        
        if (index > -1) {
            const removedBookTitle = cart[index].title;
            cart.splice(index, 1);
            showMessage(`'${removedBookTitle}' removed from cart.`, 'error');
            renderCart();
        }
    }
}

/**
 * Handles the final checkout/borrowing process.
 */
function handleCheckout() {
    if (cart.length === 0) {
        showMessage('Your cart is empty. Please add books to borrow.', 'error');
        return;
    }
    
    // Require a signed-in user - if not logged in, show message 
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        showMessage('Please register or login before borrowing. Go to Register page.', 'error');
        // Explicitly return early - cart and books remain unchanged
        return;
    }

    // Only proceed with checkout if user is logged in
    // Simulate the borrowing transaction
    const borrowedTitles = cart.map(b => b.title).join(', ');
    const borrowedIds = cart.map(b => b.id);

    // 1. Update the main book data status (set available to false)
    cart.forEach(cartItem => {
        const bookIndex = books.findIndex(b => b.id === cartItem.id);
        if (bookIndex > -1) {
            books[bookIndex].available = false;
        }
    });

    // 2. Save to user's history in localStorage
    try {
        const key = `history_${currentUser}`;
        const raw = localStorage.getItem(key);
        const history = raw ? JSON.parse(raw) : [];
        history.push({
            date: new Date().toISOString(),
            titles: cart.map(b => b.title),
            ids: borrowedIds
        });
        localStorage.setItem(key, JSON.stringify(history));
    } catch (e) {
        console.error('Failed to save history', e);
    }

    // 3. Clear the cart
    cart = [];

    // 4. Update the UI
    renderCart();
    renderBookList(searchInput.value);

    // 5. Show success message
    const successMessage = `Success! You have borrowed: ${borrowedTitles}. Please return them by next month.`;
    showMessage(successMessage, 'success');
}

/**
 * Handles the live search functionality.
 */
function handleSearchInput(e) {
    renderBookList(e.target.value);
}

// --- INITIALIZATION ---

/**
 * Attaches all event listeners and performs initial setup.
 */
function initializeBorrowPage() {
    // Set the current year in the footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Attach event listeners
    if (cartList) {
        cartList.addEventListener('click', handleRemoveFromCart);
    }
    if (checkoutButton) {
        checkoutButton.onclick = handleCheckout;
    }
    if (searchInput) {
        searchInput.oninput = handleSearchInput;
    }
    // Populate genre dropdown and add change listener
    if (genreSelect) {
        populateBorrowGenres();
        genreSelect.onchange = () => renderBookList(searchInput ? searchInput.value : '');
    }

    // Initial render of the book list and cart
    renderCart();
    renderBookList();
}

// Ensure the page is fully loaded before running JS
window.onload = initializeBorrowPage;