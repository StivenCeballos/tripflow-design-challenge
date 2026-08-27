import './style.css';
import { 
  getTrips, 
  getCurrentTrip, 
  setCurrentTrip, 
  addExpense, 
  deleteExpense,
  addTrip,
  deleteTrip,
  resetData,
  parseTripBound
} from './data.js';
import { 
  SidebarComponent, 
  HeaderComponent, 
  BudgetSummaryComponent, 
  ExpenseChartComponent, 
  ExpenseListComponent, 
  ExpenseModalComponent,
  CreateTripModalComponent,
  DeleteTripModalComponent,
  DeleteExpenseModalComponent,
  MobileNavComponent
} from './components.js';

let currentTab = 'resumen';

// Central render function to bind data and UI updates
function renderApp() {
  const currentTrip = getCurrentTrip();
  const trips = getTrips();
  const appEl = document.querySelector('#app');
  
  // 1. Render layout shell structure
  appEl.innerHTML = `
    <div class="app-container">
      ${SidebarComponent(currentTab)}
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
      ${MobileNavComponent(currentTab)}
      
      <!-- Floating Action Button for Mobile -->
      <button class="mobile-fab-btn" id="open-expense-modal-btn-mobile" title="Registrar gasto">
        <span>Registrar gasto</span>
        <img src="/icons/plus.png" alt="+" style="width: 16px; height: 16px; filter: brightness(0) invert(1);" />
      </button>
    </div>
    ${ExpenseModalComponent()}
    ${CreateTripModalComponent()}
    ${DeleteTripModalComponent()}
    ${DeleteExpenseModalComponent()}
  `;

  // 2. Render sub-components into their slots
  document.querySelector('#header-root').innerHTML = HeaderComponent(currentTrip);
  document.querySelector('#budget-summary-root').innerHTML = BudgetSummaryComponent(currentTrip);
  document.querySelector('#expense-chart-root').innerHTML = ExpenseChartComponent(currentTrip);
  document.querySelector('#expense-list-root').innerHTML = ExpenseListComponent(currentTrip);

  // 2.5 Scroll chart wrapper to the right so that current/latest day is visible initially
  const chartWrapper = document.querySelector('.chart-scroll-wrapper');
  if (chartWrapper) {
    chartWrapper.scrollLeft = chartWrapper.scrollWidth;
  }

  // 3. Render trip selector dropdown options + "Crear nuevo viaje" button
  const dropdownEl = document.querySelector('#trip-dropdown');
  dropdownEl.innerHTML = trips.map(t => `
    <button class="trip-option" data-id="${t.id}">
      <span class="trip-option-name">${t.name}</span>
      <span class="trip-option-dates">${t.dates}</span>
    </button>
  `).join('') + `
    <button class="trip-dropdown-create-btn" id="open-create-trip-btn">
      <i class="ph ph-plus-circle"></i>
      Crear nuevo viaje
    </button>
  `;

  // 4. Attach Event Listeners
  attachEventListeners();
}

