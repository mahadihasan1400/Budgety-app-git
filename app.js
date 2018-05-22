/*
var budgetController = (function () {
    var x = 23;
    var add = function (a) {
        return x + a;
    }
    return {
        publicTest: function (b) {
            return add(b);
        }
    }
})();



var UIController = (function () {
    //
})();


var controller = (function (budgetCtrl, UICtrl) {

    var z = budgetCtrl.publicTest(5);
    return {
        value: z,
        anotherPublicMethod: function () {
            console.log(z);
        }
    }


})(budgetController, UIController);

*/









//BUDGET CONTROLLER
var budgetController = (function () {



    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercenatge = function (totalIncome) {
        if (totalIncome > 0) {
            //this.percentage = parseInt((this.value / totalIncome) * 100);
            this.percentage = Math.round((this.value / totalIncome) * 100);

        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {

        return this.percentage;

    }




    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
            budget: 0,
            percentage: -1
        }
    };



    var calculateBudget = function (type) {
        var sum = 0;

        data.allItems[type].forEach(function (current) {

            sum += current.value;

        });

        data.totals[type] = sum;


    }




    return {
        addItems: function (typ, desc, val) {
            var newItem, id;
            if (typ === 'exp') {
                if (data.allItems.exp.length === 0) {
                    id = 1;
                } else {
                    id = data.allItems.exp[(data.allItems.exp.length) - 1].id + 1;
                }
                newItem = new Expense(id, desc, val);
                data.allItems.exp.push(newItem);
            } else {
                if (data.allItems.inc.length === 0) {
                    id = 1;
                } else {
                    id = data.allItems.inc[(data.allItems.inc.length) - 1].id + 1;
                }
                newItem = new Income(id, desc, val);
                data.allItems.inc.push(newItem);
            }

            return newItem;
        },

        deleteItem: function (type, id) {

            var ids, index;

            ids = data.allItems[type].map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id);


            // id = 4;            
            // [1 2 4 6 8];
            // index = 2


            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }


        },

        calcBudget: function () {
            // 1.Calculate total income and expenses

            calculateBudget('exp');
            calculateBudget('inc');


            /* 
                        var sumExp = 0,
                            sumInc = 0,
                            budget, percentage;

                        data.allItems.exp.forEach(function (current) {

                            sumExp += current.value;

                        });

                        data.allItems.inc.forEach(function (current) {

                            sumInc += current.value;

                        });

                        data.totals.exp = sumExp;
                        data.totals.inc = sumInc;
            */


            // 2.Calculate Budget

            budget = data.totals.inc - data.totals.exp;
            data.totals.budget = budget;

            // 3.Calculate the percentage
            if (data.totals.inc > 0) {
                //percentage = parseInt((data.totals.exp / data.totals.inc) * 100);


                percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
                data.totals.percentage = percentage;
            } else {
                data.totals.percentage = -1;

            }



        },


        calculatePercentages: function () {
            data.allItems.exp.forEach(function (cur) {
                cur.calcPercenatge(data.totals.inc);
            });
        },

        getIndividualPercentage: function () {
            var percentage = data.allItems.exp.map(function (cur) {
                // return cur.percenatge;
                return cur.getPercentage();



            });
            return percentage;
        },

        getBudget: function () {

            return {
                totalExp: data.totals.exp,
                totalInc: data.totals.inc,
                totalBudget: data.totals.budget,
                totalPercentage: data.totals.percentage
            }

        },

        testing: function () {
            console.log(data);


        }
    }



})();





