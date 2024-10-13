// Get the display element
let display = document.getElementById('display');

// Function to clear the display
function clearDisplay() {
  display.textContent = '0';
}

// Function to append a number to the display
function appendNumber(number) {
  if (display.textContent === '0' || display.textContent === 'Error') {
    display.textContent = number;
  } else {
    display.textContent += number;
  }
}

// Function to append an operator to the display
function appendOperator(operator) {
  let currentText = display.textContent.trim();
  // Avoid consecutive operators
  if (/[+\-*/^%]$/.test(currentText)) return;
  display.textContent += ` ${operator} `;
}

// Function to evaluate the expression
function calculate() {
  try {
    let expression = display.textContent.replace('^', '**');
    let result = eval(expression);
    display.textContent = result;
  } catch {
    display.textContent = 'Error';
  }
}
