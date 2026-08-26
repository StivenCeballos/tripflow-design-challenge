// Central Data Layer for Tripflow mock data and state management

const MOCK_TRIPS = [
  {
    id: 'cancun',
    name: 'Cancún',
    dates: 'Ago/20/26 a Ago/28/26',
    totalBudget: 500,
    expenses: [
      { id: 1, name: "Mc Donnald’s", category: "Alimentación", categoryKey: "food", amount: 30.00, date: "Hoy" },
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
    dates: 'Oct/12/26 a Oct/20/26',
    totalBudget: 1500,
    expenses: [
      { id: 1, name: "Louvre Museum", category: "Compras", categoryKey: "shopping", amount: 40.00, date: "Hoy" },
      { id: 2, name: "Metro Pass", category: "Transporte", categoryKey: "transportation", amount: 15.00, date: "Martes - 13/10/26" },
      { id: 3, name: "Bistro dinner", category: "Alimentación", categoryKey: "food", amount: 65.00, date: "Lunes - 12/10/26" }
    ],
    chartDates: ["12 Oct", "13 Oct", "14 Oct", "15 Oct", "16 Oct"],
    chartData: {
      "12 Oct": 65,
      "13 Oct": 15,
      "14 Oct": 40,
      "15 Oct": 0,
      "16 Oct": 0
    }
  },
  {
    id: 'tokyo',
    name: 'Tokio',
    dates: 'Dic/05/26 a Dic/15/26',
    totalBudget: 2000,
    expenses: [
      { id: 1, name: "Sushi lunch", category: "Alimentación", categoryKey: "food", amount: 80.00, date: "Hoy" },
      { id: 2, name: "Souvenirs Shinjuku", category: "Compras", categoryKey: "shopping", amount: 150.00, date: "Martes - 06/12/26" },
      { id: 3, name: "Bullet Train Ticket", category: "Transporte", categoryKey: "transportation", amount: 120.00, date: "Lunes - 05/12/26" }
    ],
    chartDates: ["05 Dic", "06 Dic", "07 Dic", "08 Dic", "09 Dic"],
    chartData: {
      "05 Dic": 120,
      "06 Dic": 150,
      "07 Dic": 80,
      "08 Dic": 0,
      "09 Dic": 0
    }
  }
];

// Initialize State in localStorage or memory
let tripsState = JSON.parse(localStorage.getItem('tripflow_trips')) || MOCK_TRIPS;

// One-time cleanup: remove test "Maracaibo" trips
tripsState = tripsState.filter(t => !t.name.toLowerCase().includes('maracaibo'));
localStorage.setItem('tripflow_trips', JSON.stringify(tripsState));

let currentTripId = localStorage.getItem('tripflow_current_trip_id') || 'cancun';

// Ensure current trip exists after potential cleanup
if (!tripsState.find(t => t.id === currentTripId) && tripsState.length > 0) {
  currentTripId = tripsState[0].id;
}

function saveToStorage() {
  localStorage.setItem('tripflow_trips', JSON.stringify(tripsState));
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
  const dailyTotals = {};
  trip.expenses.forEach(exp => {
    if (!dailyTotals[exp.date]) {
      dailyTotals[exp.date] = 0;
    }
    dailyTotals[exp.date] += exp.amount;
  });

  // Extract unique dates that have expenses
  const dates = Object.keys(dailyTotals);

  // Helper to parse UI date string to a real Date object for sorting
  function parseDateForSort(dateStr) {
    if (dateStr === 'Hoy') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
    }
    // Expected format: "Lunes - 24/08/26" or "24/08/26"
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
    return new Date(0); // Fallback
  }

  // Sort dates chronologically (oldest to newest)
  dates.sort((a, b) => parseDateForSort(a) - parseDateForSort(b));

  // Take up to 5 dates to display in chart
  // If we have more than 5, we can take the 5 most recent (slice(-5))
  let chartDates = dates.slice(-5);
  
  // Create chartData
  const chartData = {};
  chartDates.forEach(d => {
    chartData[d] = dailyTotals[d];
  });

  // Pad with empty strings if less than 5 to maintain the 5-bar UI structure
  while (chartDates.length < 5) {
    // Add empty slots to the beginning so the actual dates are on the right
    chartDates.unshift('');
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
    date: expenseData.date || 'Hoy'
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
