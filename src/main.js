import './style.css';
import { 
  getTrips, 
  getCurrentTrip, 
  setCurrentTrip, 
  addExpense, 
  resetData 
} from './data.js';
import { 
  SidebarComponent, 
  HeaderComponent, 
  BudgetSummaryComponent, 
  ExpenseChartComponent, 
  ExpenseListComponent, 
  ExpenseModalComponent 
} from './components.js';

// Central render function to bind data and UI updates
function renderApp() {
  const currentTrip = getCurrentTrip();
  const trips = getTrips();
  const appEl = document.querySelector('#app');
  
  // 1. Render layout shell structure
  appEl.innerHTML = `
    <div class="app-container">
      ${SidebarComponent('resumen')}
      <div class="main-content">
        <main class="dashboard-viewport">
          <div id="header-root"></div>
          <div class="dashboard-row">
            <div id="budget-summary-root"></div>
            <div id="expense-chart-root"></div>
          </div>
          <div id="expense-list-root"></div>
        </main>
      </div>
    </div>
    ${ExpenseModalComponent()}
  `;

  // 2. Render sub-components into their slots
  document.querySelector('#header-root').innerHTML = HeaderComponent(currentTrip);
  document.querySelector('#budget-summary-root').innerHTML = BudgetSummaryComponent(currentTrip);
  document.querySelector('#expense-chart-root').innerHTML = ExpenseChartComponent(currentTrip);
  document.querySelector('#expense-list-root').innerHTML = ExpenseListComponent(currentTrip);

  // 3. Render trip selector dropdown options
  const dropdownEl = document.querySelector('#trip-dropdown');
  dropdownEl.innerHTML = trips.map(t => `
    <button class="trip-option" data-id="${t.id}">
      <span class="trip-option-name">${t.name}</span>
      <span class="trip-option-dates">${t.dates}</span>
    </button>
  `).join('');

  // 4. Attach Event Listeners
  attachEventListeners();
}

