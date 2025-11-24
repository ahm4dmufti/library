/* Shared book data for catalog and borrow pages
   Exposes `window.BOOK_DATA` as an array of book objects with fields:
   { id, title, author, isbn, genre, available }
*/
(function () {
    window.BOOK_DATA = [
        { id: 101, title: "The 48 Laws of Power", author: "Robert Greene", isbn: "978-0140280197", genre: "Personal Development", available: true },
        { id: 102, title: "Moby-Dick; or, The Whale", author: "Herman Melville", isbn: "978-1503280786", genre: "Classic", available: true },
        { id: 103, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", isbn: "978-1612680194", genre: "Finance", available: true },
        { id: 104, title: "Harry Potter and the Chamber of Secrets", author: "J.K. Rowling", isbn: "978-0439064873", genre: "Fantasy", available: true },
        { id: 105, title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "978-0061120084", genre: "Classic", available: true },
        { id: 106, title: "1984", author: "George Orwell", isbn: "978-0451524935", genre: "Dystopian", available: true },
        { id: 107, title: "Pride and Prejudice", author: "Jane Austen", isbn: "978-1503290563", genre: "Romance", available: true },
        { id: 108, title: "The Hobbit", author: "J.R.R. Tolkien", isbn: "978-0547928227", genre: "Fantasy", available: true },
        { id: 109, title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", isbn: "978-0062316097", genre: "History", available: true },
        { id: 110, title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "978-0743273565", genre: "Classic", available: true },
        { id: 111, title: "The Catcher in the Rye", author: "J.D. Salinger", isbn: "978-0316769488", genre: "Classic", available: true },
        { id: 112, title: "The Alchemist", author: "Paulo Coelho", isbn: "978-0061122415", genre: "Fiction", available: true }
    ];
})();
