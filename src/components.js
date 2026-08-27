// UI Component Library for Tripflow based on Figma specifications
import { parseTripBound } from './data.js';

/**
 * Renders the Sidebar Navigation
 * @param {string} activeTab 
 * @returns {string} HTML string
 */
export function SidebarComponent(activeTab = 'resumen') {
  return `
    <aside class="sidebar">
      <div class="sidebar-top">
        <div class="sidebar-logo">
          <div class="sidebar-logo-icon" style="background: transparent;">
            <img src="/icons/Tripflow logo.png" alt="logo" style="width: 100%; height: 100%; object-fit: contain;" />
          </div>
          <span class="sidebar-logo-text">tripflow</span>
        </div>
        <nav class="sidebar-nav">
          <a href="#" class="sidebar-nav-item ${activeTab === 'resumen' ? 'active' : ''}" data-tab="resumen">
            <img src="/icons/Home.png" alt="Resumen" style="width: 24px; height: 24px;" />
            <span>Resumen</span>
          </a>
          <a href="#" class="sidebar-nav-item ${activeTab === 'viajes' ? 'active' : ''}" data-tab="viajes">
            <img src="/icons/${activeTab === 'viajes' ? 'pink plane.png' : 'plane.png'}" alt="Viajes" style="width: 24px; height: 24px;" />
            <span>Viajes</span>
          </a>
          <a href="#" class="sidebar-nav-item ${activeTab === 'historial' ? 'active' : ''}" data-tab="historial">
            <img src="/icons/book.png" alt="Historial" style="width: 24px; height: 24px;" />
            <span>Historial</span>
          </a>
        </nav>
      </div>
      <div class="sidebar-bottom">
        <div class="sidebar-user">
          <div class="sidebar-avatar" style="background: transparent;">
            <img src="/icons/User.png" alt="User" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" />
          </div>
          <span class="sidebar-username" title="David Ceballos">David Ceballos</span>
        </div>
        <button class="sidebar-logout-btn" id="logout-btn" title="Cerrar sesión">
          <i class="ph ph-sign-out"></i>
        </button>
      </div>
    </aside>
  `;
}

/**
 * Renders the Dashboard Header
 * @param {Object} trip Current active trip
 * @returns {string} HTML string
 */
export function HeaderComponent(trip) {
  return `
    <header class="header">
      <span class="header-label">Viaje actual</span>
      <div class="header-row">
        <div class="trip-selector-container">
          <button class="trip-selector-trigger" id="trip-selector-btn">
            <span class="trip-selector-title">${trip.name}</span>
            <span class="trip-selector-arrow"></span>
          </button>
          <div class="trip-selector-dropdown" id="trip-dropdown">
            <!-- Dynamic trip options injected here -->
          </div>
          <div class="trip-dates">${trip.dates}</div>
        </div>
        
        <div class="header-actions">
          <button class="btn-primary" id="open-expense-modal-btn">
            <span>Registrar gasto</span>
            <img src="/icons/plus.png" alt="+" style="width: 16px; height: 16px;" />
          </button>
          <button class="btn-icon-danger" id="open-delete-trip-modal-btn" title="Eliminar viaje" style="display: flex; align-items: center; justify-content: center;">
            <img src="/icons/trash can.png" alt="Eliminar" style="width: 20px; height: 20px;" class="trash-icon-default" />
            <img src="/icons/white trash can.png" alt="Eliminar" style="width: 20px; height: 20px;" class="trash-icon-hover" />
          </button>
        </div>
      </div>
    </header>
  `;
}

/**
 * Renders the Budget Summary Available Card
 * @param {Object} trip Current trip data
 * @returns {string} HTML string
 */
