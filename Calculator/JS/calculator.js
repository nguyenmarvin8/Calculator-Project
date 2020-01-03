//makes object to keep track of values
const calculator = {
    //displays 0 on the screen
    displayValue: '0',
    //hold first operand for any expression. we set it to null for now
    firstOperand: null,
    //this will checks whether or not the second operand has been input
    waitSecondOperand: false,
    //hold the operator, we set it to null for now
    operator: null,
};

//modifies values each time a button is clicked
function inputDigit(digit) {
    const { displayValue, waitSecondOperand } = calculator;
    //we are checking if waitsecondoperand is true and set displayvalue to the key that was clicked
    if (waitSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitSecondOperand = false;
    } else {
        //if the displayvalue does not contain a decimal point we will add one
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

//this handles decimal points
function inputDecimal(dot) {
    //ensure that accidental clicking of the decimal point
    //does not cause bugs in the expression
    if (calculator.waitSecondOperand === true) return;
    if (!calculator.displayValue.includes(dot)) {
        //we say that if displayvalue does not contain a decimal point, we will add a decimal point
        calculator.displayValue += dot;
    }
}

// handles operators
function handleOperator(nextOperator) {
    const {firstOperand, displayValue, operator} = calculator
    //when operator key is pressed, we convert current number
    //displayed on screen to a number and then store result in 
    //calculator.firstoperand if it doesnt already exist
    const valueOfInput = parseFloat(displayValue);
    //check if an operator already exist and if waitsecondoperand 
    //is true, then updates the operator and exits from the function
    if (operator && calculator.waitSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }
    if (firstOperand == null) {
        calculator.firstOperand = valueOfInput;
    } else if (operator) { //check if operator already exists
        const valueNow = firstOperand || 0;
        //if operator already exists, property lookup is performed for the operator
        // in the performcalculation object and the func that matches the
        // operator is executed
        const result = performCalculation[operator] (valueNow, valueOfInput);

        calculator.displayValue = String(result);
        calculator.firstOperand = result;
    }

    calculator.waitSecondOperand = true;
    calculator.operator = nextOperator;
}

const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '=': (firstOperand, secondOperand) => secondOperand
};
function calculatorReset() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitSecondOperand = false;
    calculator.operator = null;
}

//this func updates screen with contents of displayvalue
function updateDisplay() {
    const display = document.querySelector('.calculatorScreen');
    display.value = calculator.displayValue;
}

updateDisplay();
//this section monitors button clicks
const keys = document.querySelector('.calculatorKeys');
keys.addEventListener('click', (event) => {
    //target variable is an object the represents the element that was clicked
    const {target} = event;
    //if element that was clicked on is not a button, exit the function
    if (!target.matches('button')) {
        return;
    }

    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('decimal')) {
        inputDecimal(target.value);
        updateDisplay();
        return;
    }

    //ensure AC clears the numbers from the calculator
    if (target.classList.contains('allClear')) {
        calculatorReset();
        updateDisplay();
        return;
    }

        inputDigit(target.value);
        updateDisplay();

})