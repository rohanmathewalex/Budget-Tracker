//BUDGET CONTROLLER
var budgetController = (function(){
   var Expense = function(id,description,value){
       this.id = id;
       this.description = description;
       this.value = value;
       this.percentage = -1;
   };

   //Calculate Perentage
   Expense.prototype.calcPercentage = function(totalIncome){
       if(totalIncome>0){
        this.percentage =Math.round((this.value/totalIncome)*100);
       }else{
           this.percentage =-1;
       }
   };
   //Return Percentage
   Expense.prototype.getPercentage = function(){
      return this.percentage;
   };
   
   var Income = function(id, description, value){
       this.id = id;
       this.description = description;
       this. value = value;
   };
   var calculateTotal = function(type){
       var sum=0;
       data.allItems[type].forEach(function(cur){
           sum += cur.value;
       });
       data.total[type] =sum; 

   }

   //Data Structure(to store all items)
 var data = {
    allItems: {
        exp:[],
        inc:[]
    },
    total:{
        exp:0,
        inc:0
    },
    budget:0,
    percentage:-1
    
};

//Public method which allows to add/create new item ino our dataStructure
return {
    addItem : function(type, des, val){
        var newItem,ID;
        //Create new ID
        if(data.allItems[type].length>0){
            ID= data.allItems[type][data.allItems[type].length -1].id + 1;
        } else{
            ID = 0;
        }
        
        //create new item based on 'inc' or 'exp' type
        if(type === 'exp'){
           newItem = new Expense(ID, des, val);
        } else if(type === 'inc'){
            newItem = new Income(ID, des,val)
        }
        //allItems[type] wiil select array (inc or exp ) according from above addItem method.
        //Push it into dataStructure
        data.allItems[type].push(newItem);
        //Return the new Element
        return newItem;
    },
    deleteItem:function(type, id){
        var ids, index;
        //map return a barand new array of elements
        ids = data.allItems[type].map(function(current){
            return current.id;
        });
        index = ids.indexOf(id);
        if(index !== -1){
            data.allItems[type].splice(index,1);
        }
    },
    calculateBudget: function(){
        //Calculate total icome and expense
        calculateTotal('inc');
        calculateTotal('exp');

        //calculate the budget income-expense
        data.budget = data.total.inc - data.total.exp;

        //calculate the percentage of income that we spend
        if(data.total.inc>0){
            data.percentage = Math.round((data.total.exp / data.total.inc)*100); 

        }else{
            data.percentage =-1;
        }
       
    },
    calculatePercentages: function(){
        data.allItems.exp.forEach(function(cur){
            cur.calcPercentage(data.total.inc);
        });
    },

    getPercentages: function(){
        var allPerc = data.allItems.exp.map(function(cur){
            return cur.getPercentage();
        });
        return allPerc;
    },
    
    getBudget: function(){
return {
    budget: data.budget,
    totalInc: data.total.inc,
    totalExp: data.total.exp,
    percentage: data.percentage
};
    },

   testing:function(){
       console.log(data);
   }
   
};
})();


