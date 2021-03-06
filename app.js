// Module pattern
// IIFE that return an object

// BUDGET CONTROLLER
var budgetController = (function() {
  // Function Constructor
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(cur) {
      // Cur refer to Income or Expense object
      // sum = sum + cur.value;
      sum += cur.value;
    });
    data.totals[type] = sum;
    /* Example 
      0 
      [200, 400, 100]
      sum = 0 + 200
      sum = 200 + 400
      sum = 600 + 100 = 700
    */
  };

  // DATA STRUCTURE
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      // [1 2 3 4 5], next ID = 6
      // [1 2 4 6 8], next ID = 9
      // ID = last ID + 1

      // Create new ID
      // Get the last ID and add 1 to get the next ID for the new item
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item based on 'inc' or 'exp' type
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      // Push it into our data struture
      data.allItems[type].push(newItem);

      // return the new element
      return newItem;
    },

    deleteItem: function(type, id) {
      var ids, index;
      // id = 6
      // data.allItems[type][id]
      // ids = [1 2 4 6 8]
      // index = 3

      // Traverse in array using the map method, map return a brand new array
      ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      index = ids.indexOf(id);

      // delete items
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function() {
      // Calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // Calculate the percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        // Expense = 100 and income = 300, spent 33.333% = 100/300 = 0.333 * 100
      } else {
        data.prcentage = -1;
      }
    },
    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },
    // TESTING
    testing: function() {
      console.log(data);
    }
  };
})();
// End budgetController

// budgetController.publicTest(5)

// UI CONTROLLER
var UIController = (function() {
  // SELECTOR VARIABLE
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    // Perent element for event delegation
    container: '.container'
  };

  return {
    getInput: function() {
      return {
        // The value will be in (income) or exp (expense)
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: function(obj, type) {
      let html, newHtml, element;
      // Create HTML string with placeholder text
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html = `<div class="item clearfix" id="inc-%id%"> 
                  <div class="item__description">%description%</div>
                  <div class="right clearfix">
                    <div class="item__value">%value%</div>
                      <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                      </div>
                  </div>
                </div>`;
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;
        html = `<div class="item clearfix" id="exp-$id%">
                  <div class="item__description">%description%</div>
                    <div class="right clearfix">
                      <div class="item__value">%value%</div>
                        <div class="item__percentage">21%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                  </div>
              </div>`;
      }

      // Replace the placeholder text with some actual data
      newHtml = html.replace(`%id%`, obj.id);
      newHtml = newHtml.replace(`%description%`, obj.description);
      newHtml = newHtml.replace(`%value%`, obj.value);

      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    // REMOVING ITEMS FROM THE UI
    deleteListItem: function(selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    // Clear input fields (Add description and Value) after user input the value
    clearFields: function() {
      var fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMstrings.inputDescription + ', ' + DOMstrings.inputValue
      );

      // Convert list to an array
      fieldsArr = Array.prototype.slice.call(fields);

      // Loop through an array
      fieldsArr.forEach(function(current, index, array) {
        current.value = '';
      });

      // Set focus back to the first element of the array
      fieldsArr[0].focus();
    },

    // DISPLAY THE BUDGET
    /* getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };      
    }, */
    displayBudget: function(obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent =
        obj.totalExp;

      // MENAMPILKAN LABEL PERSENTASE
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '----';
      }
    },

    // Expose DOMstrings variable to the public
    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();
// END UI CONTROLLER

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
  // Get the DOMstrings variable from UI CONTROLLER
  var DOM = UICtrl.getDOMstrings();

  // LISTENERS FOR EVENTS
  var setupEventListeners = function() {
    // Detect if the checkmark button is clicked
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    // Detect if the Enter button is pressed
    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        // console.log('ENTER');
        ctrlAddItem();
      }
    });

    // EVENT DELEGATION
    // PUT THE EVENT HANDLER TO THE PARENT ELEMENT (.container) to detect when .item__delete--btn is clicked on income or expenses
    // DELETE ITEM
    document
      .querySelector(DOM.container)
      .addEventListener('click', ctrlDeleteItem);
  };

  // UPDATE BUDGET
  var updateBudget = function() {
    // 1. calculate the budget
    budgetCtrl.calculateBudget();

    // 2. Return the budget
    var budget = budgetCtrl.getBudget();

    // 3. Display the budget on the UI
    // console.log(budget);
    UICtrl.displayBudget(budget);
  };

  var ctrlAddItem = function() {
    var input, newItem;

    // 1. Get the filled input data from the UI Controller
    input = UICtrl.getInput();
    // console.log(input);

    // Prevent input if there are no description
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add the item to the ui
      UICtrl.addListItem(newItem, input.type);

      // 4. Clear the fields
      UICtrl.clearFields();

      // 5. Calculate and update budget
      updateBudget();
    } else {
      alert(`Please input the data`);
    }
  };

  // Event delegation for delete income or expense
  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;
    // TRAVERSE TO THE TOP PARENT NODE AND GET THE ID
    // itemID = console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      // inc-1
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);

      // 2. Delete the item from the UI
      UICtrl.deleteListItem(itemID);

      // 3. Update and show the new budget
      updateBudget();
    }
  };

  return {
    init: function() {
      console.log('App started');
      // SET ALL VALUE TO 0
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();

//
