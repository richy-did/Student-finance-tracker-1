let budgetCap = 0;
const STORAGE_KEY = "finance_transactions";
let transactions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function renderTransactions(data = transactions) {

    const tableBody =
        document.getElementById("transactionTableBody");

    tableBody.innerHTML = "";

    data.forEach(transaction => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${transaction.description}</td>
            <td>${transaction.amount}</td>
            <td>${transaction.category}</td>
            <td>${transaction.date}</td>
        `;

        tableBody.appendChild(row);
    });
}

function saveTransactions() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}



function updateDashboard() {

    document.getElementById("totalTransactions")
        .textContent = transactions.length;

    const total = transactions.reduce(
        (sum, t) => sum + t.amount,
        0
    );

    document.getElementById("totalSpending")
        .textContent = total.toFixed(2);

    const categories = {};

    transactions.forEach(t => {
        categories[t.category] =
            (categories[t.category] || 0) + 1;
    });

    let topCategory = "None";
    let highest = 0;

    for (let category in categories) {
        if (categories[category] > highest) {
            highest = categories[category];
            topCategory = category;
        }
    }

    document.getElementById("topCategory")
        .textContent = topCategory;

    const budgetMessage = document.getElementById("budgetMessage");

if (budgetCap > 0) {

    if (total > budgetCap) {

        budgetMessage.textContent =
            `Budget exceeded by $${(total - budgetCap).toFixed(2)}`;

    } else {

        budgetMessage.textContent =
            `Remaining budget: $${(budgetCap - total).toFixed(2)}`;
    }

} else {
    budgetMessage.textContent = "";

}
}
document.getElementById("sortAmount")
.addEventListener("click", () => {

    transactions.sort((a, b) => a.amount - b.amount);

    renderTransactions();
});

document.getElementById("sortDescription")
.addEventListener("click", () => {

    transactions.sort((a, b) =>
        a.description.localeCompare(b.description)
    );

    renderTransactions();
});

document.getElementById("sortDate")
.addEventListener("click", () => {

    transactions.sort((a, b) =>
        new Date(a.date) - new Date(b.date)
    );

    renderTransactions();
});

function compileRegex(pattern, flags = "i") {

    try {
        return new RegExp(pattern, flags);
    }

    catch {
        return null;
    }
}

document.getElementById("searchBtn")
.addEventListener("click", () => {

    const pattern =
        document.getElementById("searchInput").value;

    const ignoreCase =
        document.getElementById("caseInsensitive").checked;

    const regex =
        compileRegex(pattern, ignoreCase ? "i" : "");

    if (!regex) {

        document.getElementById("searchStatus")
            .textContent = "Invalid regex pattern";

        return;
    }

    const filtered = transactions.filter(transaction =>
        regex.test(transaction.description)
    );

    renderTransactions(filtered);

    document.getElementById("searchStatus")
        .textContent =
        `${filtered.length} result(s) found`;
});

document.getElementById("setBudgetBtn")
.addEventListener("click", () => {

    budgetCap = Number(
        document.getElementById("budgetCap").value
    );

    updateDashboard();
});

console.log("Student Finance Tracker Loaded");

const form = document.getElementById("transactionForm");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const description = document.getElementById("description").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    let valid = true;

    const descriptionRegex = /^\S(?:.*\S)?$/;
    const amountRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    const categoryRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
    const duplicateRegex = /\b(\w+)\s+\1\b/i;

    document.getElementById("descriptionError").textContent = "";
    document.getElementById("amountError").textContent = "";
    document.getElementById("categoryError").textContent = "";
    document.getElementById("dateError").textContent = "";

    if (!descriptionRegex.test(description) || duplicateRegex.test(description)) {
        document.getElementById("descriptionError").textContent = "Invalid description";
        valid = false;
    }

    if (!amountRegex.test(amount)) {
        document.getElementById("amountError").textContent = "Invalid amount";
        valid = false;
    }

    if (!categoryRegex.test(category)) {
        document.getElementById("categoryError").textContent = "Invalid category";
        valid = false;
    }

    if (!dateRegex.test(date)) {
        document.getElementById("dateError").textContent = "Invalid date";
        valid = false;
    }

    if (valid) {

    const transaction = {
        id: Date.now(),
        description,
        amount: Number(amount),
        category,
        date,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    transactions.push(transaction);

    saveTransactions();

    renderTransactions();
    updateDashboard();

    document.getElementById("statusMessage").textContent =
        "Transaction added successfully";

    form.reset();
}
});

document.getElementById("budgetCap")
.addEventListener("input", updateDashboard);

renderTransactions();
updateDashboard();