//UI Controller
 var UIcontroller = (function(){
     var DOMstrings = {
         inputType:'.add__type',
         inputDescription:'.add__description',
         inputValue:'.add__value',
         inputBtn:'.add__btn',
         incomeContainer:'.income__list',
         expenseContainer:'.expenses__list',
         budgetLabel:'.budget__value',
         incomeLabel:'.budget__income--value',
         expenseLabel:'.budget__expenses--value',
         percentageLabel:'.budget__expenses--percentage',
         container:'.container',
         expensesPercLabel: '.item__percentage',
         dateLabel:'.budget__title--month'
     };
   var  formatNumber = function(num,type){
        /*
        + or - before number
        exactly 2 decimal points
        comma sepreating the thousands
         */
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
         int =numSplit[0];

         if(int.length>3){
            int = int.substr(0,int.length -3)+ ','+int.substr(int.length-3 ,3);//Means it starts reading from position 0 and only one element //input 2350 ===> output ---> 2,350
                                                 
         }
         dec = numSplit[1];

         return(type === 'exp' ? '-':'+')+ ' '+ int +'.'+ dec;
    };
    var nodeListForEach = function(list,callback){
        for(i=0;i<list.length;i++){
            callback(list[i],i);
        }
    };
     return  {
         getInput: function(){
             //return these three values as object to the Controller.Instead of sending each variable.
            return {
                type : document.querySelector(DOMstrings.inputType).value,//will be either inc or exp (income or expense)
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
         },

         addListItem: function(obj, type){
             var html,newHtml,element;

            // 1.Create HTML string with placeholder text
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix">   <div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp'){
                element =DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // 2. Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',formatNumber(obj.value,type));

            // 3. Insert the Html Into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
         },
         deleteListItem:function(selectorID){
           //  document.getElementById(selectorID).parentNode.removeChild(document.getElementById(selectorID));
           var el = document.getElementById(selectorID);
           el.parentNode.removeChild(el);
         },

         //Clear input Fields
         clearFields: function(){
             var fields, fieldArr;
             //Here using querySelectorAll we get list instead of Array . So we need to convert this list into array.
             fields = document.querySelectorAll(DOMstrings.inputDescription + ','+ DOMstrings.inputValue);
            
             //Converting List into array
            fieldArr = Array.prototype.slice.call(fields);
            //looping through this array to clear all fields
            fieldArr.forEach(function(current, index, array){
                current.value = "";
            });
             //Set focus to the first element of the array
             fieldArr[0].focus();

         }, 
         displayBudget: function(obj){
             var type;
             obj.budget > 0 ? type = 'inc' : type = 'exp';

             document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
             document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
             document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp,'exp');
             
             if(obj.percentage> 0){
                document.querySelector(DOMstrings.percentageLabel).textContent= obj.percentage+'%';
             }else {
                 document.querySelector(DOMstrings.percentageLabel).textContent = '---';
             }

         },
         displayPercentage: function(percentages){
             //queryselectorAll returns a list
             var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
             

             nodeListForEach(fields,function(current,index){
                 if(percentages[index]>0){
                     current.textContent = percentages[index]+'%';
                 }else{
                     current.textContent='---';
                 }
             });

         },
         displayMonth: function(){
             var now,year,month,months;
             now = new Date();
             months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
             month = now.getMonth();
             year = now.getFullYear();
             document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' '+ year;

         },
         changedType: function(){

             var fields = document.querySelectorAll(
                 DOMstrings.inputType+ ',' +
                 DOMstrings.inputDescription + ',' +
                 DOMstrings.inputValue);
                 nodeListForEach(fields, function(cur){
                     cur.classList.toggle('red-focus');
                 });
                 document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
             
         },
         

         //here we exposing our private DOMstrings into public
         getDOMstrings: function(){
             return DOMstrings;
         }
     }
            
 })();

 //Global App Controller
  var controller = (function(budgetCtrl,UIctrl){

    var setupEventListeners = function(){
     //Here we aceess the publically exposed DOMstrings in DOM variable!
     var DOM = UIctrl.getDOMstrings();
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

   //Key press event(when someone hit Enter key)
    document.addEventListener('keypress',function(event){
        if(event.key === 13 || event.which ===13){
            ctrlAddItem();
                }
            });
            document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);

            document.querySelector(DOM.inputType).addEventListener('change',UIctrl.changedType);
        };

        updateBudget = function(){
            // 1. calculate Budget
            budgetCtrl.calculateBudget();

            // 2. Return Budget
            var budget = budgetCtrl.getBudget();
             

            //3.Display Budget on the UI
         UIctrl.displayBudget(budget);

        };
        //update Percentages
        var updatePercentage = function(){

            //1. Calculate percentages
            budgetCtrl.calculatePercentages();

            //2.Read percentages from the budget controller
            var percentages = budgetCtrl.getPercentages();

            //3.update the UI with the new Percentages
             UIctrl.displayPercentage(percentages);    

        }; 

     var ctrlAddItem = function() {    
         var input, newItem
     //1. get the field input data
     input = UIctrl.getInput();

     if(input.description !== "" && !isNaN(input.value) && input.value >0){
    //2. Add the item to the budget controller
     newItem = budgetCtrl.addItem(input.type,input.description,input.value);

     //3. Add the item to the UI
     UIcontroller.addListItem(newItem, input.type);

     //4. Clear fields
     UIctrl.clearFields();

     //5. Calculate and update Budget
     updateBudget();

     //6. Calculate and update the percentage
     updatePercentage();
     }  
    };
     
    //In Event delegation event bubbles up the target element(so where it was first fiered)
    var ctrlDeleteItem = function(event){
        var itemID,splitId,type,ID;
        //Dom Traversing
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID){
            //ItemId is a string eg:"inc-0" and string is primitive value
            //using split we can convert the primitive value into ibject type
            // using split we get a array eg[inc,0] and our first element is type(inc or exp)
            splitId = itemID.split('-');
            type = splitId[0];
            ID = parseInt(splitId[1]);

            //1. First delete the item from the data structure.
             budgetCtrl.deleteItem(type,ID);
             

            //2. Delete the item from the UI
            UIctrl.deleteListItem(itemID);

            //3. Update and show new budget
            updateBudget();

            //4. Calculate and update percentage
            updatePercentage();
            
        }

    };

     return {
         init: function(){
             UIctrl.displayMonth();
             console.log('Application has started');
             UIctrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1 
            });
             setupEventListeners();
         }
     }

 })(budgetController,UIcontroller);
  
 //here we invoke the event listner. Without event listener nothin gonna happen(no input wiil be get ) .So call the init function
 controller.init();  
 