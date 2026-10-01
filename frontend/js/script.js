// ============================================================
// Personal Expense Tracker - script.js
// Tasks: 1-10
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ============================================================
  // Signup Form
  // ============================================================

  const signupForm = document.getElementById('signupForm');

  if (signupForm) {

    signupForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const fullname = document.getElementById('fullname').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm_password').value;
      const terms = document.getElementById('terms');

      if (fullname.trim() === '') {
        alert('Full Name cannot be empty. Please enter your name.');
        return false;
      }

      if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return false;
      }

      if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return false;
      }

      if (password !== confirmPassword) {
        alert('Password and Confirm Password do not match. Please try again.');
        return false;
      }

      if (!terms.checked) {
        alert('You must accept the Terms and Conditions to continue.');
        return false;
      }

      const userData = {
        fullname: fullname,
        email: email,
        password: password
      };

      localStorage.setItem('user', JSON.stringify(userData));
      alert('Signup successful! Your account has been created.');
      window.location.href = 'login.html';
    });

    function validateEmail(email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    }
  }


  // ============================================================
  // Login Form
  // ============================================================

  const loginForm = document.getElementById('loginForm');

  if (loginForm) {

    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const storedUser = localStorage.getItem('user');

      if (storedUser) {
        const user = JSON.parse(storedUser);

        if (email === user.email && password === user.password) {
          alert('Login successful! Welcome, ' + user.fullname + '!');
          window.location.href = 'dashboard.html';
        } else {
          alert('Invalid email or password. Please try again.');
        }
      } else {
        alert('No account found. Please sign up first.');
      }
    });
  }


  // ============================================================
  // Task 1: Add Transaction with Unique ID (Date.now())
  // Task 3: Edit Transaction Feature
  // Task 10: Data Validation
  // ============================================================

  const transactionForm = document.getElementById('transactionForm');

  if (transactionForm) {

    const editId = getParameterByName('edit');
    if (editId) {
      loadTransactionForEdit(editId);
    }

    transactionForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      const currentEditId = document.getElementById('editId') ? document.getElementById('editId').value : '';
      const type = document.getElementById('type').value;
      const amount = document.getElementById('amount').value;
      const category = document.getElementById('category').value;
      const date = document.getElementById('date').value;
      const description = document.getElementById('description').value;

      // Task 10: Data Validation
      if (type === '') {
        alert('Please select a transaction type (Income or Expense).');
        return false;
      }

      if (amount === '' || parseFloat(amount) <= 0) {
        alert('Amount must be greater than 0. Please enter a valid amount.');
        return false;
      }

      if (category === '') {
        alert('Category cannot be empty. Please select a category.');
        return false;
      }

      if (date === '') {
        alert('Please select a date for the transaction.');
        return false;
      }

      const transactionData = {
        type: type,
        amount: parseFloat(amount),
        category: category,
        date: date,
        description: description
      };

      try {
        if (currentEditId) {
          // Update existing transaction
          const response = await fetch(`http://localhost:5000/api/transactions/${currentEditId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData)
          });

          if (!response.ok) {
            throw new Error('Failed to update transaction');
          }

          alert('Transaction updated successfully!');
        } else {
          // Add new transaction
          const response = await fetch('http://localhost:5000/api/transactions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData)
          });

          if (!response.ok) {
            throw new Error('Failed to add transaction');
          }

          alert('Transaction added successfully!');
        }

        transactionForm.reset();

        if (document.getElementById('editId')) {
          document.getElementById('editId').value = '';
        }

        const submitBtn = transactionForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.textContent = 'Add Transaction';
        }

        window.location.href = 'transactions.html';
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    });
  }

  async function loadTransactionForEdit(id) {
    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transaction details');
      }
      const transaction = await response.json();

      if (transaction) {
        document.getElementById('type').value = transaction.type;
        document.getElementById('amount').value = transaction.amount;
        document.getElementById('category').value = transaction.category;
        document.getElementById('date').value = transaction.date;
        document.getElementById('description').value = transaction.description;

        if (document.getElementById('editId')) {
          document.getElementById('editId').value = transaction.id;
        }

        const submitBtn = transactionForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.textContent = 'Update Transaction';
        }
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  function getParameterByName(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }


  // ============================================================
  // Task 2: Delete Transaction
  // Task 4: Search Transactions
  // Task 5: Filter Transactions
  // Task 6: Sort Transactions
  // ============================================================

  const tableBody = document.getElementById('transactionTableBody');
  const searchInput = document.getElementById('searchInput');
  const filterType = document.getElementById('filterType');
  const sortOption = document.getElementById('sortOption');

  if (tableBody) {

    if (searchInput) {
      searchInput.addEventListener('input', loadTransactions);
    }

    if (filterType) {
      filterType.addEventListener('change', loadTransactions);
    }

    if (sortOption) {
      sortOption.addEventListener('change', loadTransactions);
    }

    async function loadTransactions() {
      tableBody.innerHTML = '';

      let transactions = [];
      try {
        const response = await fetch('http://localhost:5000/api/transactions');
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        transactions = await response.json();
      } catch (error) {
        console.error(error);
      }

      // Task 4: Search by category or description
      if (searchInput && searchInput.value.trim() !== '') {
        const searchTerm = searchInput.value.toLowerCase().trim();
        transactions = transactions.filter(function (t) {
          return t.category.toLowerCase().includes(searchTerm) ||
                 (t.description && t.description.toLowerCase().includes(searchTerm));
        });
      }

      // Task 5: Filter by transaction type
      if (filterType && filterType.value !== 'all') {
        const filterValue = filterType.value.toLowerCase();
        transactions = transactions.filter(function (t) {
          return t.type.toLowerCase() === filterValue;
        });
      }

      // Task 6: Sort transactions
      if (sortOption) {
        const sortValue = sortOption.value;
        if (sortValue === 'date-newest') {
          transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortValue === 'date-oldest') {
          transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sortValue === 'amount-high') {
          transactions.sort((a, b) => b.amount - a.amount);
        } else if (sortValue === 'amount-low') {
          transactions.sort((a, b) => a.amount - b.amount);
        }
      }

      if (transactions.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.setAttribute('colspan', '7');
        cell.textContent = 'No transactions found.';
        cell.style.textAlign = 'center';
        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
      }

      for (let i = 0; i < transactions.length; i++) {
        const t = transactions[i];
        const row = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.textContent = t.id;
        row.appendChild(idCell);

        const dateCell = document.createElement('td');
        dateCell.textContent = t.date;
        row.appendChild(dateCell);

        const typeCell = document.createElement('td');
        typeCell.textContent = t.type;
        row.appendChild(typeCell);

        const categoryCell = document.createElement('td');
        categoryCell.textContent = t.category;
        row.appendChild(categoryCell);

        const amountCell = document.createElement('td');
        amountCell.textContent = 'Rs: ' + t.amount.toFixed(2);
        row.appendChild(amountCell);

        const descCell = document.createElement('td');
        descCell.textContent = t.description;
        row.appendChild(descCell);

        const actionCell = document.createElement('td');

        // Task 3: Edit Button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.style.backgroundColor = '#2980b9';
        editButton.style.color = '#ffffff';
        editButton.style.border = 'none';
        editButton.style.padding = '6px 12px';
        editButton.style.borderRadius = '4px';
        editButton.style.cursor = 'pointer';
        editButton.style.marginRight = '5px';
        editButton.addEventListener('click', function () {
          window.location.href = 'add-transaction.html?edit=' + t.id;
        });
        actionCell.appendChild(editButton);

        // Task 2: Delete Button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.backgroundColor = '#e74c3c';
        deleteButton.style.color = '#ffffff';
        deleteButton.style.border = 'none';
        deleteButton.style.padding = '6px 12px';
        deleteButton.style.borderRadius = '4px';
        deleteButton.style.cursor = 'pointer';
        deleteButton.addEventListener('click', function () {
          deleteTransaction(t.id);
        });
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);
        tableBody.appendChild(row);
      }
    }

    async function deleteTransaction(id) {
      if (confirm('Are you sure you want to delete this transaction?')) {
        try {
          const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
            method: 'DELETE'
          });

          if (!response.ok) {
            throw new Error('Failed to delete transaction');
          }

          loadTransactions();
          alert('Transaction deleted successfully!');
        } catch (error) {
          console.error(error);
          alert(error.message);
        }
      }
    }

    loadTransactions();
  }


  // ============================================================
  // Task 7: Category Statistics
  // Task 8: Recent Transactions Section
  // Task 9: Monthly Summary
  // ============================================================

  const totalIncomeEl = document.getElementById('totalIncome');
  const totalExpensesEl = document.getElementById('totalExpenses');
  const remainingBalanceEl = document.getElementById('remainingBalance');
  const categoryStatsEl = document.getElementById('categoryStats');
  const recentTransactionsEl = document.getElementById('recentTransactions');
  const monthlyIncomeEl = document.getElementById('monthlyIncome');
  const monthlyExpensesEl = document.getElementById('monthlyExpenses');
  const monthlyBalanceEl = document.getElementById('monthlyBalance');

  if (totalIncomeEl && totalExpensesEl && remainingBalanceEl) {

    async function updateDashboard() {
      let transactions = [];
      try {
        const response = await fetch('http://localhost:5000/api/transactions');
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        transactions = await response.json();
      } catch (error) {
        console.error(error);
      }

      let totalIncome = 0;
      let totalExpenses = 0;
      let categoryTotals = {};

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      let monthlyIncome = 0;
      let monthlyExpenses = 0;

      for (let i = 0; i < transactions.length; i++) {
        const t = transactions[i];
        const tDate = new Date(t.date);
        const isCurrentMonth = tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;

        const tTypeLower = t.type.toLowerCase();
        if (tTypeLower === 'income') {
          totalIncome += t.amount;
          if (isCurrentMonth) monthlyIncome += t.amount;

        } else if (tTypeLower === 'expense') {
          totalExpenses += t.amount;
          if (isCurrentMonth) monthlyExpenses += t.amount;

          // Task 7: Category totals
          categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        }
      }

      const remainingBalance = totalIncome - totalExpenses;
      const monthlyBalance = monthlyIncome - monthlyExpenses;

      totalIncomeEl.textContent = 'Rs: ' + totalIncome.toFixed(2);
      totalExpensesEl.textContent = 'Rs: ' + totalExpenses.toFixed(2);
      remainingBalanceEl.textContent = 'Rs: ' + remainingBalance.toFixed(2);

      // Task 9: Monthly Summary
      if (monthlyIncomeEl && monthlyExpensesEl && monthlyBalanceEl) {
        monthlyIncomeEl.textContent = 'Rs: ' + monthlyIncome.toFixed(2);
        monthlyExpensesEl.textContent = 'Rs: ' + monthlyExpenses.toFixed(2);
        monthlyBalanceEl.textContent = 'Rs: ' + monthlyBalance.toFixed(2);
      }

      // Task 7: Category Statistics
      if (categoryStatsEl) {
        categoryStatsEl.innerHTML = '';
        const categories = Object.keys(categoryTotals);

        if (categories.length === 0) {
          const p = document.createElement('p');
          p.textContent = 'No expense data available.';
          categoryStatsEl.appendChild(p);
        } else {
          categories.forEach(function (category) {
            const p = document.createElement('p');
            p.textContent = category + ': Rs: ' + categoryTotals[category].toFixed(2);
            p.style.padding = '8px';
            p.style.margin = '5px 0';
            p.style.backgroundColor = '#f8f9fa';
            p.style.borderRadius = '4px';
            p.style.borderLeft = '4px solid #2980b9';
            categoryStatsEl.appendChild(p);
          });
        }
      }

      // Task 8: Recent Transactions (latest 5)
      if (recentTransactionsEl) {
        recentTransactionsEl.innerHTML = '';
        const recentFive = [...transactions]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        if (recentFive.length === 0) {
          const p = document.createElement('p');
          p.textContent = 'No transactions yet.';
          recentTransactionsEl.appendChild(p);
        } else {
          recentFive.forEach(function (t) {
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.style.padding = '10px';
            div.style.margin = '5px 0';
            div.style.backgroundColor = '#f8f9fa';
            div.style.borderRadius = '4px';
            div.style.borderLeft = t.type.toLowerCase() === 'income' ? '4px solid #27ae60' : '4px solid #e74c3c';

            const leftSpan = document.createElement('span');
            leftSpan.textContent = t.category;
            leftSpan.style.fontWeight = 'bold';

            const rightSpan = document.createElement('span');
            rightSpan.textContent = (t.type.toLowerCase() === 'income' ? '+ ' : '- ') + 'Rs: ' + t.amount.toFixed(2);
            rightSpan.style.color = t.type.toLowerCase() === 'income' ? '#27ae60' : '#e74c3c';

            div.appendChild(leftSpan);
            div.appendChild(rightSpan);
            recentTransactionsEl.appendChild(div);
          });
        }
      }
    }

    updateDashboard();
  }

}); // end DOMContentLoaded