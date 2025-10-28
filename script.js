let facts = {};

fetch('facts.json')
  .then(r => r.json())
  .then(data => { facts = data; renderCalendar(); })
  .catch(() => {
    facts = {
      "2025-10-28": {
        "date": "October 28, 2025",
        "title": "Bitcoin Pizza Day",
        "text": "Laszlo paid 10,000 BTC for 2 pizzas. Worth $700M+ today.",
        "images": ["https://i.imgur.com/4M1t7jP.jpeg"]
      }
    };
    renderCalendar();
  });

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let current = new Date();

function renderCalendar() {
  const year = current.getFullYear();
  const month = current.getMonth();
  document.getElementById('month-year').textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysDiv = document.getElementById('calendar-days');
  daysDiv.innerHTML = '';

  for (let i = 0; i < firstDay; i++) {
    daysDiv.innerHTML += `<div class="day empty"></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const hasFact = facts[dateKey];
    daysDiv.innerHTML += `
      <div class="day ${hasFact ? 'has-fact' : ''}" onclick="openFact('${dateKey}')">
        ${day}
      </div>`;
  }
}

document.getElementById('prev-month').addEventListener('click', () => {
  current.setMonth(current.getMonth() - 1);
  renderCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
  current.setMonth(current.getMonth() + 1);
  renderCalendar();
});

function openFact(dateKey) {
  if (!facts[dateKey]) return;
  const f = facts[dateKey];
  const params = new URLSearchParams({
    date: f.date,
    title: f.title,
    text: f.text,
    img1: f.images[0] || '',
    img2: f.images[1] || '',
    img3: f.images[2] || ''
  });
  window.open(`fact.html?${params}`, '_blank');
}