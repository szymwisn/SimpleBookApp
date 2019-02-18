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

        removeItem: function(id) {

            var ids, index;

            ids = data.allBooks.map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1) {
                data.allBooks.splice(index, 1);
            }
        },


        getData: function() {
            return data;
        },
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
        header: '.header',
        sortId: '.sort__id',
        sortTitle: '.sort__title',
        sortAuthor: '.sort__author',
        sortGenre: '.sort__genre',
        sortDate: '.sort__date',
        sortISBN: '.sort__isbn',
        table: '.table'
    };

    return {
        sortTable: function(by) {
            var table, rows, column, r1, r2, switching;

            table = document.querySelector(DOMstrings.table);
            rows = table.rows;

            switch(by) {
                case 'id': column = 0; break;
                case 'title': column = 1; break;
                case 'author': column = 2; break;
                case 'genre': column = 3; break;
                case 'date': column = 4; break;
                case 'isbn': column = 5; break;
            }

            do {
                switching = false;
                for(var i = 1; i < rows.length - 1; i++) {
                    r1 = rows[i].getElementsByTagName('td')[column];
                    r2 = rows[i+1].getElementsByTagName('td')[column];
    
                    doTheSwitch();

                }
            } while(switching);

            function doTheSwitch() {
                // sorting numbers
                if(column === 0 || column === 5) {
                    if(Number(r1.innerHTML) > Number(r2.innerHTML)) {
                        rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
                        switching = true;
                    }

                // sorting strings
                } else if(column > 0 && column < 4) {
                    if(r1.innerHTML.toLowerCase() > r2.innerHTML.toLowerCase()) {
                        rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
                        switching = true;
                    }

                // sorting dates
                } else if(column === 4) {

                    // first sort by year
                    if(convertDate(r1.innerHTML)[0] > convertDate(r2.innerHTML)[0]) {
                        rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
                        switching = true;
                    } else

                    // if the same year, sort by month
                    if(convertDate(r1.innerHTML)[0] === convertDate(r2.innerHTML)[0]) {
                        if(convertDate(r1.innerHTML)[1] > convertDate(r2.innerHTML)[1]) {
                            rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
                            switching = true;
                        } else

                        // if the same year nad month, sort by day
                        if(convertDate(r1.innerHTML)[1] === convertDate(r2.innerHTML)[1]) {
                            if(convertDate(r1.innerHTML)[2] > convertDate(r2.innerHTML)[2]) {
                                rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
                                switching = true;
                            }
                        }
                    } 
                }
            }

            // transforms and returns date to an array [year, month, day]
            function convertDate(date) {
                var arr = date.split("-");
                return [arr[0], arr[1], arr[2]];
            }      
        },

        clearInputs: function() {
            var inputsNodeList = document.querySelectorAll(DOMstrings.title + ', ' + DOMstrings.author + ', ' + DOMstrings.genre + ', ' + DOMstrings.isbn);
        
            var inputsArray = Array.from(inputsNodeList);

            inputsArray.forEach(function(el) {
                el.value = '';
            });

            inputsArray[0].focus();
        },

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

            html = '<tr id="book-%ID%"><td>%ID%</td></td><td>%title%</td><td>%author%</td><td>%genre%</td><td>%date%</td><td>%ISBN%</td><td><a class="delete btn__delete"></a></td></tr>';

            newHtml = html.replace("%ID%", obj.id).replace("%ID%", obj.id).replace("%title%", obj.title).replace("%author%", obj.author).replace("%genre%", obj.genre).replace("%date%", obj.date).replace("%ISBN%", obj.isbn);

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

        document.querySelector(DOM.table).addEventListener('click', removeBook);

        // Sort buttons listeners
        document.querySelector(DOM.sortId).addEventListener('click', function() {
            UICtrl.sortTable('id');
        });

        document.querySelector(DOM.sortTitle).addEventListener('click', function() {
            UICtrl.sortTable('title');
        });

        document.querySelector(DOM.sortAuthor).addEventListener('click', function() {
            UICtrl.sortTable('author');
        });

        document.querySelector(DOM.sortGenre).addEventListener('click', function() {
            UICtrl.sortTable('genre');
        });

        document.querySelector(DOM.sortDate).addEventListener('click', function() {
            UICtrl.sortTable('date');
        });

        document.querySelector(DOM.sortISBN).addEventListener('click', function() {
            UICtrl.sortTable('isbn');
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
                UICtrl.clearInputs();

            } else {
                UICtrl.showError('Book has already been added.');
            }
        } else {
            UICtrl.showError('Wrong input values.');
        }
     
    };

    var removeBook = function(event) {
        var el, ID;

        if (event.target.className) {
            el = event.target.parentNode.parentNode.id;
            ID = parseInt(el.split('-')[1]);

            // 1. remove book from dataController
            dataCtrl.removeItem(ID);

            // 2. remove book from UI
        }
       
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