export function BudgetSummaryComponent(trip) {
  const totalSpent = trip.expenses.reduce((sum, e) => sum + e.amount, 0);
  const availableBudget = Math.max(0, trip.totalBudget - totalSpent);
  const spentPercentage = Math.min(100, (totalSpent / trip.totalBudget) * 100);
  
  // Format decimals for the Figma ".00" gray styling requirement
  const availableStr = availableBudget.toFixed(2);
  const [availInt, availDec] = availableStr.split('.');
  let alertHtml = '';
  if (spentPercentage >= 80) {
    let daysRemaining = 0;
    if (trip.dates) {
      const bounds = trip.dates.split(' a ');
      const tripEnd = bounds.length > 1 ? parseTripBound(bounds[1]) : parseTripBound(bounds[0]);
      if (tripEnd.getTime() > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        tripEnd.setHours(0, 0, 0, 0);
        const diffTime = tripEnd.getTime() - today.getTime();
        if (diffTime > 0) {
          daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
      }
    }
    
    alertHtml = `
      <div class="budget-alert" id="budget-warning-alert">
        <div class="alert-left">
          <img src="/icons/caution.png" alt="Precaución" class="alert-icon" />
          <span class="alert-text">Estás muy cerca de tu límite. Te quedan <strong class="alert-critical">${availableStr} USD</strong> y <strong class="alert-critical">${daysRemaining} días</strong> de viaje.</span>
        </div>
        <button class="alert-close-btn" id="close-alert-btn">
          <img src="/icons/Close.png" alt="Cerrar" class="alert-close-img" />
        </button>
      </div>
    `;
  }

  return `
    <div class="balance-card">
      <h3 class="card-title">Balance</h3>
      <div class="budget-summary">
        <div class="budget-available-title">Presupuesto disponible (USD)</div>
        <div class="budget-available-amount">
          $${availInt}<span>.${availDec}</span>
        </div>
        
        <div class="budget-progress-container">
          <div class="budget-progress-track">
            <div class="budget-progress-fill" style="width: ${spentPercentage}%"></div>
          </div>
          <div class="budget-progress-text">
            Has gastado <span>$${totalSpent.toFixed(0)}</span> de $${trip.totalBudget.toFixed(0)}
          </div>
          ${alertHtml}
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the Daily Spending Chart Card
 * @param {Object} trip Current trip data
 * @returns {string} HTML string
 */
export function ExpenseChartComponent(trip) {
  const chartHeightMax = 160;

  // Determine dynamic range
  const maxVal = Math.max(0, ...Object.values(trip.chartData));
  
  // Calculate a nice step size for 5 grid increments
  let step = Math.ceil(maxVal / 5);
  if (step === 0) step = 20; // Default if empty
  
  // Round up to nearest nice number
  const order = Math.pow(10, Math.floor(Math.log10(step)));
  let niceStep = Math.ceil(step / order) * order;
  const rangeMax = niceStep * 5;

  // Find the index of the last registered expense to prevent collapsing future dates
  let lastExpenseIdx = -1;
  for (let i = trip.chartDates.length - 1; i >= 0; i--) {
    if (trip.chartData[trip.chartDates[i]] > 0) {
      lastExpenseIdx = i;
      break;
    }
  }

  // Process visual items to compress empty days
  const visualItems = [];
  let zeroBuffer = [];

  for (let i = 0; i < trip.chartDates.length; i++) {
    const dateKey = trip.chartDates[i];
    const val = trip.chartData[dateKey] || 0;
    const isAfterLastExpense = i > lastExpenseIdx;

    if (val === 0 && !isAfterLastExpense) {
      zeroBuffer.push(dateKey);
    } else {
      if (zeroBuffer.length > 0) {
        if (zeroBuffer.length <= 2) {
          zeroBuffer.forEach(d => visualItems.push({ type: 'day', dateKey: d, val: 0 }));
        } else {
          const rangeStr = `${zeroBuffer[0]} a ${zeroBuffer[zeroBuffer.length - 1]}`;
          visualItems.push({ type: 'ellipsis', dateKey: rangeStr, val: 0 });
        }
        zeroBuffer = [];
      }
      visualItems.push({ type: 'day', dateKey, val });
    }
  }

  // Generate Grid Background (Y-axis labels and horizontal dashed lines)
  const gridRowsHtml = [5, 4, 3, 2, 1, 0].map((i, index) => {
    const val = niceStep * i;
    const row = index + 1; // grid row 1 to 6
    return `
      <div class="chart-row-label" style="grid-row: ${row}; grid-column: 1;">$${val}</div>
      <div class="chart-row-gridline" style="grid-row: ${row}; grid-column: 3 / -1;"></div>
    `;
  }).join('');

  // X-axis label
  const xAxisLabel = `<div class="chart-axis-title" style="grid-row: 7; grid-column: 1;">Fecha</div>`;

  // Generate Foreground Columns (Bars + Date Labels)
  const columnsHtml = visualItems.map((item, i) => {
    const col = i + 3; // Start from column 3
    const { dateKey, val } = item;
    
    // Bar
    let barHeight = val === 0 ? 4 : Math.min(chartHeightMax, (val / rangeMax) * chartHeightMax);
    if (barHeight < 4) barHeight = 4;
    
    const barHtml = `
      <div class="chart-bar-container" style="grid-row: 1 / 7; grid-column: ${col};">
        <div class="chart-bar" style="height: ${barHeight}px;" data-value="$${val.toFixed(0)}" title="${dateKey}: $${val.toFixed(0)}"></div>
      </div>
    `;
    
    // Label
    let labelHtml;
    if (item.type === 'ellipsis') {
      labelHtml = `<div class="chart-date-label chart-date-ellipsis" data-tooltip="${dateKey}" style="grid-row: 7; grid-column: ${col};">···</div>`;
    } else {
      labelHtml = `<div class="chart-date-label" style="grid-row: 7; grid-column: ${col};">${dateKey}</div>`;
    }
    
    return barHtml + labelHtml;
  }).join('');

  return `
    <div class="chart-card">
      <div class="chart-header">
        <h3 class="card-title">Gastos diarios</h3>
      </div>
      <div class="chart-scroll-wrapper">
        <div class="chart-scroll-inner" style="grid-template-columns: 36px 11px repeat(${visualItems.length}, minmax(52px, 1fr));">
          ${gridRowsHtml}
          ${xAxisLabel}
          ${columnsHtml}
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the Expense List Card
 * @param {Object} trip Current trip data
 * @returns {string} HTML string
 */
export function ExpenseListComponent(trip) {
  if (!trip.expenses || trip.expenses.length === 0) {
    return `
      <div class="expenses-card">
        <div class="expenses-header">
          <h3 class="card-title">Gastos registrados</h3>
          <a href="#" class="expenses-view-all">Ver todos</a>
        </div>
        <div class="expense-empty-state">
          <i class="ph ph-info"></i>
          <span>No hay gastos registrados para este viaje.</span>
        </div>
      </div>
    `;
  }

  // Group expenses by date group
  const groupedExpenses = {};
  trip.expenses.forEach(expense => {
    if (!groupedExpenses[expense.date]) {
      groupedExpenses[expense.date] = [];
    }
    groupedExpenses[expense.date].push(expense);
  });

  // Category Icon helper mapping
  const categoryIconMap = {
    food: '/icons/Burger.png',
    shopping: '/icons/Bag.png',
    transportation: '/icons/car.png'
  };

  // Generate list layout html
  let groupsHtml = '';
  for (const dateGroup in groupedExpenses) {
    const itemsHtml = groupedExpenses[dateGroup].map(expense => {
      const iconSrc = categoryIconMap[expense.categoryKey] || '/icons/Engine.png';
      return `
        <div class="expense-item" data-id="${expense.id}">
          <div class="expense-item-left">
            <div class="expense-category-circle category-${expense.categoryKey}">
              <img src="${iconSrc}" alt="icon" style="width: 25px; height: 25px; object-fit: contain;" />
            </div>
            <div class="expense-info">
              <span class="expense-name">${expense.name}</span>
              <span class="expense-category-name">${expense.category}</span>
            </div>
          </div>
          <div class="expense-item-right">
            <span class="expense-amount">- $${expense.amount.toFixed(2)}</span>
            <button class="expense-delete-btn btn-icon-danger" data-id="${expense.id}" title="Eliminar gasto" style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
              <img src="/icons/trash can.png" alt="Eliminar" style="width: 20px; height: 20px;" class="trash-icon-default" />
              <img src="/icons/white trash can.png" alt="Eliminar" style="width: 20px; height: 20px;" class="trash-icon-hover" />
            </button>
          </div>
        </div>
      `;
    }).join('');

    groupsHtml += `
      <div class="expense-group">
        <h4 class="expense-group-title">${dateGroup}</h4>
        ${itemsHtml}
      </div>
    `;
  }

  return `
    <div class="expenses-card">
      <div class="expenses-header">
        <h3 class="card-title">Gastos registrados</h3>
        <a href="#" class="expenses-view-all">Ver todos</a>
      </div>
      <div class="expenses-list">
        ${groupsHtml}
      </div>
    </div>
  `;
}

/**
 * Renders the Expense Addition Modal — Figma matching (node 14:3435)
 * @returns {string} HTML string
 */
export function ExpenseModalComponent() {
  return `
    <div class="modal-overlay" id="expense-modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <div class="modal-header-left">
            <img src="/icons/coins.png" alt="Registrar" style="width: 24px; height: 24px;" />
            <h3 class="modal-title">Registrar gasto</h3>
          </div>
          <button class="modal-close-btn" id="close-expense-modal-btn">
            <img src="/icons/Close.png" alt="Cerrar" style="width: 16px; height: 16px;" />
          </button>
        </div>

        <form id="add-expense-form">
          <div class="modal-body">
            <div class="modal-fields">

              <div class="form-group">
                <label class="form-label" for="expense-name-input">Nombre del gasto</label>
                <input class="form-input" id="expense-name-input" type="text" placeholder="Escribe el nombre del gasto" required />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="expense-amount-input">Monto</label>
                  <input class="form-input" id="expense-amount-input" type="number" min="0.01" step="0.01" placeholder="0.00" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="expense-date-input">Fecha</label>
                  <input class="form-input" id="expense-date-input" type="date" required />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Categoría</label>
                <div class="category-selector">
                  <div class="category-trigger" id="category-trigger-btn">
                    <div class="category-trigger-content">
                      <img id="category-trigger-icon" src="" alt="" style="width: 20px; height: 20px; display: none; object-fit: contain;" />
                      <span class="category-trigger-text placeholder" id="category-trigger-label">Selecciona una categoría</span>
                    </div>
                    <i class="ph ph-caret-down" style="font-size: 18px; color: var(--color-black);"></i>
                  </div>
                  <div class="category-options-dropdown" id="category-options">
                    <button type="button" class="category-option-btn" data-value="Alimentación" data-key="food" data-icon="/icons/Burger.png">
                      <img src="/icons/Burger.png" alt="food" style="width: 20px; height: 20px;" /> Alimentación
                    </button>
                    <button type="button" class="category-option-btn" data-value="Compras" data-key="shopping" data-icon="/icons/Bag.png">
                      <img src="/icons/Bag.png" alt="shopping" style="width: 20px; height: 20px;" /> Compras
                    </button>
                    <button type="button" class="category-option-btn" data-value="Transporte" data-key="transportation" data-icon="/icons/car.png">
                      <img src="/icons/car.png" alt="transport" style="width: 20px; height: 20px;" /> Transporte
                    </button>
                  </div>
                </div>
                <input type="hidden" id="expense-category-value" required />
                <input type="hidden" id="expense-category-key" required />
              </div>

            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="modal-cancel-btn" id="cancel-expense-modal-btn">Cancelar</button>
            <button type="submit" class="modal-submit-btn" id="expense-submit-btn">Registrar gasto</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

/**
 * Renders the Create New Trip Modal — Figma matching (node 14:3365)
 * @returns {string} HTML string
 */
export function CreateTripModalComponent() {
  return `
    <div class="modal-overlay" id="create-trip-modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <div class="modal-header-left">
            <img src="/icons/pink plane.png" alt="Viaje" style="width: 24px; height: 24px;" />
            <h3 class="modal-title">Crear un nuevo viaje</h3>
          </div>
          <button class="modal-close-btn" id="close-create-trip-modal-btn">
            <img src="/icons/Close.png" alt="Cerrar" style="width: 16px; height: 16px;" />
          </button>
        </div>

        <form id="create-trip-form">
          <div class="modal-body">
            <p class="modal-subtitle">Completa los campos para crear un nuevo presupuesto de viajes.</p>

            <div class="modal-fields">

              <div class="form-group">
                <label class="form-label" for="trip-destination-input">Lugar de destino</label>
                <input class="form-input" id="trip-destination-input" type="text" placeholder="Escribe el destino" required />
              </div>

              <div class="form-row">
                <div class="form-group" style="flex: 3;">
                  <label class="form-label" for="trip-budget-input">Presupuesto total</label>
                  <input class="form-input" id="trip-budget-input" type="number" min="1" step="0.01" placeholder="0.00" required />
                </div>
                <div class="form-currency-group">
                  <label class="form-label">Moneda</label>
                  <div class="form-currency-trigger">
                    <span>USD</span>
                    <i class="ph ph-caret-down" style="font-size: 16px;"></i>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="trip-start-date-input">Fecha de inicio</label>
                  <input class="form-input" id="trip-start-date-input" type="date" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="trip-end-date-input">Fecha final</label>
                  <input class="form-input" id="trip-end-date-input" type="date" required />
                </div>
              </div>

            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="modal-cancel-btn" id="cancel-create-trip-btn">Cancelar</button>
            <button type="submit" class="modal-submit-btn" id="create-trip-submit-btn">Crear viaje</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

/**
 * Renders the Delete Trip Confirmation Modal
 * @returns {string} HTML string
 */
export function DeleteTripModalComponent() {
  return `
    <div class="modal-overlay" id="delete-trip-modal-overlay">
      <div class="modal-container" style="max-width: 450px;">
        <div class="modal-header">
          <div class="modal-header-left">
            <img src="/icons/Pink trash can.png" alt="Eliminar" style="width: 24px; height: 24px;" />
            <h3 class="modal-title">Eliminar viaje</h3>
          </div>
          <button class="modal-close-btn" id="close-delete-trip-modal-btn">
            <img src="/icons/Close.png" alt="Cerrar" style="width: 16px; height: 16px;" />
          </button>
        </div>

        <div class="modal-body" style="padding-top: 16px;">
          <p class="modal-subtitle" style="margin-bottom: 0;">¿Estás seguro de que deseas eliminar este viaje? Esta acción no se puede deshacer y se borrarán todos los gastos registrados en él.</p>
        </div>

        <div class="modal-actions" style="margin-top: 32px;">
          <button type="button" class="modal-cancel-btn" id="cancel-delete-trip-btn">Cancelar</button>
          <button type="button" class="modal-submit-btn active" id="confirm-delete-trip-btn" style="background-color: var(--color-pink);">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the Delete Expense Confirmation Modal
 * @returns {string} HTML string
 */
export function DeleteExpenseModalComponent() {
  return `
    <div class="modal-overlay" id="delete-expense-modal-overlay">
      <div class="modal-container" style="max-width: 450px;">
        <div class="modal-header">
          <div class="modal-header-left">
            <img src="/icons/Pink trash can.png" alt="Eliminar" style="width: 24px; height: 24px;" />
            <h3 class="modal-title">Eliminar gasto</h3>
          </div>
          <button class="modal-close-btn" id="close-delete-expense-modal-btn">
            <img src="/icons/Close.png" alt="Cerrar" style="width: 16px; height: 16px;" />
          </button>
        </div>

        <div class="modal-body" style="padding-top: 16px;">
          <p class="modal-subtitle" style="margin-bottom: 0;">¿Estás seguro de que deseas eliminar este gasto? Esta acción no se puede deshacer.</p>
        </div>

        <div class="modal-actions" style="margin-top: 32px;">
          <button type="button" class="modal-cancel-btn" id="cancel-delete-expense-btn">Cancelar</button>
          <button type="button" class="modal-submit-btn active" id="confirm-delete-expense-btn" style="background-color: var(--color-pink);">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  `;
}
