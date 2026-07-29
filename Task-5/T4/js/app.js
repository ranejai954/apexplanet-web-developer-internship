// ============================================
// EXPENSE TRACKER - Full CRUD + Charts
// ============================================

// ===== State =====
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let editingId = null;
let categoryChart = null;

// ===== DOM Elements =====
const description = document.getElementById('description');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const type = document.getElementById('type');
const addBtn = document.getElementById('addBtn');
const expenseList = document.getElementById('expenseList');
const totalIncome = document.getElementById('totalIncome');
const totalExpense = document.getElementById('totalExpense');
const balance = document.getElementById('balance');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const typeFilter = document.getElementById('typeFilter');
const transactionCount = document.getElementById('transactionCount');
const chartEmpty = document.getElementById('chartEmpty');

// ===== Event Listeners =====
addBtn.addEventListener('click', addOrUpdateTransaction);
searchInput.addEventListener('input', debounce(renderTransactions, 300));
categoryFilter.addEventListener('change', renderTransactions);
typeFilter.addEventListener('change', renderTransactions);

// Enter key support
description.addEventListener('keypress', (e) => { if (e.key === 'Enter') amount.focus(); });
amount.addEventListener('keypress', (e) => { if (e.key === 'Enter') addOrUpdateTransaction(); });

// ===== CRUD Operations =====

// CREATE
function addOrUpdateTransaction() {
    const desc = description.value.trim();
    const amt = parseFloat(amount.value);
    const cat = category.value;
    const typ = type.value;

    if (!desc || !amt || amt <= 0) {
        alert('⚠️ Please fill in all fields correctly!');
        return;
    }

    if (editingId) {
        // UPDATE
        const index = transactions.findIndex(t => t.id === editingId);
        if (index !== -1) {
            transactions[index] = { ...transactions[index], description: desc, amount: amt, category: cat, type: typ };
        }
        editingId = null;
        addBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
    } else {
        // CREATE
        const transaction = {
            id: Date.now(),
            description: desc,
            amount: amt,
            category: cat,
            type: typ,
            date: new Date().toLocaleDateString()
        };
        transactions.push(transaction);
    }

    saveToLocalStorage();
    renderTransactions();
    clearForm();
}

// READ
function renderTransactions() {
    const search = searchInput.value.toLowerCase();
    const catFilter = categoryFilter.value;
    const typeFilterValue = typeFilter.value;

    let filtered = transactions;

    if (search) {
        filtered = filtered.filter(t => t.description.toLowerCase().includes(search));
    }
    if (catFilter) {
        filtered = filtered.filter(t => t.category === catFilter);
    }
    if (typeFilterValue) {
        filtered = filtered.filter(t => t.type === typeFilterValue);
    }

    filtered.sort((a, b) => b.id - a.id);

    // Update transaction count
    transactionCount.textContent = `${filtered.length} transactions`;

    if (filtered.length === 0) {
        expenseList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>${transactions.length === 0 ? 'No transactions yet. Add your first one above!' : 'No transactions match your filters.'}</p>
            </div>
        `;
        updateStats();
        updateChart();
        return;
    }

    expenseList.innerHTML = filtered.map(t => {
        const sign = t.type === 'income' ? '+' : '-';
        const amountClass = t.type === 'income' ? 'income' : 'expense';
        return `
            <div class="expense-item">
                <div class="left">
                    <span><strong>${t.description}</strong></span>
                    <span class="category">${t.category}</span>
                    <span class="date">${t.date || 'Today'}</span>
                </div>
                <div style="display:flex;align-items:center;gap:15px;flex-wrap:wrap;">
                    <span class="amount ${amountClass}">${sign}₹${t.amount.toFixed(2)}</span>
                    <div class="actions">
                        <button class="btn btn-success btn-sm" onclick="editTransaction(${t.id})" aria-label="Edit transaction">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteTransaction(${t.id})" aria-label="Delete transaction">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    updateStats();
    updateChart();
}

// UPDATE
function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    description.value = transaction.description;
    amount.value = transaction.amount;
    category.value = transaction.category;
    type.value = transaction.type;
    editingId = id;
    addBtn.innerHTML = '<i class="fas fa-save"></i> Update';
    description.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// DELETE
function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveToLocalStorage();
        renderTransactions();
    }
}

// ===== Stats =====
function updateStats() {
    const totalIncomeAmount = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenseAmount = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balanceAmount = totalIncomeAmount - totalExpenseAmount;

    totalIncome.textContent = `₹${totalIncomeAmount.toFixed(2)}`;
    totalExpense.textContent = `₹${totalExpenseAmount.toFixed(2)}`;
    balance.textContent = `₹${balanceAmount.toFixed(2)}`;
    balance.style.color = balanceAmount >= 0 ? '#22c55e' : '#ef4444';
}

// ===== CHART.JS - Spending Breakdown =====
function updateChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    // Get expense data by category
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals = {};

    expenses.forEach(t => {
        if (categoryTotals[t.category]) {
            categoryTotals[t.category] += t.amount;
        } else {
            categoryTotals[t.category] = t.amount;
        }
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    const colors = [
        '#facc15', '#ef4444', '#22c55e', '#3b82f6',
        '#8b5cf6', '#f59e0b', '#ec4899'
    ];

    // Show/hide empty message
    if (chartEmpty) {
        chartEmpty.style.display = labels.length === 0 ? 'block' : 'none';
    }

    if (categoryChart) {
        categoryChart.destroy();
        categoryChart = null;
    }

    if (labels.length === 0) {
        return;
    }

    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: '#1e293b',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e2e8f0',
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// ===== Helpers =====
function saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function clearForm() {
    description.value = '';
    amount.value = '';
    category.value = 'Food';
    type.value = 'expense';
    editingId = null;
    addBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
}

// ===== DEBOUNCING =====
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// ===== THROTTLING =====
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== Initialize =====
renderTransactions();

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        clearForm();
    }
});

// ===== Infinite Scroll =====
let loadMoreCount = 10;
const expenseListElement = document.getElementById('expenseList');

expenseListElement.addEventListener('scroll', throttle(() => {
    if (expenseListElement.scrollTop + expenseListElement.clientHeight >= expenseListElement.scrollHeight - 50) {
        // Show more items if available
        const allItems = expenseListElement.querySelectorAll('.expense-item');
        if (allItems.length > 0 && allItems.length < transactions.length) {
            // Just re-render - simple approach
            renderTransactions();
        }
    }
}, 500));

console.log('💰 Expense Tracker Loaded!');
console.log(`📊 ${transactions.length} transactions found.`);
console.log('📈 Chart.js ready!');
