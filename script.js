class Calculator {
  constructor() {
    this.previousOperandText = document.getElementById("previous-operand");
    this.currentOperandText = document.getElementById("current-operand");
    this.clear();
    this.bindEvents();
    this.bindKeyboard();
  }

  clear() {
    this.currentOperand = "0";
    this.previousOperand = "";
    this.operation = undefined;
    this.shouldResetDisplay = false;
    this.updateDisplay();
  }

  delete() {
    if (this.shouldResetDisplay || this.currentOperand === "Error") return;
    if (this.currentOperand.length === 1 || (this.currentOperand.length === 2 && this.currentOperand.startsWith("-"))) {
      this.currentOperand = "0";
    } else {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }
    this.updateDisplay();
  }

  appendNumber(number) {
    if (this.currentOperand === "Error") this.clear();
    if (this.shouldResetDisplay) {
      this.currentOperand = "";
      this.shouldResetDisplay = false;
    }
    if (number === "." && this.currentOperand.includes(".")) return;
    if (number === "." && this.currentOperand === "") this.currentOperand = "0";
    if (this.currentOperand === "0" && number !== ".") this.currentOperand = "";
    this.currentOperand += number;
    this.updateDisplay();
  }

  chooseOperation(operation) {
    if (this.currentOperand === "Error") return;
    if (this.previousOperand !== "" && this.shouldResetDisplay) {
      this.operation = operation;
      this.updateDisplay();
      return;
    }
    if (this.previousOperand !== "") {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.shouldResetDisplay = true;
    this.updateDisplay();
  }

  compute() {
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    let result;
    switch (this.operation) {
      case "+": result = prev + current; break;
      case "-": result = prev - current; break;
      case "*": result = prev * current; break;
      case "/":
        if (current === 0) {
          this.currentOperand = "Error";
          this.previousOperand = "";
          this.operation = undefined;
          this.shouldResetDisplay = true;
          this.updateDisplay();
          return;
        }
        result = prev / current;
        break;
      default: return;
    }
    result = Math.round(result * 1e10) / 1e10;
    this.currentOperand = String(result);
    this.operation = undefined;
    this.previousOperand = "";
    this.shouldResetDisplay = true;
    this.updateDisplay();
  }

  toggleSign() {
    if (this.currentOperand === "Error" || this.currentOperand === "0") return;
    this.currentOperand = this.currentOperand.startsWith("-")
      ? this.currentOperand.slice(1)
      : "-" + this.currentOperand;
    this.updateDisplay();
  }

  percentage() {
    if (this.currentOperand === "Error") return;
    this.currentOperand = String(parseFloat(this.currentOperand) / 100);
    this.updateDisplay();
  }

  updateDisplay() {
    this.currentOperandText.innerText = this.currentOperand;
    this.previousOperandText.innerText =
      this.previousOperand !== ""
        ? `${this.previousOperand} ${this.operation || ""}`
        : "";
  }

  bindEvents() {
    document.querySelectorAll("[data-number]").forEach((btn) => {
      btn.addEventListener("click", () => this.appendNumber(btn.innerText));
    });
    document.getElementById("ac").addEventListener("click", () => this.clear());
    document.getElementById("del").addEventListener("click", () => this.delete());
    document.getElementById("divide").addEventListener("click", () => this.chooseOperation("/"));
    document.getElementById("multiply").addEventListener("click", () => this.chooseOperation("*"));
    document.getElementById("subtract").addEventListener("click", () => this.chooseOperation("-"));
    document.getElementById("add").addEventListener("click", () => this.chooseOperation("+"));
    document.getElementById("equals").addEventListener("click", () => this.compute());
    document.getElementById("sign").addEventListener("click", () => this.toggleSign());
    document.getElementById("percent").addEventListener("click", () => this.percentage());
  }

  bindKeyboard() {
    document.addEventListener("keydown", (event) => {
      const key = event.key;
      if (/^[0-9.]$/.test(key)) this.appendNumber(key);
      else if (["+", "-", "*", "/"].includes(key)) this.chooseOperation(key);
      else if (key === "Enter" || key === "=") this.compute();
      else if (key === "Backspace") this.delete();
      else if (key === "Escape") this.clear();
      else if (key === "%") this.percentage();
    });
  }
}

new Calculator();
