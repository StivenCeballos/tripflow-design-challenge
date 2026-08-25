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
let currentTripId = localStorage.getItem('tripflow_current_trip_id') || 'cancun';

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

  // Update chart data mapping
  // Map standard readable date keys for the chart. Let's find which chart day corresponds.
  // In a real app we'd map timestamps, here we map simple keys.
  // If the expense date matches or is "Hoy", map to the active chart day (3rd element usually).
  let chartDay = currentTrip.chartDates[2]; // Default to today
  if (expenseData.date && expenseData.date.includes('/')) {
    // If it has date format like 25/08/26, extract corresponding label:
    // Simple mock logic:
    if (expenseData.date.startsWith('24')) chartDay = currentTrip.chartDates[0];
    else if (expenseData.date.startsWith('25')) chartDay = currentTrip.chartDates[1];
    else if (expenseData.date.startsWith('26')) chartDay = currentTrip.chartDates[2];
    else if (expenseData.date.startsWith('27')) chartDay = currentTrip.chartDates[3];
    else if (expenseData.date.startsWith('28')) chartDay = currentTrip.chartDates[4];
  }

  if (currentTrip.chartData[chartDay] !== undefined) {
    currentTrip.chartData[chartDay] += newExpense.amount;
  } else {
    currentTrip.chartData[chartDay] = newExpense.amount;
  }

  saveToStorage();
  return newExpense;
}

export function deleteExpense(expenseId) {
  const currentTrip = getCurrentTrip();
  if (!currentTrip) return;

  const expenseIndex = currentTrip.expenses.findIndex(e => e.id === expenseId);
  if (expenseIndex === -1) return;

  const expense = currentTrip.expenses[expenseIndex];
  
  // Subtract from chart data
  let chartDay = currentTrip.chartDates[2]; // Default
  if (expense.date === 'Hoy') {
    chartDay = currentTrip.chartDates[2];
  } else if (expense.date.includes('24') || expense.date.includes('05') || expense.date.includes('12')) {
    chartDay = currentTrip.chartDates[0];
  } else if (expense.date.includes('25') || expense.date.includes('06') || expense.date.includes('13')) {
    chartDay = currentTrip.chartDates[1];
  } else if (expense.date.includes('26') || expense.date.includes('07') || expense.date.includes('14')) {
    chartDay = currentTrip.chartDates[2];
  }

  if (currentTrip.chartData[chartDay]) {
    currentTrip.chartData[chartDay] = Math.max(0, currentTrip.chartData[chartDay] - expense.amount);
  }

  currentTrip.expenses.splice(expenseIndex, 1);
  saveToStorage();
}

export function resetData() {
  tripsState = JSON.parse(JSON.stringify(MOCK_TRIPS)); // Deep copy
  currentTripId = 'cancun';
  saveToStorage();
}
