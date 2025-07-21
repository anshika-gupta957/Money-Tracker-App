const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const clearBtn = document.getElementById("clear");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please enter a description and amount");
    return;
  }

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value,
  };

  transactions.push(transaction);
  updateLocalStorage();
  addTransactionDOM(transaction);
  updateValues();
  text.value = "";
  amount.value = "";
}

// Add transaction to DOM
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");

  item.classList.add(transaction.amount < 0 ? "minus" : "plus");
  item.innerHTML = `
    ${transaction.text} 
    <span>${sign}$${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(item);
}

// Update totals
function updateValues() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
  const income = amounts.filter(v => v > 0).reduce((a, b) => a + b, 0).toFixed(2);
  const expense = (
    amounts.filter(v => v < 0).reduce((a, b) => a + b, 0) * -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

// Remove transaction
function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

// Clear all transactions
clearBtn.addEventListener("click", () => {
  transactions = [];
  updateLocalStorage();
  init();
});

// Update localStorage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initialize
function init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();
form.addEventListener("submit", addTransaction);
