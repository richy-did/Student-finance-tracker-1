let budgetCap = 0;
let editId = null;

const STORAGE_KEY = "finance_transactions";
let transactions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

/* -----------------------------
   SAVE TO LOCAL STORAGE
------------------------------*/
function saveTransactions() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

/* -----------------------------
   RENDER TRANSACTIONS
------------------------------*/
function renderTransactions(data = transactions) {

    const tableBody = document.getElementById("transactionTableBody");
    tableBody.innerHTML = "";

    data.forEach(transaction => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${transaction.description}</td>
            <td>${transaction.amount}</td>
            <td>${transaction.category}</td>
            <td>${transaction.date}</td>
            <td>
                <button class="editBtn" data-id="${transaction.id}">Edit</button>
                <button class="deleteBtn" data-id="${transaction.id}">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

/* -----------------------------
   DASHBOARD
------------------------------*/
function updateDashboard() {

    document.getElementById("totalTransactions").textContent = transactions.length;

    const total = transactions.reduce((sum, t) => sum + t.amount, 0);

    document.getElementById("totalSpending").textContent = total.toFixed(2);

    const categories = {};

    transactions.forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + 1;
    });

    let topCategory = "None";
    let highest = 0;

    for (let cat in categories) {
        if (categories[cat] > highest) {
            highest = categories[cat];
            topCategory = cat;
        }
    }

    document.getElementById("topCategory").textContent = topCategory;

    // Budget message
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

/* -----------------------------
   SORTING
------------------------------*/
document.getElementById("sortAmount").addEventListener("click", () => {
    transactions.sort((a, b) => a.amount - b.amount);
    renderTransactions();
});

document.getElementById("sortDescription").addEventListener("click", () => {
    transactions.sort((a, b) => a.description.localeCompare(b.description));
    renderTransactions();
});

document.getElementById("sortDate").addEventListener("click", () => {
    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
    renderTransactions();
});

/* -----------------------------
   SAFE REGEX
------------------------------*/
function compileRegex(pattern, flags = "i") {
    try {
        return new RegExp(pattern, flags);
    } catch {
        return null;
    }
}

/* -----------------------------
   SEARCH
------------------------------*/
document.getElementById("searchBtn").addEventListener("click", () => {

    const pattern = document.getElementById("searchInput").value;
    const ignoreCase = document.getElementById("caseInsensitive").checked;

    const regex = compileRegex(pattern, ignoreCase ? "i" : "");

    if (!regex) {
        document.getElementById("searchStatus").textContent =
            "Invalid regex pattern";
        return;
    }

    const filtered = transactions.filter(t => regex.test(t.description));

    renderTransactions(filtered);

    document.getElementById("searchStatus").textContent =
        `${filtered.length} result(s) found`;
});

/* -----------------------------
   BUDGET CAP
------------------------------*/
document.getElementById("setBudgetBtn").addEventListener("click", () => {
    budgetCap = Number(document.getElementById("budgetCap").value);
    updateDashboard();
});

/* -----------------------------
   FORM SUBMIT (ADD + EDIT)
------------------------------*/
const form = document.getElementById("transactionForm");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const description = document.getElementById("description").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    const descriptionRegex = /^\S(?:.*\S)?$/;
    const amountRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    const categoryRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
    const duplicateRegex = /\b(\w+)\s+\1\b/i;

    if (
        !descriptionRegex.test(description) ||
        duplicateRegex.test(description) ||
        !amountRegex.test(amount) ||
        !categoryRegex.test(category) ||
        !dateRegex.test(date)
    ) {
        document.getElementById("statusMessage").textContent =
            "Invalid input detected";
        return;
    }

    if (editId !== null) {

        const index = transactions.findIndex(t => t.id === editId);

        transactions[index] = {
            ...transactions[index],
            description,
            amount: Number(amount),
            category,
            date,
            updatedAt: new Date().toISOString()
        };

        editId = null;

    } else {

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
    }

    saveTransactions();
    renderTransactions();
    updateDashboard();

    document.getElementById("statusMessage").textContent =
        "Transaction saved successfully";

    form.reset();
});

/* -----------------------------
   DELETE + EDIT
------------------------------*/
document.addEventListener("click", (e) => {

    if (e.target.classList.contains("deleteBtn")) {

        const id = Number(e.target.dataset.id);

        transactions = transactions.filter(t => t.id !== id);

        saveTransactions();
        renderTransactions();
        updateDashboard();
    }

    if (e.target.classList.contains("editBtn")) {

        const id = Number(e.target.dataset.id);

        const t = transactions.find(t => t.id === id);

        document.getElementById("description").value = t.description;
        document.getElementById("amount").value = t.amount;
        document.getElementById("category").value = t.category;
        document.getElementById("date").value = t.date;

        editId = id;
    }
});

/* -----------------------------
   INIT
------------------------------*/
renderTransactions();
updateDashboard();