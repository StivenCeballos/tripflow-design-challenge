// UI Component Library for Tripflow based on Figma specifications

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
        
        <button class="btn-primary" id="open-expense-modal-btn">
          <span>Registrar gasto</span>
          <img src="/icons/plus.png" alt="+" style="width: 16px; height: 16px;" />
        </button>
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
  const chartHeightMax = 160; // Equivalent to the absolute overlay grid height (160px)
  const rangeMax = 100; // Figma range scale goes up to $100

  // Build the bars HTML
  const barsHtml = trip.chartDates.map(dateKey => {
    const val = trip.chartData[dateKey] || 0;
    // Calculate relative height in pixels
    const barHeight = Math.min(chartHeightMax, (val / rangeMax) * chartHeightMax);
    return `
      <div class="chart-bar-container">
        <div class="chart-bar" style="height: ${barHeight}px;" data-value="$${val.toFixed(2)}" title="${dateKey}: $${val.toFixed(2)}"></div>
      </div>
    `;
  }).join('');

  // Build the date labels
  const dateLabelsHtml = trip.chartDates.map(dateKey => {
    return `<span class="chart-date-label">${dateKey}</span>`;
  }).join('');

  return `
    <div class="chart-card">
      <div class="chart-header">
        <h3 class="card-title">Gastos diarios</h3>
      </div>
      <div class="chart-body">
        <div class="chart-row">
          <span class="chart-row-label">$100</span>
          <div class="chart-row-gridline"></div>
        </div>
        <div class="chart-row">
          <span class="chart-row-label">$80</span>
          <div class="chart-row-gridline"></div>
        </div>
        <div class="chart-row">
          <span class="chart-row-label">$60</span>
          <div class="chart-row-gridline"></div>
        </div>
        <div class="chart-row">
          <span class="chart-row-label">$40</span>
          <div class="chart-row-gridline"></div>
        </div>
        <div class="chart-row">
          <span class="chart-row-label">$20</span>
          <div class="chart-row-gridline"></div>
        </div>
        <div class="chart-row">
          <span class="chart-row-label">$0</span>
          <div class="chart-row-gridline"></div>
          
          <!-- Absolute Positioned Bars Overlay -->
          <div class="chart-bars-overlay">
            ${barsHtml}
          </div>
        </div>
      </div>
      <div class="chart-footer">
        <span class="chart-axis-title">Fecha</span>
        <div class="chart-dates-container">
          ${dateLabelsHtml}
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
              <img src="${iconSrc}" alt="icon" style="width: 31px; height: 31px; object-fit: contain;" />
            </div>
            <div class="expense-info">
              <span class="expense-name">${expense.name}</span>
              <span class="expense-category-name">${expense.category}</span>
            </div>
          </div>
          <span class="expense-amount">- $${expense.amount.toFixed(2)}</span>
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
 * Renders the Expense Addition Modal
 * @returns {string} HTML string
 */
export function ExpenseModalComponent() {
  return `
    <div class="modal-overlay" id="expense-modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">Registrar gasto</h3>
          <button class="modal-close-btn" id="close-expense-modal-btn">
            <i class="ph ph-x"></i>
          </button>
        </div>
        <form id="add-expense-form">
          <div class="modal-body">
            
            <div class="form-group">
              <label class="form-label" for="expense-name-input">Nombre del gasto</label>
              <input class="form-input" id="expense-name-input" type="text" placeholder="Escribe el nombre del gasto" required />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="expense-amount-input">Monto (USD)</label>
                <input class="form-input" id="expense-amount-input" type="number" min="0.01" step="0.01" placeholder="0.00" required />
              </div>

              <div class="form-group">
                <label class="form-label" for="expense-date-input">Fecha</label>
                <input class="form-input" id="expense-date-input" type="text" placeholder="DD/MM/AA" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Categoría</label>
              <div class="category-selector">
                <div class="category-trigger" id="category-trigger-btn">
                  <span class="category-trigger-text placeholder" id="category-trigger-label">Selecciona una categoría</span>
                  <img src="/icons/chevron.png" alt="v" style="width: 20px; height: 20px;" />
                </div>
                <div class="category-options-dropdown" id="category-options">
                  <button type="button" class="category-option-btn" data-value="Alimentación" data-key="food">
                    <img src="/icons/Burger.png" alt="food" style="width: 20px; height: 20px;" /> Alimentación
                  </button>
                  <button type="button" class="category-option-btn" data-value="Compras" data-key="shopping">
                    <img src="/icons/Bag.png" alt="shopping" style="width: 20px; height: 20px;" /> Compras
                  </button>
                  <button type="button" class="category-option-btn" data-value="Transporte" data-key="transportation">
                    <img src="/icons/car.png" alt="transport" style="width: 20px; height: 20px;" /> Transporte
                  </button>
                </div>
              </div>
              <input type="hidden" id="expense-category-value" required />
              <input type="hidden" id="expense-category-key" required />
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" id="cancel-expense-modal-btn">Cancelar</button>
            <button type="submit" class="btn-primary">Registrar</button>
          </div>
        </form>
      </div>
    </div>
  `;
}
