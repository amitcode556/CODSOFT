class Calculator {
  constructor() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operator = null;
    this.waitingForOperand = false;
    this.displayElement = document.getElementById('currentOperand');
    this.previousDisplayElement = document.getElementById('previousOperand');

    this.init();
  }

  init() {
    this.attachEventListeners();
    this.updateDisplay();
  }

  attachEventListeners() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        this.handleButtonClick(button);
      });
    });

    document.addEventListener('keydown', (e) => {
      this.handleKeyPress(e);
    });
  }

  handleButtonClick(button) {
    const digit = button.dataset.digit;
    const operator = button.dataset.operator;
    const action = button.dataset.action;

    if (digit) {
      this.inputDigit(digit);
    } else if (operator) {
      this.inputOperator(operator);
    } else if (action) {
      this.handleAction(action);
    }
  }

  handleKeyPress(e) {
    const key = e.key;

    if (key >= '0' && key <= '9') {
      this.inputDigit(key);
    } else if (key === '+' || key === '-') {
      this.inputOperator(key);
    } else if (key === '*') {
      this.inputOperator('*');
    } else if (key === '/') {
      e.preventDefault();
      this.inputOperator('/');
    } else if (key === 'Enter' || key === '=') {
      e.preventDefault();
      this.calculate();
    } else if (key === 'Backspace') {
      this.backspace();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
      this.clear();
    } else if (key === '.') {
      this.inputDecimal();
    }
  }

  inputDigit(digit) {
    if (this.waitingForOperand) {
      this.currentOperand = digit;
      this.waitingForOperand = false;
    } else {
      if (this.currentOperand === '0') {
        this.currentOperand = digit;
      } else if (this.currentOperand === 'Error') {
        this.currentOperand = digit;
      } else {
        this.currentOperand += digit;
      }
    }
    this.updateDisplay();
  }

  inputDecimal() {
    if (this.waitingForOperand) {
      this.currentOperand = '0.';
      this.waitingForOperand = false;
    } else {
      if (!this.currentOperand.includes('.')) {
        this.currentOperand += '.';
      }
    }
    this.updateDisplay();
  }

  inputOperator(nextOperator) {
    if (this.currentOperand === 'Error') {
      return;
    }

    const inputValue = parseFloat(this.currentOperand);

    if (this.operator && !this.waitingForOperand) {
      const result = this.calculatePrevious();

      if (result === 'Error') {
        this.currentOperand = 'Error';
        this.previousOperand = '';
        this.operator = null;
        this.updateDisplay();
        return;
      }

      this.currentOperand = String(result);
      this.updateDisplay();
    }

    this.operator = nextOperator;
    this.previousOperand = this.currentOperand + ' ' + this.getOperatorSymbol(nextOperator);
    this.waitingForOperand = true;
    this.updateDisplay();
  }

  getOperatorSymbol(operator) {
    const symbols = {
      '+': '+',
      '-': '−',
      '*': '×',
      '/': '÷'
    };
    return symbols[operator] || operator;
  }

  calculatePrevious() {
    const prev = parseFloat(this.previousOperand.split(' ')[0]);
    const current = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) {
      return current;
    }

    let result;

    if (this.operator === '+') {
      result = prev + current;
    } else if (this.operator === '-') {
      result = prev - current;
    } else if (this.operator === '*') {
      result = prev * current;
    } else if (this.operator === '/') {
      if (current === 0) {
        return 'Error';
      }
      result = prev / current;
    }

    return this.formatResult(result);
  }

  calculate() {
    if (!this.operator || this.waitingForOperand || this.currentOperand === 'Error') {
      return;
    }

    const result = this.calculatePrevious();

    if (result === 'Error') {
      this.currentOperand = 'Error';
      this.previousOperand = '';
      this.operator = null;
      this.updateDisplay();
      this.displayElement.classList.add('error');
      return;
    }

    this.displayElement.classList.remove('error');
    this.currentOperand = String(result);
    this.previousOperand = '';
    this.operator = null;
    this.waitingForOperand = true;
    this.updateDisplay();
  }

  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operator = null;
    this.waitingForOperand = false;
    this.displayElement.classList.remove('error');
    this.updateDisplay();
  }

  backspace() {
    if (this.currentOperand === 'Error') {
      this.clear();
      return;
    }

    if (this.currentOperand.length === 1 || (this.currentOperand.length === 2 && this.currentOperand[0] === '-')) {
      this.currentOperand = '0';
    } else {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }
    this.updateDisplay();
  }

  handleAction(action) {
    if (action === 'clear') {
      this.clear();
    } else if (action === 'backspace') {
      this.backspace();
    } else if (action === 'decimal') {
      this.inputDecimal();
    } else if (action === 'equals') {
      this.calculate();
    }
  }

  formatResult(number) {
    if (!Number.isFinite(number)) {
      return 'Error';
    }

    const rounded = Math.round(number * 1000000000) / 1000000000;
    return String(rounded);
  }

  updateDisplay() {
    this.displayElement.textContent = this.currentOperand;
    this.previousDisplayElement.textContent = this.previousOperand;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Calculator();
});
