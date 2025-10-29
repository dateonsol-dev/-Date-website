// === Default Configuration ===
const defaultConfig = {
  coin_name: "$Date",
  tagline: "The Future of Time-Based Trading",
  about_text:
    "$Date is a revolutionary time-based cryptocurrency that brings temporal mechanics to DeFi. Each token represents a unique moment in time, creating scarcity through chronological progression. Built on cutting-edge blockchain technology, $Date offers holders the opportunity to literally own time itself.",
};

// === Calendar Setup ===
let currentMonth = 9; // October (0-indexed)
let currentYear = 2025;

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

// === Facts (month-based structure) ===
// Each key is "YYYY-MM" for clarity and future-proofing
let dateFacts = {}; // initially empty

async function loadFacts() {
  try {
    const response = await fetch("facts.json");
    dateFacts = await response.json();
    console.log("Facts loaded:", dateFacts);

    // After loading facts, find the first available month and build the calendar
    const monthsWithFacts = Object.keys(dateFacts);
    if (monthsWithFacts.length > 0) {
      const [y, m] = monthsWithFacts[0].split("-").map(Number);
      currentYear = y;
      currentMonth = m - 1;
    }
    updateCalendar();
  } catch (error) {
    console.error("Error loading facts.json:", error);
  }
}


// === Utility: Get month info automatically ===
function getMonthInfo(month, year) {
  // JavaScript getDay(): Sunday = 0 → we shift so Monday = 0
  let startDay = new Date(year, month, 1).getDay(); 
  startDay = (startDay + 6) % 7; // shift: Monday=0, Sunday=6
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { startDay, days: daysInMonth };
}

// === Copy Contract Address ===
function copyAddress() {
  const addressInput = document.getElementById("contract-address");
  const copyBtn = document.getElementById("copy-btn");

  addressInput.select();
  document.execCommand("copy");

  copyBtn.textContent = "Copied!";
  copyBtn.classList.add("copy-success");

  setTimeout(() => {
    copyBtn.textContent = "Copy";
    copyBtn.classList.remove("copy-success");
  }, 2000);
}

// === Calendar Navigation ===
function previousMonth() {
  const months = Object.keys(dateFacts).sort();
  const currentKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;
  const currentIndex = months.indexOf(currentKey);

  // if not found or already at first, do nothing
  if (currentIndex <= 0) return;

  const [y, m] = months[currentIndex - 1].split("-").map(Number);
  currentYear = y;
  currentMonth = m - 1;
  updateCalendar();
}

function nextMonth() {
  const months = Object.keys(dateFacts).sort();
  const currentKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;
  const currentIndex = months.indexOf(currentKey);

  // if not found or already at last, do nothing
  if (currentIndex === -1 || currentIndex >= months.length - 1) return;

  const [y, m] = months[currentIndex + 1].split("-").map(Number);
  currentYear = y;
  currentMonth = m - 1;
  updateCalendar();
}


function isAtStart() {
  return currentYear <= 2020 && currentMonth === 0; // safety stop
}
function isAtEnd() {
  return currentYear >= 2030 && currentMonth === 11; // safety stop
}

function hasFactsForMonth(year, month) {
  const key = `${year}-${String(month + 1).padStart(2, "0")}`;
  return !!dateFacts[key];
}

// === Generate Calendar ===
function updateCalendar() {
  const key = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;
  document.getElementById("calendar-month").textContent =
    `${monthNames[currentMonth]} ${currentYear}`;
  generateCalendar(key);
  document.getElementById("fact-display").classList.add("hidden");
}

function generateCalendar(monthKey) {
  const grid = document.getElementById("calendar-grid");
  grid.innerHTML = "";

  const { days, startDay } = getMonthInfo(currentMonth, currentYear);
  const monthFacts = dateFacts[monthKey] || {};

  // Empty cells before first Monday
  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement("div");
    grid.appendChild(empty);
  }

  // Add each day
  for (let day = 1; day <= days; day++) {
    const cell = document.createElement("div");
    cell.className = "flex items-center justify-center h-12 rounded-lg transition";

    if (monthFacts[day]) {
      cell.textContent = day;
      cell.classList.add("bg-pink-600", "cursor-pointer", "hover:bg-pink-700", "text-white");
      cell.onclick = () => showFact(day, monthKey);
    } else {
      cell.textContent = day;
      cell.classList.add("bg-gray-700", "text-gray-400");
    }

    grid.appendChild(cell);
  }
}

// === Display Fact Below Calendar ===
function showFact(day, monthKey) {
  const factDisplay = document.getElementById("fact-display");
  const factDate = document.getElementById("fact-date");
  const factText = document.getElementById("fact-text");
  const factImage = document.getElementById("fact-image");

  const fact = dateFacts[monthKey][day];

  factDate.textContent = `${monthNames[currentMonth]} ${day}, ${currentYear}`;
  factText.textContent = fact ? fact.text : "";

  if (fact && fact.image) {
    factImage.innerHTML = `<img src="${fact.image}" alt="Fact Image" class="rounded-lg mx-auto max-h-48">`;
  } else {
    factImage.innerHTML = "";
  }

  factDisplay.classList.remove("hidden");
  //factDisplay.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showLocalDate() {
  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleString("default", { month: "long" });
  const year = now.getFullYear();

  function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  }

  const suffix = getOrdinal(day);

  const output = document.getElementById("date-output");
  output.innerHTML = `The date today is the ${day}<sup style="font-size:0.6em; vertical-align:super;">${suffix}</sup> of ${month} ${year}!`;
  output.classList.remove("hidden");
}


// === Initialize Calendar ===
window.onload = () => {
  loadFacts();
};
