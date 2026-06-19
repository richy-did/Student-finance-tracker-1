# Student Finance Tracker

## Overview
This is a simple Student Finance Tracker built using HTML, CSS, and JavaScript.

It allows users to:
- Add transactions (income/expenses)
- Edit and delete transactions
- Search using regex
- Sort data (date, amount, description)
- View dashboard stats
- Set a budget cap
- Save data in localStorage

---

## Features

### Transactions
- Add new transaction
- Edit existing transaction
- Delete transaction
- Persistent storage using localStorage

### Dashboard
- Total transactions counter
- Total spending calculation
- Top spending category
- Budget tracking (remaining or exceeded)

### Search
- Regex-based search
- Case-insensitive toggle
- Live result feedback

### Sorting
- Sort by amount
- Sort by description
- Sort by date

---

## Regex Validation Rules

### Description
^\S(?:.*\S)?$
Prevents leading and trailing spaces

### Amount
^(0|[1-9]\d*)(\.\d{1,2})?$
Allows numbers with up to 2 decimal places

### Date
^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$
Validates YYYY-MM-DD format

### Category
^[A-Za-z]+(?:[ -][A-Za-z]+)*$
Only letters, spaces, and hyphens allowed

### Advanced Regex (Duplicate Words)
\b(\w+)\s+\1\b
Detects repeated words like "coffee coffee"

---

## Keyboard Navigation

- Tab: Move between inputs
- Enter: Submit form or activate buttons
- Space: Activate buttons

---

## Accessibility Features

- Semantic HTML structure (header, main, section, footer)
- Proper form labels
- ARIA live region for budget updates
- Keyboard navigation supported
- Inline error messages for validation

---

## How to Run

1. Open project folder
2. Open index.html in browser
3. Start adding transactions

---

## Data Storage

All data is saved in browser localStorage:

finance_transactions

---

## Author
Munezero jean pierre