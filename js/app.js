var dataController = (function () {
    var Book = function(id, title, author, genre, date, isbn) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.date = date;
        this.isbn = isbn;
    };

    var data = {
        allBooks: []
    };

    return {
        addItem: function(title, author, genre, date, isbn) {

            var newItem, id;

            if(data.allBooks.length === 0) {
                id = 0;
            } else {
                id = data.allBooks[data.allBooks.length - 1].id + 1;
            }

            newItem = new Book(id, title, author, genre, date, isbn);

            data.allBooks.push(newItem);

            return newItem;
        },

        getData: function() {
            return data;
        },

        test: function() {
            console.log(data);
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
        getInput: function() {
            return {
                title: document.querySelector(DOMstrings.title).value,
                author: document.querySelector(DOMstrings.author).value,
                genre: document.querySelector(DOMstrings.genre).value,
                date: document.querySelector(DOMstrings.date).value,
                isbn: document.querySelector(DOMstrings.isbn).value,
            };
        },

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

        // Get input from forms
        var input = UICtrl.getInput();

        // Create a new Book object
        var newBook = dataCtrl.addItem(input.title, input.author, input.genre, input.date, input.isbn);

        // Update UI
        // UICtrl.updateUI(newBook);
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