// Attach all interactive handlers and toggle actions
function attachEventListeners() {
  const currentTrip = getCurrentTrip();

  // Tab switching action
  const navItems = document.querySelectorAll('.sidebar-nav-item, .mobile-nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = item.getAttribute('data-tab');
      currentTab = tab;
      renderApp();
      if (tab !== 'resumen') {
        alert(`La vista "${tab.toUpperCase()}" no está disponible en este prototipo.`);
      }
    });
  });
  
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

  // Budget Alert dismiss action
  const closeAlertBtn = document.querySelector('#close-alert-btn');
  if (closeAlertBtn) {
    closeAlertBtn.addEventListener('click', () => {
      const alertEl = document.querySelector('#budget-warning-alert');
      if (alertEl) {
        alertEl.style.display = 'none';
      }
    });
  }

  // Modal actions — Registrar Gasto
  const openModalBtns = document.querySelectorAll('#open-expense-modal-btn, #open-expense-modal-btn-mobile');
  const closeModalBtn = document.querySelector('#close-expense-modal-btn');
  const modalOverlay = document.querySelector('#expense-modal-overlay');

  if (openModalBtns.length > 0 && modalOverlay) {
    openModalBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modalOverlay.classList.add('open');
      
      // Auto-populate Date field with today's date in YYYY-MM-DD (native date input format)
      const dateInput = document.querySelector('#expense-date-input');
      if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${yyyy}-${mm}-${dd}`;
        
        // Restrict to trip end date
        const currentTrip = getCurrentTrip();
        if (currentTrip && currentTrip.dates) {
          const bounds = currentTrip.dates.split(' a ');
          const tripEnd = bounds.length > 1 ? parseTripBound(bounds[1]) : parseTripBound(bounds[0]);
          if (tripEnd.getTime() > 0) {
            const endY = tripEnd.getFullYear();
            const endM = String(tripEnd.getMonth() + 1).padStart(2, '0');
            const endD = String(tripEnd.getDate()).padStart(2, '0');
          }
        }
      }
    });
  });
}

  const hideModal = () => {
    if (modalOverlay) {
      modalOverlay.classList.remove('open');
      resetModalForm();
    }
  };

  if (closeModalBtn) closeModalBtn.addEventListener('click', hideModal);

  // Cancel button
  const cancelExpenseBtn = document.querySelector('#cancel-expense-modal-btn');
  if (cancelExpenseBtn) cancelExpenseBtn.addEventListener('click', hideModal);

  // Close on overlay backdrop click
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) hideModal();
    });
  }

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
      const icon = opt.getAttribute('data-icon');
      
      categoryLabel.textContent = val;
      categoryLabel.classList.remove('placeholder');
      categoryValInput.value = val;
      categoryKeyInput.value = key;

      // Show the selected category icon inside the trigger
      const triggerIcon = document.querySelector('#category-trigger-icon');
      if (triggerIcon && icon) {
        triggerIcon.src = icon;
        triggerIcon.alt = val;
        triggerIcon.style.display = 'block';
      }
      
      categoryDropdown.classList.remove('open');
      updateExpenseSubmitBtn();
    });
  });

  // Dynamic submit button activation for expense form
  function updateExpenseSubmitBtn() {
    const submitBtn = document.querySelector('#expense-submit-btn');
    if (!submitBtn) return;
    const nameVal = document.querySelector('#expense-name-input')?.value.trim();
    const amountVal = document.querySelector('#expense-amount-input')?.value.trim();
    const catVal = categoryValInput?.value;
    if (nameVal && amountVal && catVal) {
      submitBtn.classList.add('active');
    } else {
      submitBtn.classList.remove('active');
    }
  }

  // Listen for input changes to toggle button state
  document.querySelector('#expense-name-input')?.addEventListener('input', updateExpenseSubmitBtn);
  document.querySelector('#expense-amount-input')?.addEventListener('input', updateExpenseSubmitBtn);

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
      
      // Validate date and budget
      const currentTrip = getCurrentTrip();
      if (currentTrip) {
        // 1. Validate Budget
        const parsedAmount = parseFloat(amount);
        const currentTotal = currentTrip.expenses.reduce((sum, e) => sum + e.amount, 0);
        if (currentTotal + parsedAmount > currentTrip.totalBudget) {
          alert('No puedes añadir este gasto porque superaría el presupuesto total del viaje.');
          return;
        }

        // 2. Validate Date is not after trip end date
        if (currentTrip.dates) {
          const bounds = currentTrip.dates.split(' a ');
          const tripEnd = bounds.length > 1 ? parseTripBound(bounds[1]) : parseTripBound(bounds[0]);
          if (tripEnd.getTime() > 0) {
            const [yy, mm, dd] = rawDate.split('-').map(Number);
            const expenseDate = new Date(yy, mm - 1, dd);
            expenseDate.setHours(0, 0, 0, 0);
            tripEnd.setHours(0, 0, 0, 0);
            
            if (expenseDate > tripEnd) {
              alert('No puedes agregar un gasto a una fecha posterior a la finalización del viaje.');
              return;
            }
          }
        }
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

  // Modal actions — Crear Nuevo Viaje
  const openCreateTripBtn = document.querySelector('#open-create-trip-btn');
  const closeCreateTripBtn = document.querySelector('#close-create-trip-modal-btn');
  const createTripOverlay = document.querySelector('#create-trip-modal-overlay');

  const hideCreateTripModal = () => {
    if (createTripOverlay) {
      createTripOverlay.classList.remove('open');
      const tripForm = document.querySelector('#create-trip-form');
      if (tripForm) tripForm.reset();
      const submitBtn = document.querySelector('#create-trip-submit-btn');
      if (submitBtn) submitBtn.classList.remove('active');
    }
  };

  if (openCreateTripBtn) {
    openCreateTripBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      tripDropdown.classList.remove('open');
      createTripOverlay.classList.add('open');
    });
  }

  if (closeCreateTripBtn) closeCreateTripBtn.addEventListener('click', hideCreateTripModal);

  // Cancel button for create trip modal
  const cancelCreateTripBtn = document.querySelector('#cancel-create-trip-btn');
  if (cancelCreateTripBtn) cancelCreateTripBtn.addEventListener('click', hideCreateTripModal);

  // Modal actions — Eliminar Viaje
  const openDeleteTripBtns = document.querySelectorAll('#open-delete-trip-modal-btn, #open-delete-trip-modal-btn-mobile');
  const closeDeleteTripBtn = document.querySelector('#close-delete-trip-modal-btn');
  const cancelDeleteTripBtn = document.querySelector('#cancel-delete-trip-btn');
  const confirmDeleteTripBtn = document.querySelector('#confirm-delete-trip-btn');
  const deleteTripOverlay = document.querySelector('#delete-trip-modal-overlay');

  const hideDeleteTripModal = () => {
    if (deleteTripOverlay) deleteTripOverlay.classList.remove('open');
  };

  if (openDeleteTripBtns.length > 0) {
    openDeleteTripBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (deleteTripOverlay) deleteTripOverlay.classList.add('open');
      });
    });
  }

  if (closeDeleteTripBtn) closeDeleteTripBtn.addEventListener('click', hideDeleteTripModal);
  if (cancelDeleteTripBtn) cancelDeleteTripBtn.addEventListener('click', hideDeleteTripModal);
  
  if (deleteTripOverlay) {
    deleteTripOverlay.addEventListener('click', (e) => {
      if (e.target === deleteTripOverlay) hideDeleteTripModal();
    });
  }

  if (confirmDeleteTripBtn) {
    confirmDeleteTripBtn.addEventListener('click', () => {
      const currentTrip = getCurrentTrip();
      if (currentTrip) {
        deleteTrip(currentTrip.id);
        hideDeleteTripModal();
        renderApp();
      }
    });
  }

  // Modal actions — Eliminar Gasto
  const deleteExpenseOverlay = document.querySelector('#delete-expense-modal-overlay');
  const closeDeleteExpenseBtn = document.querySelector('#close-delete-expense-modal-btn');
  const cancelDeleteExpenseBtn = document.querySelector('#cancel-delete-expense-btn');
  const confirmDeleteExpenseBtn = document.querySelector('#confirm-delete-expense-btn');
  let expenseToDeleteId = null;

  const hideDeleteExpenseModal = () => {
    if (deleteExpenseOverlay) {
      deleteExpenseOverlay.classList.remove('open');
      expenseToDeleteId = null;
    }
  };

  if (closeDeleteExpenseBtn) closeDeleteExpenseBtn.addEventListener('click', hideDeleteExpenseModal);
  if (cancelDeleteExpenseBtn) cancelDeleteExpenseBtn.addEventListener('click', hideDeleteExpenseModal);
  if (deleteExpenseOverlay) {
    deleteExpenseOverlay.addEventListener('click', (e) => {
      if (e.target === deleteExpenseOverlay) hideDeleteExpenseModal();
    });
  }

  if (confirmDeleteExpenseBtn) {
    confirmDeleteExpenseBtn.addEventListener('click', () => {
      if (expenseToDeleteId !== null) {
        deleteExpense(expenseToDeleteId);
        hideDeleteExpenseModal();
        renderApp();
      }
    });
  }

  // Expense Delete actions (Delegation)
  const expensesList = document.querySelector('.expenses-list');
  if (expensesList) {
    expensesList.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.expense-delete-btn');
      if (deleteBtn) {
        const expenseId = parseInt(deleteBtn.getAttribute('data-id'), 10);
        if (!isNaN(expenseId)) {
          expenseToDeleteId = expenseId;
          if (deleteExpenseOverlay) {
            deleteExpenseOverlay.classList.add('open');
          }
        }
      }
    });
  }

  if (createTripOverlay) {
    createTripOverlay.addEventListener('click', (e) => {
      if (e.target === createTripOverlay) hideCreateTripModal();
    });
  }

  // Dynamic submit button activation for create trip form
  function updateCreateTripSubmitBtn() {
    const submitBtn = document.querySelector('#create-trip-submit-btn');
    if (!submitBtn) return;
    const destVal = document.querySelector('#trip-destination-input')?.value.trim();
    const budgetVal = document.querySelector('#trip-budget-input')?.value.trim();
    const startVal = document.querySelector('#trip-start-date-input')?.value.trim();
    const endVal = document.querySelector('#trip-end-date-input')?.value.trim();
    if (destVal && budgetVal && startVal && endVal) {
      submitBtn.classList.add('active');
    } else {
      submitBtn.classList.remove('active');
    }
  }

  document.querySelector('#trip-destination-input')?.addEventListener('input', updateCreateTripSubmitBtn);
  document.querySelector('#trip-budget-input')?.addEventListener('input', updateCreateTripSubmitBtn);
  document.querySelector('#trip-start-date-input')?.addEventListener('change', updateCreateTripSubmitBtn);
  document.querySelector('#trip-end-date-input')?.addEventListener('change', updateCreateTripSubmitBtn);

  // Create Trip form submit handler
  const createTripForm = document.querySelector('#create-trip-form');
  if (createTripForm) {
    createTripForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const destination = document.querySelector('#trip-destination-input').value.trim();
      const budget = parseFloat(document.querySelector('#trip-budget-input').value);
      const startDate = document.querySelector('#trip-start-date-input').value.trim();
      const endDate = document.querySelector('#trip-end-date-input').value.trim();

      if (startDate && endDate) {
        // YYYY-MM-DD string comparison works perfectly and avoids timezone issues
        if (endDate < startDate) {
          alert('La fecha final no puede ser anterior a la fecha de inicio.');
          return;
        }
      }

      addTrip({ destination, budget, startDate, endDate });
      hideCreateTripModal();
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
      hideCreateTripModal();
      if (typeof hideDeleteTripModal !== 'undefined') hideDeleteTripModal();
      if (typeof hideDeleteExpenseModal !== 'undefined') hideDeleteExpenseModal();
    }
  });

  // Tab click alerts are handled at the top of attachEventListeners now

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

  // Hide category icon in trigger
  const triggerIcon = document.querySelector('#category-trigger-icon');
  if (triggerIcon) {
    triggerIcon.src = '';
    triggerIcon.style.display = 'none';
  }

  const categoryValInput = document.querySelector('#expense-category-value');
  const categoryKeyInput = document.querySelector('#expense-category-key');
  if (categoryValInput) categoryValInput.value = '';
  if (categoryKeyInput) categoryKeyInput.value = '';

  // Reset submit button state
  const submitBtn = document.querySelector('#expense-submit-btn');
  if (submitBtn) submitBtn.classList.remove('active');
}

// Helper to format dates from native date input (YYYY-MM-DD) to Figma weekday labels
function formatInputDate(dateStr) {
  if (!dateStr) return 'Hoy';

  // Handle YYYY-MM-DD format from native date input
  let dateObj;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-').map(Number);
    dateObj = new Date(year, month - 1, day);
  } else if (dateStr.toLowerCase() === 'hoy') {
    return 'Hoy';
  } else {
    // Legacy DD/MM/AA fallback
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      let year = parseInt(parts[2], 10);
      if (year < 100) year += 2000;
      dateObj = new Date(year, month, day);
    }
  }

  if (!dateObj || isNaN(dateObj.getTime())) return dateStr;

  const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const dayName = weekdays[dateObj.getDay()];
  
  // Check if it matches today's date
  const today = new Date();
  if (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  ) {
    return 'Hoy';
  }

  const dd = String(dateObj.getDate()).padStart(2, '0');
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const yy = String(dateObj.getFullYear()).slice(-2);
  return `${dayName} - ${dd}/${mm}/${yy}`;
}

// Boot up the application
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
});

// Run directly in case DOMContentLoaded has already fired
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  renderApp();
}