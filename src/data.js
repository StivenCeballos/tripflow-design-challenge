// Central Data Layer for Tripflow mock data and state management

const MOCK_TRIPS = [
  {
    id: 'cancun',
    name: 'Cancún',
    dates: 'Ago/20/26 a Ago/28/26',
    totalBudget: 500,
    expenses: [
      { id: 1, name: "Mc Donnald’s", category: "Alimentación", categoryKey: "food", amount: 30.00, date: "Miércoles - 26/08/26" },
      { id: 2, name: "Mc Donnald’s", category: "Alimentación", categoryKey: "food", amount: 30.00, date: "Martes - 25/08/26" },
      { id: 3, name: "Compras", category: "Compras", categoryKey: "shopping", amount: 50.00, date: "Martes - 25/08/26" },
      { id: 4, name: "Transporte", category: "Transporte", categoryKey: "transportation", amount: 90.00, date: "Lunes - 24/08/26" }
    ],
    // Chart dates matching the visual coordinates in Figma
    chartDates: ["24 Ago", "25 Ago", "26 Ago", "27 Ago", "28 Ago"],
    chartData: {
      "24 Ago": 90,
      "25 Ago": 80, // Mc Donnald's $30 + Compras $50 = $80
      "26 Ago": 30, // Mc Donnald's today = $30
      "27 Ago": 0,
      "28 Ago": 0
    }
  },
  {
    id: 'paris',
    name: 'París',
    dates: 'Jul/12/26 a Jul/20/26',
    totalBudget: 1500,
    expenses: [
      { id: 1, name: "Louvre Museum", category: "Compras", categoryKey: "shopping", amount: 40.00, date: "Domingo - 19/07/26" },
      { id: 2, name: "Metro Pass", category: "Transporte", categoryKey: "transportation", amount: 15.00, date: "Viernes - 17/07/26" },
      { id: 3, name: "Bistro dinner", category: "Alimentación", categoryKey: "food", amount: 65.00, date: "Lunes - 13/07/26" }
    ],
    chartDates: ["13 Jul", "17 Jul", "19 Jul"],
    chartData: {
      "13 Jul": 65,
      "17 Jul": 15,
      "19 Jul": 40
    }
  },
  {
    id: 'tokyo',
    name: 'Tokio',
    dates: 'Jun/05/26 a Jun/15/26',
    totalBudget: 2000,
    expenses: [
      { id: 1, name: "Sushi lunch", category: "Alimentación", categoryKey: "food", amount: 80.00, date: "Domingo - 14/06/26" },
      { id: 2, name: "Souvenirs Shinjuku", category: "Compras", categoryKey: "shopping", amount: 150.00, date: "Miércoles - 10/06/26" },
      { id: 3, name: "Bullet Train Ticket", category: "Transporte", categoryKey: "transportation", amount: 120.00, date: "Viernes - 05/06/26" }
    ],
    chartDates: ["05 Jun", "10 Jun", "14 Jun"],
    chartData: {
      "05 Jun": 120,
      "10 Jun": 150,
      "14 Jun": 80
    }
  }
];

const MONTHS = {
  'Ene': 0, 'Feb': 1, 'Mar': 2, 'Abr': 3, 'May': 4, 'Jun': 5,
  'Jul': 6, 'Ago': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dic': 11
};

export function parseTripBound(dateStr) {
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
  }
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const m = MONTHS[parts[0]];
      const d = parseInt(parts[1], 10);
      let y = parseInt(parts[2], 10);
      if (y < 100) y += 2000;
      return new Date(y, m, d);
    }
  }
  return new Date(0);
}

// Initialize State in localStorage or memory
let tripsState = JSON.parse(localStorage.getItem('tripflow_trips_v3')) || MOCK_TRIPS;

// Migration: Migrate any lingering "Hoy" categories to the mock date "Miércoles - 26/08/26"
tripsState.forEach(trip => {
  if (trip.expenses) {
    trip.expenses.forEach(exp => {
      if (exp.date === 'Hoy') {
        exp.date = 'Miércoles - 26/08/26';
      }
    });
  }
});

// One-time cleanup: remove test "Maracaibo" trips
tripsState = tripsState.filter(t => !t.name.toLowerCase().includes('maracaibo'));

// Ensure all trips have fully hydrated chronological chart data
tripsState.forEach(trip => recalculateChartData(trip));

localStorage.setItem('tripflow_trips_v3', JSON.stringify(tripsState));

let currentTripId = localStorage.getItem('tripflow_current_trip_id') || 'cancun';

// Ensure current trip exists after potential cleanup
if (!tripsState.find(t => t.id === currentTripId) && tripsState.length > 0) {
  currentTripId = tripsState[0].id;
}

function saveToStorage() {
  localStorage.setItem('tripflow_trips_v3', JSON.stringify(tripsState));
  localStorage.setItem('tripflow_current_trip_id', currentTripId);
}

