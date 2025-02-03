let balance = 0;
let transactions = [];


document.addEventListener("DOMContentLoaded", function() {
    const hariList = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const tanggalSekarang = new Date();
    document.getElementById("hari").innerText = hariList[tanggalSekarang.getDay()];
    document.getElementById("tgl").innerText = tanggalSekarang.toLocaleDateString("id-ID");
});

function saveData() {
    localStorage.setItem('balance', balance);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function loadData() {
    balance = parseInt(localStorage.getItem('balance')) || 0;
    transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    showBalance();
}

function addIncome() {
    let income = parseInt(document.getElementById('income').value);
    if (!isNaN(income)) {
        balance += income;
        transactions.push({ type: 'income', amount: income, description: 'Pemasukan' });
        saveData();
        alert('Pemasukkan berhasil ditambahkan!');
    }
    document.getElementById('income').value = '';
}

function addExpense() {
    let expense = parseInt(document.getElementById('expense').value);
    let desc = document.getElementById('description').value || 'Pengeluaran';
    if (!isNaN(expense) && expense <= balance) {
        balance -= expense;
        transactions.push({ type: 'expense', amount: expense, description: desc });
        saveData();
        alert('Pengeluaran berhasil ditambahkan!');
    } else {
        alert('Saldo tidak cukup!');
    }
    document.getElementById('expense').value = '';
    document.getElementById('description').value = '';
}

function showBalance() {
    let historyDiv = document.getElementById('history');
    historyDiv.innerHTML = '<h5>Riwayat Transaksi</h5>';
    transactions.forEach(t => {
        historyDiv.innerHTML += `<p>${t.description}: Rp${t.amount}</p>`;
    });
    historyDiv.innerHTML += `<h4>Saldo Saat Ini: Rp${balance}</h4>`;
}

function showChart() {
    let ctx = document.getElementById('expenseChart').getContext('2d');
    let incomeTotal = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    let expenseTotal = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Pemasukan', 'Pengeluaran'],
            datasets: [{
                label: 'Keuangan',
                data: [incomeTotal, expenseTotal],
                backgroundColor: ['green', 'red']
            }]
        }
    });
}
