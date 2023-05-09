let budget = document.getElementById("budget");
const budgetSaveBtn = document.getElementById("budgetSaveBtn");
const errorMessage = document.getElementById("errorMessage");
let expenseName = document.getElementById("expenseName");
let expenseAmount = document.getElementById("expenseAmount");
const addExpenseBtn = document.getElementById("addExpenseBtn");
const budgetAmount = document.getElementById("budgetAmount");
const expenseError = document.getElementById("expenseError");
const expenses = document.getElementById("expensesAmount");
const balanceAmount = document.getElementById("balanceAmount");
const list = document.getElementById("list");

let butce = 0;
let harcamalar = [];
let toplamHarcama = 0;

document.addEventListener("DOMContentLoaded", () => {
  getButce();
  getHarcamalar();
});

const getButce = () => {
  let _butce = localStorage.getItem("butce");
  if (_butce) {
    butce = _butce;
  }
  budgetAmount.innerText = butce;
};

const getHarcamalar = () => {
  harcamalar = JSON.parse(localStorage.getItem("harcamalar"));
  if (harcamalar) {
    harcamalar.forEach((harcama) => {
      const { harcamaAdi, harcamaTutar, tarih, count } = harcama;
      harcamaYazdir(harcamaAdi, harcamaTutar, tarih, count);
    });
  } else {
    harcamalar = [];
  }
  totalHarcama();
};

const totalHarcama = () => {
  toplamHarcama = 0;
  harcamalar.forEach((harcama) => {
    const { harcamaTutar } = harcama;
    toplamHarcama += harcamaTutar;
  });
  if (toplamHarcama) {
    expenses.textContent = toplamHarcama;
  } else {
    toplamHarcama = 0;
  }
  const balance = butce - toplamHarcama;
  balanceAmount.innerText = balance;
};
// {harcamaAdi: 'zort', harcamaTutar: 1000, count:1, tarih: '12387123'}

addExpenseBtn.addEventListener("click", () => {
  let harcamaAdi = expenseName.value;
  let harcamaTutar = parseInt(expenseAmount.value);

  let currentdate = new Date();
  let formattedToday =
    currentdate.getDate() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getFullYear() +
    " " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();

  let buEklenmisMi = false;

  harcamalar.forEach((harcama) => {
    const { harcamaAdi: _harcamaAdi } = harcama;
    if (harcamaAdi === _harcamaAdi) {
      buEklenmisMi = true;
      harcama.count++;
      harcama.harcamaTutar += harcamaTutar;
      harcama.tarih = formattedToday;
      localStorage.setItem("harcamalar", JSON.stringify(harcamalar));
      location.reload();
    }
  });

  if (!buEklenmisMi) {
    harcamaYazdir(harcamaAdi, harcamaTutar, formattedToday, 1);
    harcamalar.push({
      harcamaAdi: harcamaAdi,
      harcamaTutar: harcamaTutar,
      count: 1,
      tarih: formattedToday,
    });
  }

  //  ekrana yazdıracağımız alan
  localStorage.setItem("harcamalar", JSON.stringify(harcamalar));
  totalHarcama();
  expenseName.value = "";
  expenseAmount.value = "";
});

budgetSaveBtn.addEventListener("click", () => {
  butce = budget.value;
  localStorage.setItem("butce", butce);
  budgetAmount.innerText = butce;
  totalHarcama();
});

const harcamaYazdir = (harcamaAdi, harcamaTutar, tarih, count) => {
  let sublistContent = document.createElement("div");
  sublistContent.classList.add("grid", "grid-cols-4");
  list.appendChild(sublistContent);

  sublistContent.innerHTML = `<p id="product class="col-span-1">${harcamaAdi}${
    count > 1 ? ` (${count}x)` : ""
  }</p><p id="amount" class="col-span-1">${harcamaTutar}</p><p id="date" class="col-span-1">${tarih}</p>`;

  let deleteBtn = document.createElement("button");
  deleteBtn.classList.add("col-span-1", "flex", "justify-self-end");
  deleteBtn.innerHTML = `<svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.8334 5V16.6667C12.8334 17.1087 12.6578 17.5326 12.3452 17.8452C12.0326 18.1577 11.6087 18.3333 11.1667 18.3333H2.83335C2.39133 18.3333 1.9674 18.1577 1.65484 17.8452C1.34228 17.5326 1.16669 17.1087 1.16669 16.6667V5M3.66669 5V3.33333C3.66669 2.89131 3.84228 2.46738 4.15484 2.15482C4.4674 1.84226 4.89133 1.66667 5.33335 1.66667H8.66669C9.10871 1.66667 9.53264 1.84226 9.8452 2.15482C10.1578 2.46738 10.3334 2.89131 10.3334 3.33333V5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>  `;

  deleteBtn.onclick = function () {
    harcamalar.forEach((harcama, index) => {
      if (harcamaAdi === harcama.harcamaAdi) {
        harcamalar.splice(index, 1);
      }
    });
    localStorage.setItem("harcamalar", JSON.stringify(harcamalar));
    location.reload();
  };

  sublistContent.appendChild(deleteBtn);
};