export function getTrips() {
  return tripsState;
}

export function getCurrentTrip() {
  return tripsState.find(trip => trip.id === currentTripId) || tripsState[0];
}

export function setCurrentTrip(id) {
  currentTripId = id;
  saveToStorage();
}

// Helper to dynamically calculate chart data from expenses
function recalculateChartData(trip) {

  function parseExpenseDate(dateStr) {
    if (dateStr === 'Hoy') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
    }
    let dStr = dateStr;
    if (dStr.includes(' - ')) {
      dStr = dStr.split(' - ')[1];
    }
    const parts = dStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      let year = parseInt(parts[2], 10);
      if (year < 100) year += 2000;
      return new Date(year, month, day);
    }
    return new Date(0);
  }

  function formatShortDate(dateObj) {
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const mmm = monthNames[dateObj.getMonth()];
    return `${dd} ${mmm}`;
  }

  // Parse trip boundaries
  const bounds = trip.dates.split(' a ');
  const tripStart = parseTripBound(bounds[0]);
  const tripEnd = bounds.length > 1 ? parseTripBound(bounds[1]) : new Date(tripStart);

  // Parse expense dates and sum amounts
  const expenseMap = new Map();
  let maxExpenseDate = new Date(tripStart);

  trip.expenses.forEach(exp => {
    const d = parseExpenseDate(exp.date);
    // Only process expenses that belong to or fall within the trip logically
    // To be safe, we just sum them by normalized time
    const t = d.getTime();
    if (t > maxExpenseDate.getTime() && t <= tripEnd.getTime()) {
      maxExpenseDate = new Date(t);
    }
    expenseMap.set(t, (expenseMap.get(t) || 0) + exp.amount);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Determine the end of the range to display
  // Min of (Trip End) and Max of (Today, maxExpenseDate)
  let rangeEnd = new Date(today);
  if (maxExpenseDate > rangeEnd) {
    rangeEnd = new Date(maxExpenseDate);
  }
  if (rangeEnd > tripEnd) {
    rangeEnd = new Date(tripEnd);
  }
  if (rangeEnd < tripStart) {
    rangeEnd = new Date(tripStart); // Edge case if trip is completely in the future
  }

  const chartDates = [];
  const chartData = {};

  // Generate sequence of days
  let curr = new Date(tripStart);
  while (curr <= rangeEnd) {
    const t = curr.getTime();
    const shortLabel = formatShortDate(curr);
    
    chartDates.push(shortLabel);
    chartData[shortLabel] = expenseMap.get(t) || 0;
    
    curr.setDate(curr.getDate() + 1);
  }

  trip.chartDates = chartDates;
  trip.chartData = chartData;
}

export function addExpense(expenseData) {
  const currentTrip = getCurrentTrip();
  if (!currentTrip) return;

  const newExpense = {
    id: Date.now(),
    name: expenseData.name,
    category: expenseData.category,
    categoryKey: expenseData.categoryKey,
    amount: parseFloat(expenseData.amount),
    date: expenseData.date
  };

  // Add to expense log
  currentTrip.expenses.unshift(newExpense);

  // Dynamically recalculate chart data based on all expenses
  recalculateChartData(currentTrip);

  saveToStorage();
  return newExpense;
}

export function deleteExpense(expenseId) {
  const currentTrip = getCurrentTrip();
  if (!currentTrip) return;

  const expenseIndex = currentTrip.expenses.findIndex(e => e.id === expenseId);
  if (expenseIndex === -1) return;

  currentTrip.expenses.splice(expenseIndex, 1);
  
  // Dynamically recalculate chart data
  recalculateChartData(currentTrip);

  saveToStorage();
}

export function addTrip({ destination, budget, startDate, endDate }) {
  const id = `trip_${Date.now()}`;
  const newTrip = {
    id,
    name: destination,
    dates: `${startDate} a ${endDate}`,
    totalBudget: budget,
    expenses: [],
    chartDates: ['', '', '', '', ''], // Will populate dynamically as expenses are added
    chartData: {}
  };
  tripsState.unshift(newTrip);
  currentTripId = id;
  saveToStorage();
  return newTrip;
}

export function deleteTrip(tripId) {
  const index = tripsState.findIndex(t => t.id === tripId);
  if (index === -1) return;

  tripsState.splice(index, 1);

  if (tripsState.length > 0) {
    // If the deleted trip was the current one, select the first available
    if (currentTripId === tripId) {
      currentTripId = tripsState[0].id;
    }
  } else {
    // If we deleted the last trip, reset to MOCK_TRIPS to avoid breaking the app
    resetData();
    return;
  }
  
  saveToStorage();
}

export function resetData() {
  tripsState = JSON.parse(JSON.stringify(MOCK_TRIPS)); // Deep copy
  currentTripId = 'cancun';
  saveToStorage();
}
