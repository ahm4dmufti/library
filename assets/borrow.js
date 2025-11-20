// --- DATA SETUP ---
const BOOK_DATA = [
    { id: 101, title: "The 48 Laws of Power", author: "Robert Greene", isbn: "978-0135957059", genre: "Self-Help", available: true },
    { id: 102, title: "Moby-Dick; or, The Whale", author: "Herman Melville", isbn: "978-0132350884", genre: "Fiction", available: true },
    { id: 103, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", isbn: "978-1593279509", genre: "Self-Help", available: true },
];

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

    const filteredBooks = books.filter(book => {
        const searchString = `${book.title} ${book.author} ${book.isbn} ${book.genre}`.toLowerCase();
        return searchString.includes(normalizedFilter);
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
                <span class="inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${isBorrowed ? 'bg-red-200 text-red-800' : 'bg-indigo-100 text-indigo-800'}">
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
                <div class="flex justify-between items-center p-3 bg-gray-100 rounded-lg shadow-sm">
                    <span class="text-sm font-medium text-gray-700 truncate">${book.title}</span>
                    <button class="remove-from-cart-button text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-gray-200 transition"
                            data-book-id="${book.id}" title="Remove from cart">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
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
    messageBox.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800');

    if (type === 'success') {
        messageBox.classList.add('bg-green-100', 'text-green-800');
    } else if (type === 'error') {
        messageBox.classList.add('bg-red-100', 'text-red-800');
    }

    setTimeout(() => {
        messageBox.classList.add('hidden');
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
            } else {
                showMessage("Error: Book is unavailable or already in cart.", 'error');
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
    // Require a signed-in user
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        showMessage('Please register or login before borrowing. Go to Register page.', 'error');
        return;
    }

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

    // Initial render of the book list and cart
    renderCart();
    renderBookList();
}

// Ensure the page is fully loaded before running JS
window.onload = initializeBorrowPage;