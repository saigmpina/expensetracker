let myChart; // Define a variable to store the chart instance

document.addEventListener("DOMContentLoaded", function () {
    loadExpenses();
    loadChart();
});

function loadExpenses() {
    const expenseTableBody = document.getElementById("expense-table-body");
    expenseTableBody.innerHTML = "";

    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    expenses.forEach((expense) => {
        const row = expenseTableBody.insertRow();
        row.insertCell().textContent = expense.date;
        row.insertCell().textContent = expense.category;
        row.insertCell().textContent = expense.description;
        row.insertCell().textContent = expense.amount;
    });
}

function addExpense() {
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    const amount = document.getElementById("amount").value;
    const transactionType = document.querySelector('input[name="transactionType"]:checked').value;

    const newExpense = { date, category, description, amount, type: transactionType };

    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.push(newExpense);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    loadExpenses();
    loadChart();
}

function loadChart() {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    const categories = [];
    const debitAmounts = [];
    const creditAmounts = [];

    expenses.forEach((expense) => {
        categories.push(expense.category);

        if (expense.type === "debit") {
            debitAmounts.push(parseFloat(expense.amount));
            creditAmounts.push(null); // Placeholder for credits
        } else {
            debitAmounts.push(null); // Placeholder for debits
            creditAmounts.push(parseFloat(expense.amount));
        }
    });

    const ctx = document.getElementById("expenseChart").getContext("2d");

    // Destroy the existing chart if it exists
    if (myChart) {
        myChart.destroy();
    }

    // Create a new chart instance
    myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: categories,
            datasets: [
                {
                    label: "Debit",
                    data: debitAmounts,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: "Credit",
                    data: creditAmounts,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