//UI CONTROLLER
var UIController = (function () {


    var domString = {
        inputType: document.querySelector('.add__type'),
        inputDescription: document.querySelector('.add__description'),
        inputValue: document.querySelector('.add__value'),
        inputBtn: document.querySelector('.add__btn'),
        itemIncome: document.querySelector('.income__list'),
        itemExpenses: document.querySelector('.expenses__list'),
        itemBudgetValue: document.querySelector('.budget__value'),
        itemBudgetIncomeValue: document.querySelector('.budget__income--value'),
        itemBudgetExpensesValue: document.querySelector('.budget__expenses--value'),
        itemBudgetExpensesPercentage: document.querySelector('.budget__expenses--percentage'),
        container: document.querySelector('.container'),
        monthAndYear: document.querySelector('.budget__title--month')
        //        itemPercentage: document.querySelector('.item__percentage');


    };



    var formatNumber = function (num, type) {

        var splitNum, type, int, dec, sign, formatedNum;

        num = Math.abs(num);
        num = num.toFixed(2);

        splitNum = num.split('.');

        int = splitNum[0];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        dec = splitNum[1];

        type === 'exp' ? sign = '-' : sign = '+';

        formatedNum = sign + ' ' + int + '.' + dec;

        return formatedNum;


    };



    return {
        getInputData: function () {
            // Send the value as an array object
            /*
            var inputContainer;
            var type = domString.inputType.value;
            var description = domString.inputDescription.value;
            var value = domString.inputValue.value;
            inputContainer = [type, description, value];
            return inputContainer;
            */

            // Send the value as a pure object
            return {

                type: domString.inputType.value,
                description: domString.inputDescription.value,
                value: parseFloat(domString.inputValue.value)

            }


        },

        domObject: domString,

        displayItemToUi: function (newItem, type) {
            var html, newHtml, element;

            if (type === 'exp') {
                //<i class="ion-ios-close-outline"></i>

                element = domString.itemExpenses;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'



            } else {
                // <i class="ion-ios-close-outline"></i>

                element = domString.itemIncome;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            }

            newHtml = html.replace('%id%', newItem.id);
            newHtml = newHtml.replace('%description%', newItem.description);
            newHtml = newHtml.replace('%value%', formatNumber(newItem.value, type));


            element.insertAdjacentHTML('beforeEnd', newHtml);





        },

        deleteItemFromUi: function (itemId) {

            var item = document.querySelector('#' + itemId);

            item.parentNode.removeChild(item);



        },

        displayBudgetToUi: function (bdgt) {
            var type;
            bdgt.totalBudget > 0 ? type = 'inc' : type = 'exp';

            domString.itemBudgetValue.innerHTML = '<strong>' + formatNumber(bdgt.totalBudget, type) + '</strong>';

            domString.itemBudgetExpensesValue.textContent = formatNumber(bdgt.totalExp, 'exp');
            domString.itemBudgetIncomeValue.textContent = formatNumber(bdgt.totalInc, 'inc');

            if (bdgt.totalPercentage > 0) {
                domString.itemBudgetExpensesPercentage.textContent = bdgt.totalPercentage + '%';
            } else {
                domString.itemBudgetExpensesPercentage.textContent = '---';
            }


        },

        chnagedType: function () {
            var list = document.querySelectorAll('.add__type, .add__description, .add__value');

// An alternative way of perform the same work
            
            
                        list.forEach(function (cur) {
                            
                            cur.classList.toggle('red-focus');
            
                        });
            
            domString.inputBtn.classList.toggle('red')


/* 

nodeListForeach function is defined in displayIndividualPercentages function.For running this code nodeListForeach function must bi defined in the outside of the displayIndividualPercentages function


            nodeListForeach(list, function (cur) {
                cur.classList.toggle('red-focus');


            });
*/

        },


        displayIndividualPercentages: function (percenatges) {



            var fields = document.querySelectorAll('.item__percentage');

            //My way to set the individual percenatge of each expenses

            /*
            for (var i = 0; i < fields.length; i++) {

                if (percenatges[i] > 0) {
                    fields[i].textContent = percenatges[i] + '%';
                } else {
                    fields[i].textContent = '---';

                }


            }
            */

            //Instructor said that form each can't be used for a list value but it is working don't know why
            /*
            fields.forEach(function(curr,index){
               
                curr.textContent = percenatges[index];
                
                
            });
            */

            var nodeListForeach = function (list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }


            };




            function displayPercentage(current, index) {

                if (percenatges[index] > 0) {
                    current.textContent = percenatges[index] + '%';
                } else {
                    current.textContent = '---';

                }



            }
            nodeListForeach(fields, displayPercentage);





        },

        displayCurMonthYear: function () {
            var now, curYear, curMonth, months;
            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            curMonth = now.getMonth();
            curYear = now.getFullYear();

            domString.monthAndYear.textContent = months[curMonth] + ',' + curYear;


        },


        cleraTheInputFields: function () {
            var fields, domArray;

            fields = document.querySelectorAll('.add__description , .add__value');

            // Convert a list to an array
            domArray = Array.prototype.slice.call(fields);

            // clearing the description and value field located in html
            domArray.forEach(function (current, index, domArray) { // currrent = current element of an array, index = current index of an array, domArray = actual array that hols all the elements

                current.value = "";

                //domArray[index].value = "";



            });
            // set the focus to the description field
            domArray[0].focus();


        }

    }

})();



//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    var start = function () {
        UICtrl.domObject.inputBtn.addEventListener('click', ctrlAddItem);
        
     
        document.addEventListener('keypress', function (event) {

            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }

        });

        UICtrl.domObject.container.addEventListener('click', ctrlDeleteItem);

        UICtrl.domObject.inputType.addEventListener('change', UICtrl.chnagedType);


    };

    var updateBudget = function () {


        // 1.CALCULATE THE BUDGET
        budgetCtrl.calcBudget();


        // 2.RETURN THE BUDGET
        var amount = budgetCtrl.getBudget();


        // 3.DISPLAY THE BUDGET TO THE UI


        UICtrl.displayBudgetToUi(amount);




    };

    var updatePercentages = function () {

        // Calculate the percentages
        budgetCtrl.calculatePercentages();


        // Get the percentages
        var percentage = budgetCtrl.getIndividualPercentage();


        // Display the Percenatges to ui

        UICtrl.displayIndividualPercentages(percentage);

    }



    function ctrlAddItem() {
        var inpData, newItem;


        // 1.GET THE INPUT DATA
        inpData = UICtrl.getInputData();

        if (inpData.description !== "" && !isNaN(inpData.value) && inpData.value > 0) {


            // 2.ADD THE DATA TO THE BUDGET CONTROLLER

            newItem = budgetCtrl.addItems(inpData.type, inpData.description, inpData.value);

            // 3.ADD THE DATA TO THE UI

            UICtrl.displayItemToUi(newItem, inpData.type);

            // 4.CLEAR THE INPUT FIELD
            UICtrl.cleraTheInputFields();

            // 5.CALCULATE AND UPDATE THE BUDGET

            updateBudget();

            // 6. CALCULATE AND UPDATE THE PERCENATGES
            updatePercentages();




        }

    };

    function ctrlDeleteItem(event) {
        var itemId, splitId, type, id;

        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        // get the id and type
        if (itemId) {
            splitId = itemId.split('-');
            type = splitId[0];
            id = parseInt(splitId[1]);
        }



        // Delete the item from data structure

        budgetCtrl.deleteItem(type, id);

        // Delete the item from ui

        UICtrl.deleteItemFromUi(itemId);

        // Recalculate the Budget

        updateBudget();

        // CALCULATE AND UPDATE THE PERCENATGES

        updatePercentages();


    }



    return {
        init: function () {
            UICtrl.displayCurMonthYear();

            UICtrl.displayBudgetToUi({
                totalExp: 0,
                totalInc: 0,
                totalBudget: 0,
                totalPercentage: -1
            });
            start();
        }

    }



})(budgetController, UIController);

controller.init()