// Attach all interactive handlers and toggle actions
function attachEventListeners() {
  const currentTrip = getCurrentTrip();
  
  // Trip Selector Dropdown toggle
  const tripBtn = document.querySelector('#trip-selector-btn');
  const tripDropdown = document.querySelector('#trip-dropdown');
  if (tripBtn && tripDropdown) {
    tripBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      tripDropdown.classList.toggle('open');
    });
  }

  // Trip selection action
  const tripOptions = document.querySelectorAll('.trip-option');
  tripOptions.forEach(opt => {
    opt.addEventListener('click', (e) => {
      const tripId = opt.getAttribute('data-id');
      setCurrentTrip(tripId);
      renderApp(); // Full rerender
    });
  });

  // Modal actions
  const openModalBtn = document.querySelector('#open-expense-modal-btn');
  const closeModalBtn = document.querySelector('#close-expense-modal-btn');
  const cancelModalBtn = document.querySelector('#cancel-expense-modal-btn');
  const modalOverlay = document.querySelector('#expense-modal-overlay');

  if (openModalBtn && modalOverlay) {
    openModalBtn.addEventListener('click', () => {
      modalOverlay.classList.add('open');
      
      // Auto-populate Date field with today's date formatted as DD/MM/YY
      const dateInput = document.querySelector('#expense-date-input');
      if (dateInput) {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yy = String(today.getFullYear()).slice(-2);
        dateInput.value = `${dd}/${mm}/${yy}`;
      }
    });
  }

  const hideModal = () => {
    if (modalOverlay) {
      modalOverlay.classList.remove('open');
      resetModalForm();
    }
  };

  if (closeModalBtn) closeModalBtn.addEventListener('click', hideModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', hideModal);

  // Category Selector Dropdown toggle (inside Modal)
  const categoryBtn = document.querySelector('#category-trigger-btn');
  const categoryDropdown = document.querySelector('#category-options');
  if (categoryBtn && categoryDropdown) {
    categoryBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      categoryDropdown.classList.toggle('open');
    });
  }

  // Category option selection
  const categoryOptions = document.querySelectorAll('.category-option-btn');
  const categoryLabel = document.querySelector('#category-trigger-label');
  const categoryValInput = document.querySelector('#expense-category-value');
  const categoryKeyInput = document.querySelector('#expense-category-key');

  categoryOptions.forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const val = opt.getAttribute('data-value');
      const key = opt.getAttribute('data-key');
      
      categoryLabel.textContent = val;
      categoryLabel.classList.remove('placeholder');
      categoryValInput.value = val;
      categoryKeyInput.value = key;
      
      categoryDropdown.classList.remove('open');
    });
  });

  // Modal Form Submit handler
  const form = document.querySelector('#add-expense-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.querySelector('#expense-name-input').value;
      const amount = document.querySelector('#expense-amount-input').value;
      const rawDate = document.querySelector('#expense-date-input').value;
      const category = categoryValInput.value;
      const categoryKey = categoryKeyInput.value;

      if (!category) {
        alert('Por favor selecciona una categoría.');
        return;
      }

      // Add to mock storage
      addExpense({
        name,
        amount,
        date: formatInputDate(rawDate),
        category,
        categoryKey
      });

      // Close modal and refresh UI
      hideModal();
      renderApp();
    });
  }

  // Global Outside click closing rules
  document.addEventListener('click', () => {
    if (tripDropdown) tripDropdown.classList.remove('open');
    if (categoryDropdown) categoryDropdown.classList.remove('open');
  });

  // Keyboard accessibility listeners (Esc key)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (tripDropdown) tripDropdown.classList.remove('open');
      if (categoryDropdown) categoryDropdown.classList.remove('open');
      hideModal();
    }
  });

  // Sidebar link clicks (simulating view tabs)
  const navItems = document.querySelectorAll('.sidebar-nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = item.getAttribute('data-tab');
      if (tab !== 'resumen') {
        alert(`La vista "${tab.toUpperCase()}" no está disponible en este prototipo.`);
      }
    });
  });

  // Reset button simulated on logout button click (for convenience)
  const logoutBtn = document.querySelector('#logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('¿Deseas restablecer los datos del prototipo al estado inicial de Figma?')) {
        resetData();
        renderApp();
      }
    });
  }
}

// Reset form elements inside the modal
function resetModalForm() {
  const form = document.querySelector('#add-expense-form');
  if (form) form.reset();
  
  const categoryLabel = document.querySelector('#category-trigger-label');
  if (categoryLabel) {
    categoryLabel.textContent = 'Selecciona una categoría';
    categoryLabel.classList.add('placeholder');
  }

  const categoryValInput = document.querySelector('#expense-category-value');
  const categoryKeyInput = document.querySelector('#expense-category-key');
  if (categoryValInput) categoryValInput.value = '';
  if (categoryKeyInput) categoryKeyInput.value = '';
}

// Helper to format text dates entered in DD/MM/AA to match Figma weekday labels
function formatInputDate(dateStr) {
  if (!dateStr || dateStr.toLowerCase() === 'hoy') return 'Hoy';
  
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    let year = parseInt(parts[2], 10);
    if (year < 100) year += 2000;
    
    const dateObj = new Date(year, month, day);
    if (!isNaN(dateObj.getTime())) {
      const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const dayName = weekdays[dateObj.getDay()];
      
      // Check if it matches today's date
      const today = new Date();
      if (dateObj.getDate() === today.getDate() && 
          dateObj.getMonth() === today.getMonth() && 
          dateObj.getFullYear() === today.getFullYear()) {
        return 'Hoy';
      }
      
      return `${dayName} - ${dateStr}`;
    }
  }
  return dateStr;
}

// Boot up the application
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
});

// Run directly in case DOMContentLoaded has already fired
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  renderApp();
}