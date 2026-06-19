console.log("Student Finance Tracker Loaded");const form = document.getElementById("transactionForm");

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
        document.getElementById("statusMessage").textContent =
            "Transaction added successfully";

        form.reset();
    }
});