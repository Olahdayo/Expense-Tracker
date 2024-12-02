// Load expenses from LS
window.onload = function () {
  loadExpenses();
};

// Get Variables
const expenseForm = document.getElementById("Expense-form");
const expenseList = document.getElementById("ExpenseList");
const nameError = document.getElementById("name-error");
const dateError = document.getElementById("date-error");
const amountError = document.getElementById("amount-error");
const filterBtn = document.getElementById("filterBtn");
const resetBtn = document.getElementById("resetBtn");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");

//  to prevent negative numbers
const amountInput = document.getElementById("Amount");
amountInput.addEventListener("input", function (e) {
  if (this.value < 0) {
    this.value = 0;
  }
});

expenseForm.addEventListener("submit", addExpense);
filterBtn.addEventListener("click", filterExpenses);
resetBtn.addEventListener("click", resetFilter);

// Function to validate input and show error messages
function validateInput(date, name, amount) {
  let isValid = true;

  nameError.textContent = "";
  dateError.textContent = "";
  amountError.textContent = "";

  // Name validation 
  if (!name.trim()) {
    nameError.textContent = "Please enter an expense name";
    isValid = false;
  } else if (name.trim().length < 4) {
    nameError.textContent = "Name must be at least 4 characters long";
    isValid = false;
  }

  // Date validation
  if (!date) {
    dateError.textContent = "Please select a date";
    isValid = false;
  }

  // Amount validation
  if (!amount) {
    amountError.textContent = "Please enter an amount";
    isValid = false;
  } else if (isNaN(amount) || parseFloat(amount) <= 0) {
    amountError.textContent = "Please enter an amount greater than 0";
    isValid = false;
  }

  return isValid;
}

// Function to add an expense
function addExpense(event) {
  event.preventDefault();
  const date = document.getElementById("Date").value;
  const name = document.getElementById("Name").value;
  const amount = document.getElementById("Amount").value;

  if (validateInput(date, name, amount)) {
    const expense = { date, name, amount };
    saveExpense(expense);
    displayExpenses();
    expenseForm.reset();
    // Clear any remaining error messages
    nameError.textContent = "";
    dateError.textContent = "";
    amountError.textContent = "";
  }
}

// Function to save expense to local storage
function saveExpense(expense) {
  let expenses = getExpenses();
  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Function to get expenses from local storage
function getExpenses() {
  const expenses = localStorage.getItem("expenses");
  return expenses ? JSON.parse(expenses) : [];
}

// Function to delete an expense
function deleteExpense(index) {
  if (confirm("Are you sure you want to delete this expense?")) {
    let expenses = getExpenses();
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    displayExpenses();
  }
}

// Function to determine color based on amount for individual expenses
function getAmountColor(amount) {
  const amountValue = parseFloat(amount);
  if (amountValue <= 50) {
    return "green";
  } else if (amountValue <= 100) {
    return "orange";
  } else {
    return "red";
  }
}

// Function to determine color for total amount
function getTotalColor(amount) {
  const amountValue = parseFloat(amount);
  return amountValue > 100 ? "red" : "inherit";
}

// Function to filter expenses by date range
function filterExpenses() {
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  // Validate dates
  if (!startDate.value || !endDate.value) {
    alert("Please select both start and end dates");
    return;
  }

  if (start > end) {
    alert("Start date must be before end date");
    return;
  }

  const expenses = getExpenses();
  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= start && expenseDate <= end;
  });

  displayFilteredExpenses(filteredExpenses);
}

// Function to reset the date filter
function resetFilter() {
  startDate.value = "";
  endDate.value = "";
  displayExpenses();
}

// Function to display filtered expenses
function displayFilteredExpenses(filteredExpenses) {
  expenseList.innerHTML = "";

  filteredExpenses.forEach((expense, index) => {
    const li = document.createElement("li");
    li.textContent = `${expense.name} - $${expense.amount}: ${expense.date}`;

    li.style.color = getAmountColor(expense.amount);

    // Delete button
    const removeButton = document.createElement("button");
    removeButton.textContent = "Delete";
    removeButton.className = "removeButton";
    removeButton.addEventListener("click", () => deleteExpense(index));
    li.appendChild(removeButton);
    expenseList.appendChild(li);
  });

  // Calculate and display filtered total
  const totalDiv = document.createElement("div");
  totalDiv.id = "expense-total";
  totalDiv.className = "total-expenses";
  const total = calculateTotal(filteredExpenses);
  totalDiv.textContent = `Filtered Total Expenses: $${total}`;
  totalDiv.style.color = getTotalColor(total);

  // Remove existing total if present
  const existingTotal = document.getElementById("expense-total");
  if (existingTotal) {
    existingTotal.remove();
  }
  // Add new total after the expense list
  expenseList.parentNode.insertBefore(totalDiv, expenseList.nextSibling);
}

// Function to calculate total expenses
function calculateTotal(expenses) {
  return expenses
    .reduce((total, expense) => {
      return total + parseFloat(expense.amount);
    }, 0)
    .toFixed(2);
}

// Function to load and display expenses
function loadExpenses() {
  displayExpenses();
}

// Function to display expenses
function displayExpenses() {
  const expenses = getExpenses();
  expenseList.innerHTML = "";

  expenses.forEach((expense, index) => {
    const li = document.createElement("li");
    li.textContent = `${expense.name} - $${expense.amount}: ${expense.date}`;

    li.style.color = getAmountColor(expense.amount);

    // Delete button
    const removeButton = document.createElement("button");
    removeButton.textContent = "Delete";
    removeButton.className = "removeButton";
    removeButton.addEventListener("click", () => deleteExpense(index));
    li.appendChild(removeButton);
    expenseList.appendChild(li);
  });

  // Create and display total
  const totalDiv = document.createElement("div");
  totalDiv.id = "expense-total";
  totalDiv.className = "total-expenses";
  const total = calculateTotal(expenses);
  totalDiv.textContent = `Total Expenses: $${total}`;
  totalDiv.style.color = getTotalColor(total);

  // Remove existing total if present
  const existingTotal = document.getElementById("expense-total");
  if (existingTotal) {
    existingTotal.remove();
  }

  // Add total after the expense list
  expenseList.parentNode.insertBefore(totalDiv, expenseList.nextSibling);
}
