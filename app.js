// Book constructor
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}
// UI constructor
function UI() {}

// Add book to the list
UI.prototype.addBookToList = function (book) {
  const list = document.querySelector('#book-list');
  // Create tr element
  const row = document.createElement('tr');
  //  Insert cols
  row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
  `;

  list.appendChild(row);
  console.log(row);
};
// Clear fields
UI.prototype.clearFields = function (book) {
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('isbn').value = '';
};
// Show alert
UI.prototype.showAlert = function (message, className) {
  // Create div
  const div = document.createElement('div');
  // Add classes
  div.className = `alert ${className}`;
  // Create text node and append the div
  div.appendChild(document.createTextNode(message));
  console.log(message);
  // Get parent
  const container = document.querySelector('.container');
  const form = document.querySelector('#book-form');
  // Insert alert
  container.insertBefore(div, form);
  // Timeout after 3 seconds
  setTimeout(function () {
    document.querySelector('.alert').remove();
  }, 3000);
};
// Delete Book
UI.prototype.deleteBook = function (target) {
  if (target.className === 'delete') {
    target.parentElement.parentElement.remove();
  }
};
// Local storage constructor
function LocalStorage() {}
// Get books from the Ls
LocalStorage.getBooks = function () {
  let books;
  if (localStorage.getItem('books') === null) {
    books = [];
  } else {
    books = JSON.parse(localStorage.getItem('books'));
  }
  return books;
};
// Display books
LocalStorage.displayBooks = function () {
  // Get books from LS
  const books = LocalStorage.getBooks();
  books.forEach((book) => {
    // Instantiate the ui
    const ui = new UI();
    ui.addBookToList(book);
  });
};

// Add Books
LocalStorage.addBooks = function (book) {
  const books = LocalStorage.getBooks();

  books.push(book);
  localStorage.setItem('books', JSON.stringify(books));
};

// Remove Books
LocalStorage.removeBook = function (isbn) {
  const books = LocalStorage.getBooks();

  books.forEach((book, index) => {
    if (book.isbn === isbn) {
      books.splice(index, 1);
    }
  });
  localStorage.setItem('books', JSON.stringify(books));
};
// Load event
document.addEventListener('DOMContentLoaded', LocalStorage.displayBooks());

// Event Listeners
// Event listener for adding books
document.getElementById('book-form').addEventListener('submit', function (e) {
  // Get form values
  const title = document.querySelector('#title').value,
    author = document.querySelector('#author').value,
    isbn = document.querySelector('#isbn').value;

  // Instantiate a book
  const book = new Book(title, author, isbn);

  // Instantiate UI
  const ui = new UI();
  // Instantiate LS
  // const storage = new LocalStorage();
  // Validate
  if (title === '' || author === '' || isbn === '') {
    // Error alert
    ui.showAlert('Please fill in all fields', 'error');
  } else {
    // Add book to list
    ui.addBookToList(book);
    // Add book to the LS
    LocalStorage.addBooks(book);
    // Clear fields
    ui.clearFields(book);
    // Shoe Success
    ui.showAlert('The Book is added to the list', 'success');
  }

  e.preventDefault();
});
// Event listener for delete
document.querySelector('#book-list').addEventListener('click', function (e) {
  // Instantiate UI
  const ui = new UI();
  // Delete the book
  ui.deleteBook(e.target);
  // get the title of a book
  const bookTitle =
    e.target.parentElement.parentElement.children[0].textContent;
  const bookIsbn = e.target.parentElement.previousElementSibling.textContent;
  // Remove the book from LS
  LocalStorage.removeBook(bookIsbn);
  // Show an alert
  ui.showAlert(`${bookTitle} is removed from the list`, 'success');

  e.preventDefault();
});
