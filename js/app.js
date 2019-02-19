const dataController = (function () {
    let Book = function(id, title, author, genre, date, isbn) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.date = date;
        this.isbn = isbn;
    };

    let data = {
        allBooks: []
    };

    return {
        addItem: function(title, author, genre, date, isbn) {

            let id;

            if(data.allBooks.length === 0) {
                id = 0;
            } else {
                id = data.allBooks[data.allBooks.length - 1].id + 1;
            }

            const newItem = new Book(id, title, author, genre, date, isbn);

            data.allBooks.push(newItem);

            return newItem;
        },


        removeItem: function(id) {

            const ids = data.allBooks.map(current => current.id);
            let index = ids.indexOf(id);

            if(index !== -1) {
                data.allBooks.splice(index, 1);
            }
        },


        getData: function() {
            return data;
        },
    };
})();



const UIController = (function () {
    const DOMstrings = {
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
            let table, rows, column, r1, r2, switching;

            table = document.querySelector(DOMstrings.table);
            rows = table.rows;

            // 1. Disable active indicators
            disableIndicators();

            // 2. Define by which column we sort and set the active indicator
            chooseColumn();

            // 3. Switch rows
            switchRows();


            

            // disable active indicators
            function disableIndicators() {
                document.querySelector(DOMstrings.sortId).classList.remove('active');
                document.querySelector(DOMstrings.sortTitle).classList.remove('active');
                document.querySelector(DOMstrings.sortAuthor).classList.remove('active');
                document.querySelector(DOMstrings.sortGenre).classList.remove('active');
                document.querySelector(DOMstrings.sortDate).classList.remove('active');
                document.querySelector(DOMstrings.sortISBN).classList.remove('active');
            }

            function chooseColumn() {
                switch (by) {
                    case 'id': column = 0;
                        document.querySelector(DOMstrings.sortId).classList.add('active');
                        break;
                    case 'title': column = 1;
                        document.querySelector(DOMstrings.sortTitle).classList.add('active');
                        break;
                    case 'author': column = 2;
                        document.querySelector(DOMstrings.sortAuthor).classList.add('active');
                        break;
                    case 'genre': column = 3;
                        document.querySelector(DOMstrings.sortGenre).classList.add('active');
                        break;
                    case 'date': column = 4;
                        document.querySelector(DOMstrings.sortDate).classList.add('active');
                        break;
                    case 'isbn': column = 5;
                        document.querySelector(DOMstrings.sortISBN).classList.add('active');
                        break;
                }
            }

            function switchRows() {
                do {
                    switching = false;
                    for (let i = 1; i < rows.length - 1; i++) {
                        r1 = rows[i].getElementsByTagName('td')[column];
                        r2 = rows[i + 1].getElementsByTagName('td')[column];

                        doTheSwitch(i);

                    }
                } while (switching);
            }

            function doTheSwitch(i) {
                // transforms and returns date as an array [year, month, day]
                function convertDate(date) {
                    let arr, year, month, day;

                    arr = date.split("-");

                    year = arr[0];
                    month = arr[1];
                    day = arr[2];

                    return [year, month, day];
                }   

                const [year1, month1, day1] = [convertDate(r1.innerHTML)];
                const [year2, month2, day2] = [convertDate(r2.innerHTML)];

                function switchRows() {
                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                    switching = true;
                }

                // sorting numbers
                if(column === 0 || column === 5) {
                    if(Number(r1.innerHTML) > Number(r2.innerHTML)) {
                        switchRows();
                    }

                // sorting strings
                } else if(column > 0 && column < 4) {
                    if(r1.innerHTML.toLowerCase() > r2.innerHTML.toLowerCase()) {
                        switchRows();
                    }

                // sorting dates
                } else if(column === 4) {
                    // first sort by year
                    if(year1 > year2) {
                        switchRows();
                    }
                    // if the same year, sort by month
                    else if(year1 === year2) {
                        if(month1 > month2) {
                            switchRows();
                        } 
                        // if the same year nad month, sort by day
                        else if(month1 === month2) {
                            if(day1 > day2) {
                                switchRows();
                            }
                        }
                    } 
                }
            }   
        },


        clearInputs: function() {
            let inputsNodeList = document.querySelectorAll(DOMstrings.title + ', ' + DOMstrings.author + ', ' + DOMstrings.genre + ', ' + DOMstrings.isbn);
        
            let inputsArray = Array.from(inputsNodeList);

            inputsArray.forEach(el => el.value = '');

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
            let html, newHtml;
            
            html = '<div class="container"><div class="notification is-danger" style="margin-bottom: 15px;"><button class="delete" onclick="this.parentElement.style.display=\'none\';"></button><strong>Error!</strong> %MSG%</div></div>';
            newHtml = html.replace("%MSG%", msg);

            document.querySelector(DOMstrings.header).insertAdjacentHTML('afterend', newHtml);
        },


        addItem: function(obj) {
            let html, newHtml;

            html = '<tr id="book-%ID%"><td>%ID%</td></td><td>%title%</td><td>%author%</td><td>%genre%</td><td>%date%</td><td>%ISBN%</td><td><a class="delete btn__delete"></a></td></tr>';

            newHtml = html.replace("%ID%", obj.id).replace("%ID%", obj.id).replace("%title%", obj.title).replace("%author%", obj.author).replace("%genre%", obj.genre).replace("%date%", obj.date).replace("%ISBN%", obj.isbn);

            document.querySelector(DOMstrings.bookContainer).insertAdjacentHTML('beforeend', newHtml);
        },


        removeItem: function (selector) {
            let el = document.getElementById(selector);

            el.parentNode.removeChild(el);
        },


        gedDOM: function() {
            return DOMstrings;
        }
    };

})();



