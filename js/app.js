var dataController = (function () {
    var Book = function(ID, title, author, genre, date, isbn) {
        this.ID = ID;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.date = date;
        this.isbn = isbn;
    };

    var data = {
        allBooks: [],
        bookCount: 0
    };

    return {
        addItem: function(title, author, genre, date, isbn) {

            var newItem, ID;

            if(data.allBooks.length === 0) {
                ID = 0;
            } else {
                ID = data.allBooks[data.allBooks.length - 1] + 1;
            }

            newItem = new Book(ID, title, author, genre, date, isbn);

            return newItem;
        },

        getData: function() {
            return data;
        }
    };

})();



var UIController = (function () {
    var DOMstrings = {
        title: '.input__title',
        author: '.input__author',
        genre: '.input__genre',
        date: '.input__date',
        isbn: '.input__isbn',
        addButton: '.btn__add',
        delButton: '.btn__delete'
    };

    return {
        gedDOM: function() {
            return DOMstrings;
        }
    };

})();



var controller = (function (dataCtrl, UICtrl) {
    var DOM;

    var setUpDOM = function() {
         DOM = UICtrl.gedDOM();
    };

    var setUpEventListeners = function() {

        // "Add to list" button listener
        document.querySelector(DOM.addButton).addEventListener('click', addBook);

        // "X" - delete a book button listener
        document.querySelector(DOM.delButton).addEventListener('click', removeBook);

        // "Enter" key listener
        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13) {
                addBook();
            }
        });
    };

    var addBook = function() {
        console.log('add');
    };

    var removeBook = function() {
        console.log('remove');
    }

    return {
        initialize: function() {
            setUpDOM();
            setUpEventListeners();
        }
    };

})(dataController, UIController);

controller.initialize();