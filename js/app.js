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
        delButton: '.btn__delete',
        bookContainer: '.book__container',
        header : '.header'
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

        showError: function(msg) {
            var html, newHtml;
            
            html = '<div class="container"><div class="notification is-danger" style="margin-bottom: 15px;"><button class="delete" onclick="this.parentElement.style.display=\'none\';"></button><strong>Error!</strong> %MSG%</div></div>';
            newHtml = html.replace("%MSG%", msg);

            document.querySelector(DOMstrings.header).insertAdjacentHTML('afterend', newHtml);
        },

        updateUI: function(obj) {
            var html, newHtml;

            html = '<tr><td>%ID%</td></td><td>%title%</td><td>%author%</td><td>%genre%</td><td>%date%</td><td>%ISBN%</td><td><a class="delete btn__delete"></a></td></tr>';

            newHtml = html.replace("%ID%", obj.id).replace("%title%", obj.title).replace("%author%", obj.author).replace("%genre%", obj.genre).replace("%date%", obj.date).replace("%ISBN%", obj.isbn);

            document.querySelector(DOMstrings.bookContainer).insertAdjacentHTML('beforeend', newHtml);
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

        // Validate input
        if(validateInput(input)) {
            // Check whether the book has already been added to the database
            if(checkIfExists(input.isbn)) {
                // Create a new Book object
                var newBook = dataCtrl.addItem(input.title, input.author, input.genre, input.date, input.isbn);

                // Update UI
                UICtrl.updateUI(newBook);
            } else {
                UICtrl.showError('Book has already been added.');
            }
        } else {
            UICtrl.showError('Wrong input values.');
        }
     
    };

    var removeBook = function() {
        console.log('remove');
    };

    var validateInput = function(obj) {
        if(obj.title === '' || obj.author === '' || obj.genre === '' || obj.date === '' || obj.isbn === '') {
            return false;
        }

        return true;
    };

    var checkIfExists = function(isbn) {
        var data =  dataCtrl.getData();

        for(var i = 0; i < data.allBooks.length; i++) {
            if(data.allBooks[i].isbn === isbn) {
                return false;
            }
        }

        return true;
    };

    var setDefaultDate = function() {
        document.querySelector(DOM.date).valueAsDate = new Date();
    };

    return {
        initialize: function() {
            setUpDOM();
            setUpEventListeners();
            setDefaultDate();
        }
    };

})(dataController, UIController);

controller.initialize();