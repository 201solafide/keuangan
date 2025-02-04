let balance = 0;
let transactions = [];


document.addEventListener("DOMContentLoaded", function() {
    const hariList = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const tanggalSekarang = new Date();
    document.querySelectorAll(".hari").forEach(el => {
        el.innerText = hariList[tanggalSekarang.getDay()];
    });

    document.querySelectorAll(".tgl").forEach(el => {
        el.innerText = tanggalSekarang.toLocaleDateString("id-ID");
    });

    loadData();
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
        let today = new Date().toLocaleDateString("id-ID");
        balance += income;
        transactions.push({ type: 'income', amount: income, description: 'Pemasukan', date: today });
        saveData();
        alert('Pemasukkan berhasil ditambahkan!');
        showBalance();
    }
    document.getElementById('income').value = '';
}

function addExpense() {
    let expense = parseInt(document.getElementById('expense').value);
    let desc = document.getElementById('description').value || 'Pengeluaran';
    if (!isNaN(expense) && expense <= balance) {
        let today = new Date().toLocaleDateString("id-ID");
        balance -= expense;
        transactions.push({ type: 'expense', amount: expense, description: desc, date: today });
        saveData();
        alert('Pengeluaran berhasil ditambahkan!');
        showBalance();
    } else {
        alert('Saldo tidak cukup!');
    }
    document.getElementById('expense').value = '';
    document.getElementById('description').value = '';
}

function showBalance() {
    let historyDiv = document.getElementById('history');

    // Jika historyDiv sedang ditampilkan, maka sembunyikan (toggle)
    if (historyDiv.style.display === "block") {
        historyDiv.style.display = "none";
        return;
    }

    // Jika belum ada transaksi, beri pesan kosong
    if (transactions.length === 0) {
        historyDiv.innerHTML = "<p>Tidak ada riwayat transaksi.</p>";
    } else {
        historyDiv.innerHTML = "<h5>Riwayat Transaksi</h5>";
        transactions.forEach(t => {
            historyDiv.innerHTML += `<p>${t.date} |=| ${t.description}: Rp${t.amount}</p>`;
        });
        historyDiv.innerHTML += `<h4>Saldo Saat Ini: Rp${balance}</h4>`;
    }

    // Buat tombol Hide secara dinamis
    let hideButton = document.createElement("button");
    hideButton.innerText = "Hide";
    hideButton.style.marginRight = "5px";
    hideButton.addEventListener("click", function () {
        historyDiv.style.display = "none";
    });

    // Buat tombol Hapus secara dinamis
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Hapus";
    deleteButton.style.marginLeft = "5px";
    deleteButton.addEventListener("click", function () {
        if (confirm("Apakah Anda yakin ingin menghapus semua transaksi?")) {
            transactions = [];
            balance = 0;
            saveData(); // Simpan perubahan ke localStorage
            showBalance(); // Refresh tampilan
        }
    });

    // Tambahkan tombol ke historyDiv
    historyDiv.appendChild(hideButton);
    historyDiv.appendChild(deleteButton);

    // Pastikan history ditampilkan
    historyDiv.style.display = "block";
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

    // ctx.innerHTML += '<button style="margin-right:2px;">Hide </button>';
    // ctx.innerHTML += '<button style="margin-left:2px;">Hapus </button>';
}
