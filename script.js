// FACTS BUILT IN
const facts = {
  "2025-10-28": {
    "title": "Bitcoin Pizza Day",
    "text": "Laszlo paid 10,000 BTC for 2 pizzas. Worth $700M+ today.",
    "images": ["https://i.imgur.com/4M1t7jP.jpeg"]
  },
  "2025-12-25": {
    "title": "Santa HODLs",
    "text": "Elon tweets 'HO HO HODL'. Markets pump 33%.",
    "images": ["https://i.imgur.com/8k9pLmN.png"]
  }
};

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
      <div class="day ${hasFact ? 'has-fact' : ''}" onclick="showFact('${dateKey}')">
        ${day}
      </div>`;
  }
}

function showFact(dateKey) {
  const f = facts[dateKey];
  if (!f) return;

  document.getElementById('fact-title').textContent = f.title;
  document.getElementById('fact-text').textContent = f.text;

  const imagesDiv = document.getElementById('fact-images');
  imagesDiv.innerHTML = '';
  f.images.forEach(url => {
    imagesDiv.innerHTML += `<img src="${url}" alt="Fact image">`;
  });

  document.getElementById('fact-display').classList.remove('hidden');
  window.scrollTo(0, document.getElementById('fact-display').offsetTop - 100);
}

document.getElementById('close-fact').addEventListener('click', () => {
  document.getElementById('fact-display').classList.add('hidden');
});

document.getElementById('prev-month').addEventListener('click', () => {
  current.setMonth(current.getMonth() - 1);
  renderCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
  current.setMonth(current.getMonth() + 1);
  renderCalendar();
});

// Start
renderCalendar();