const controller = (function (dataCtrl, UICtrl) {
    let DOM;

    const setUpDOM = function() {
          DOM = UICtrl.gedDOM();
    };

    const setUpEventListeners = function() {

        // "Add to list" button listener
        document.querySelector(DOM.addButton).addEventListener('click', addBook);

        // "Enter" key listener
        document.addEventListener('keypress', (event) => {
            if(event.keyCode === 13) {
                addBook();
            }
        });

        // "Remove book" button listener
        document.querySelector(DOM.table).addEventListener('click', removeBook);

        // Sort buttons listeners
        document.querySelector(DOM.sortId).addEventListener('click', () => UICtrl.sortTable('id'));
        document.querySelector(DOM.sortTitle).addEventListener('click', () => UICtrl.sortTable('title'));
        document.querySelector(DOM.sortAuthor).addEventListener('click', () => UICtrl.sortTable('author'));
        document.querySelector(DOM.sortGenre).addEventListener('click', () => UICtrl.sortTable('genre'));
        document.querySelector(DOM.sortDate).addEventListener('click', () => UICtrl.sortTable('date'));
        document.querySelector(DOM.sortISBN).addEventListener('click', () => UICtrl.sortTable('isbn'));
    };

    

    const addBook = function() {
 
        // Get input from forms
        let input = UICtrl.getInput();

        // Validate input
        if(validateInput(input)) {
            // Check whether the book has already been added to the database
            if(checkIfExists(input.isbn)) {
                // Create a new Book object
                let newBook = dataCtrl.addItem(input.title, input.author, input.genre, input.date, input.isbn);

                // Update UI
                UICtrl.addItem(newBook);
                UICtrl.clearInputs();

            } else {
                UICtrl.showError(`Book with such ISBN number (${input.isbn}) has already been added.`);
            }
        } else {
            UICtrl.showError('Some inputs are empty.');
        }
     
    };

    const removeBook = function(event) {
        let el, ID;

        if (event.target.className === 'delete btn__delete') {
            el = event.target.parentNode.parentNode.id;
            ID = parseInt(el.split('-')[1]);

            // 1. remove book from dataController
            dataCtrl.removeItem(ID);

            // 2. remove book from UI
            UICtrl.removeItem(el);
        }
       
    };

    const validateInput = function(obj) {
        if(obj.title === '' || obj.author === '' || obj.genre === '' || obj.date === '' || obj.isbn === '') {
            return false;
        }

        return true;
    };

    const checkIfExists = function(isbn) {
        let data =  dataCtrl.getData();

        for(let i = 0; i < data.allBooks.length; i++) {
            if(data.allBooks[i].isbn === isbn) {
                return false;
            }
        }

        return true;
    };

    const setDefaultDate = function() {
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