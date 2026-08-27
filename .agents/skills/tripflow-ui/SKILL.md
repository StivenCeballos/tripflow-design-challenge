---
name: tripflow-ui
description: Figma-derived design tokens, component specifications, and implementation rules for the Tripflow project.
---

# Tripflow UI Design System

## Purpose
This Skill defines the visual guidelines, design tokens, component structures, and implementation rules derived directly from the Tripflow Figma Design System. It serves as the single, persistent source of truth for the codebase's UI styling.

## Source of Truth
The visual design is defined by the following Figma document:
- **Figma Design System URL**: [Figma Design File](https://www.figma.com/design/3hRYfNVOFXlOnyhJPyNyDC/Alregra-design-challenge?node-id=20-22&t=yeFaYw6DsAF6sgk8-4)
- **Visual Source of Truth**: Figma. Do not approximate or invent visual rules not specified in this document.

## Technology Constraints
To ensure optimal performance, compatibility, and simplicity, the Tripflow codebase must conform to these constraints:
- **Bundler**: Vite
- **Structure**: Vanilla HTML5, Vanilla CSS3, Vanilla ES6 JavaScript
- **Frameworks**: NO React, Vue, Angular, or other heavy runtime frameworks
- **Icon Library**: Phosphor Icons (imported via `@phosphor-icons/web` in package/imports)
- **Dependencies**: Keep dependencies to an absolute minimum; implement custom components instead of adding external UI packages.

## Design Tokens

### Colors
These colors are explicitly defined in the Figma Design System:

| Figma Token Name | Value | Hex Code | Semantic Role |
| :--- | :--- | :--- | :--- |
| `Pink` | `rgb(217, 45, 111)` | `#D92D6F` | Brand Action / Active State / Primary Accent |
| `Pink light` | `rgb(253, 239, 244)` | `#FDEFF4` | Primary Hover / Active Navigation Background |
| `black` | `rgb(43, 43, 43)` | `#2B2B2B` | Core Heading Text / Strong Labels |
| `white` | `rgb(255, 255, 255)` | `#FFFFFF` | Card Surface / Page Background |
| `gray` | `rgb(200, 207, 223)` | `#C8CFDF` | Light Border / Disabled Background |
| `gray light` | `rgb(247, 248, 250)` | `#F7F8FA` | Neutral Light Background |
| `gray dark` | `rgb(156, 167, 191)` | `#9CA7BF` | Muted Text / Inactive Nav Icons / Chart Labels |
| `red` | `rgb(208, 74, 76)` | `#D04A4C` | Alert Boundary / Error Text |
| `red light` | `rgb(255, 232, 232)` | `#FFE8E8` | Alert Background |
| `yellow` | `rgb(228, 140, 77)` | `#E48C4D` | Food Category Accent / Warning State |
| `yellow light` | `rgb(255, 244, 237)` | `#FFF4ED` | Food Category Icon Background |
| `purple` | `rgb(126, 73, 168)` | `#7E49A8` | Shopping Category Accent |
| `purple light` | `rgb(243, 233, 251)` | `#F3E9FB` | Shopping Category Icon Background |
| `blue` | `rgb(95, 124, 183)` | `#5F7CB7` | Transportation Category Accent |
| `blue light` | `rgb(241, 246, 255)` | `#F1F6FF` | Transportation Category Icon Background |

### Typography
The font family for all styles is **Parkinsans**. A fallback system font stack (e.g., `system-ui, -apple-system, sans-serif`) should be used. The letter spacing for all typography tokens is `-0.019em`.

| Token Name | Font Size | Font Weight | Line Height | Description |
| :--- | :--- | :--- | :--- | :--- |
| `Hero` | `40px` | `700` (Bold) | `32px` | Main available budget amount |
| `H1` | `32px` | `700` (Bold) | `32px` | Brand / Logo text |
| `H2` | `24px` | `700` (Bold) | `32px` | Main page headings |
| `H3` | `20px` | `700` (Bold) | `32px` | Component card headings |
| `H4` | `16px` | `700` (Bold) | `20px` | Section headings |
| `Action B` | `16px` | `600` (SemiBold) | `32px` | Main buttons, active nav text |
| `Action` | `16px` | `400` (Regular) | `32px` | Inputs, dropdown values, inactive nav text |
| `Body B` | `14px` | `700` (Bold) | `32px` | Form field labels, total spent labels |
| `Body M` | `14px` | `500` (Medium) | `20px` | Category list item descriptions, alert body |
| `Caption` | `12px` | `400` (Regular) | `18px` | Small alert bodies, date axis labels |
| `Caption M` | `12px` | `500` (Medium) | `18px` | Category list item sub-labels |
| `Caption XS Bold` | `10px` | `700` (Bold) | `32px` | Active mobile tab bar label |
| `Caption XS` | `10px` | `500` (Medium) | `32px` | Inactive mobile tab bar label |

### Spacing Scale
The spacing system uses the following increments observed in Figma layout paddings and gaps:
- `4px`: Mini gaps, tight padding (e.g., progress indicator label gap)
- `6px`: Alert horizontal layout gaps
- `8px`: Dense padding/gaps (e.g., inputs, list items padding, active nav padding)
- `10px`: Input field internal layout gaps
- `11px`: Daily expense chart labels alignment spacer
- `12px`: Standard gap, card inner padding (e.g., button gap, expense item gap, alert padding)
- `16px`: Layout padding (e.g., sidebar padding, nav bar padding, input padding)
- `20px`: Desktop budget summary item layout gap
- `24px`: Desktop header section spacing, button horizontal padding
- `40px`: Large layout container spacing (e.g., sidebar top brand margin)

### Border Radius
- `4px`: Chart bar top corners (`4px 4px 0px 0px`), side menu active indicator
- `8px`: Input boxes, Dropdowns, Date field boxes, Chart card containers
- `12px`: Buttons, Alert boxes, Expense item cards
- `40px`: Progress bar pill container/capsule background
- `94px` / `95px` (Circular): Category icon circles, user avatar circle

### Borders
- **Standard Border**: `1px solid var(--gray)` (`#C8CFDF`) - used for Inputs, Dropdowns, Date fields, Expense items, and Mobile Nav Bar (top border only).
- **Error Border**: `1px solid var(--red)` (`#D04A4C`) - used for Alerts.

### Shadows & Elevation
- **Card Shadow** (`effect_29752526`): `0px 2px 10px 0px rgba(220, 228, 229, 1)` (used for Daily Expenses)
- **Alert Shadow** (`effect_156bdd74`): `0px 1px 8px 0px rgba(81, 81, 81, 0.1)` (used for Alerts)

---

## Components

### 1. Input
- **Structure**: Vertical layout. Label at the top, text input field below.
- **Label**: Font `Body B`, Color `black` (`#2B2B2B`), Text "Lugar de destino"
- **Input Field**: Padding `8px 16px`, Height `48px`, Gap `10px`, Border `1px solid gray` (`#C8CFDF`), Border Radius `8px`, Background `white` (`#FFFFFF`).
- **Placeholder/Value Text**: Font `Action` (Regular), Color `gray` (`#C8CFDF`), Text "Escribe el destino".

### 2. Button
- **Structure**: Horizontal layout with centered text and optional right icon.
- **Status=Default**:
  - Background: `Pink` (`#D92D6F`)
  - Text: Font `Action B`, Color `white` (`#FFFFFF`)
  - Padding: `8px 24px`
  - Gap: `12px`
  - Border Radius: `12px`
  - Icon: Right side, `20px x 20px` (Phosphor counterpart: `ph ph-caret-right` or `ph ph-arrow-right`)
- **Status=disabled**:
  - Background: `gray` (`#C8CFDF`)
  - Text: Font `Action B`, Color `white` (`#FFFFFF`)
  - Padding: `8px 24px`
  - Gap: `12px`
  - Border Radius: `12px`
  - Icon: Right side, `20px x 20px`

### 3. Budget Summary
- **platform=mobile**:
  - Container: `padding: 0 0 16px 0` (no top padding, bottom padding 16px).
  - Width: `320px`
  - Top text group (gap `8px`):
    - Value: Font `Hero` (Bold 40px), Color `black (2:163)` (`#333333`). Decimals `.00` should use color `gray` (`#C8CFDF`).
    - Label: Font `Action B`, Color `black (2:163)` (`#333333`), text "Presupuesto disponible (USD)"
  - Progress indicator group (gap `4px`):
    - Progress Bar: Height `6px`, Border Radius `40px`. Filled section uses `Pink` (`#D92D6F`), background is `gray light` or `gray`.
    - Text: Font `Body B`, Color `gray dark` (`#9CA7BF`), text is "Has gastado `$200` de `$500`" (where the spent value `$200` is colored `Pink` `#D92D6F`).
- **platform=platform2 (desktop)**:
  - Width: `503px`
  - Top text group (gap `24px`):
    - Label: Font `H3`, Color `black (2:163)`, text "Presupuesto disponible (USD)"
    - Value: Font `Hero` (Bold 40px), Color `black (2:163)`. Decimals `.00` use color `gray` (`#C8CFDF`).
  - Progress indicator group (gap `12px`):
    - Progress Bar: Height `16px`, Border Radius `40px`.
    - Text: Font `H3` (Bold 20px) or `Body B`, Color `gray dark` (`#9CA7BF`), text "Has gastado `$200` de `$500`" (spent value in `Pink`).

### 4. Desktop Side Menu
- **Structure**: Column layout, Width `240px`, Height `1024px`, Background `white` (`#FFFFFF`).
- **Layout**: Top section contains brand logo and nav items; bottom section contains user profile and logout.
- **Top Section**: Gap `40px`.
  - Brand Logo: Gap `12px`. Icon `40px x 40px`. Text "tripflow" in Font `H1`, Color `black`.
  - Nav Items Container: Gap `12px`.
    - **Active Item ("Resumen")**: Padding `8px`, Gap `8px`, Background `Pink light` (`#FDEFF4`), Border Radius `4px`. Icon `28px x 28px` in `Pink` (`#D92D6F`). Text in Font `Action B`, Color `Pink` (`#D92D6F`).
    - **Inactive Item ("Viajes")**: Padding `8px`, Gap `8px`, Background transparent. Icon `28px x 28px` in `gray dark` (`#9CA7BF`). Text in Font `Action`, Color `gray dark` (`#9CA7BF`).
    - **Inactive Item ("Historial")**: Same as Inactive Item ("Viajes").
- **Bottom Section**: Padding `8px`, justify-content `space-between`.
  - User Info: Row layout, gap `8px`. Circular Avatar `28px x 28px` in `pink light` (`#ffe6eb`) containing profile vector icon. Name in Font `Action`, Color `gray dark` (`#9CA7BF`).
  - Exit Icon: Right side, `24px x 24px` icon in `gray dark` (`#9CA7BF`) (Phosphor counterpart: `ph ph-sign-out`).

### 5. Alert
- **Global specs (mobile & desktop)**:
  - Styling: Background `red light` (`#FFE8E8`), Border `1px solid red` (`#D04A4C`), Border Radius `12px`, Padding `12px` (desktop adds horizontal padding `16px`).
  - Layout: `display: flex`, `justify-content: space-between`, `align-items: center`, `gap: 8px`.
  - Left Section (gap `8px`):
    - Icon `32px x 32px` (Phosphor counterpart: `ph ph-warning-circle`).
    - Text in Font `Body M` (Medium 14px, line-height 20px), Color `black (2:163)`.
    - Exact copy: `"Solo quedan <strong class="alert-critical">${disponible} USD</strong> disponibles y todavía quedan <strong class="alert-critical">${dias} día(s)</strong> de viaje."`
    - Critical text ("X USD", "X día(s)") must be bold/medium (`500`) and colored `red` (`#D04A4C`).
  - Right Close Button: Container size `30px x 30px`, Close icon `16px x 16px` (Phosphor counterpart: `ph ph-x`), Color `black`.

### 6. Daily Expenses (Chart Card)
- **Property 1=Default (mobile)**:
  - Width `320px`, Padding `8px 12px`, Background `white`, Border Radius `8px`, Box Shadow `effect_29752526`.
  - Header: Gap `2px`. Title "Gastos diarios" in Font `Action B`, Color `black`.
  - Grid: 6 dashed lines (dash array `2, 2`, color `gray` `#C8CFDF`) representing `$100`, `$80`, `$60`, `$40`, `$20`, and `$0`.
  - Labels: Width `29px` or `36px` aligned to the left of the grid. Font `Caption`, Color `gray dark` (`#9CA7BF`).
  - Bars: Absolute positioning. Width `28px`, background `gray dark` (`#9CA7BF`), border-radius `4px 4px 0px 0px`. Heights: `$60` bar = `144px`, `$80` bar = `129px`, `$20` bar = `48px`. (Note: coordinates relative to chart grid area).
  - X-Axis: Row layout, spacer width `36px`, container width `258px` displaying dates `"24 Ago"`, `"25 Ago"`, `"26 Ago"`, `"27 Ago"`, `"28 Ago"`. Font `Caption`, Color `gray dark`.
- **Property 1=Variant2 (desktop)**:
  - Width `577px`, Padding `8px 12px`, Background `white`, Border Radius `8px`, Box Shadow `effect_29752526`.
  - Header: Title "Gastos diarios" uses `.card-title` sizing globally (`20px`, `700`, Color `black`).
  - Grid & Labels: Same style, X-Axis labels container width `470px`.
  - Bars: Width `38px`. Colors, radius, and values same as mobile.

#### 6b. Chart Implementation Details (Implemented Behavior)
The chart implementation goes significantly beyond the static Figma spec. The following behaviors have been implemented and must be preserved:

**Dynamic Y-axis scale:**
- The Y-axis is NOT fixed at `$0–$100`. It scales automatically based on the maximum daily expense.
- A `niceStep` is calculated by rounding `maxVal / 5` up to the nearest order of magnitude, producing clean round numbers (e.g., `$20`, `$50`, `$100`).
- The grid always displays exactly 6 rows (5 increments), showing values `niceStep * 0` through `niceStep * 5`.
- If no expenses exist, the default step is `$20`.

**Date compression (ellipsis logic):**
- Consecutive dates with `$0` spending that occur *before* the last registered expense are compressed.
- If ≤ 2 zero-days in a row → shown individually as empty bars.
- If ≥ 3 zero-days in a row → collapsed into a single `···` ellipsis column with a tooltip showing the date range.
- Dates *after* the last expense are **not shown** (truncated from the chart).
- The chart only renders columns up to and including the last date with a registered expense.

**Bar rendering:**
- Bar height is computed as `(val / rangeMax) * chartHeightMax` where `chartHeightMax = 160px`.
- A minimum bar height of `4px` is enforced for days with `$0` to stay visually present.
- Each bar has a `data-value` and `title` attribute showing the amount on hover.

**CSS Grid layout:**
- The chart uses a CSS Grid with `grid-template-columns: 36px 11px repeat(N, minmax(52px, 1fr))` where N = number of visual columns.
- Column 1 = Y-axis labels, Column 2 = spacer, Columns 3+ = data bars + date labels.
- Rows 1–6 = grid lines + bar containers, Row 7 = X-axis date labels.

**Scrollable container:**
- The chart is wrapped in `.chart-scroll-wrapper` (overflow-x: auto) to support horizontal scrolling when bars exceed the card width.
- On initial render, the scroll is automatically set to `scrollLeft = scrollWidth` so the most recent dates are visible by default.

**Category icon assets** (used in expense items, referenced by `categoryIconMap`):
- `food` / `Alimentación`: `/icons/Hamburger.png`
- `shopping` / `Compras`: `/icons/Shopping bag.png`
- `transportation` / `Transporte`: `/icons/Car.png`
- Other/default: `/icons/Engine.png`

### 7. Mobile Nav Bar
- **Structure**: Bottom fixed navigation bar. Width `360px`, Padding `12px 16px`, justify-content `space-between`, Background `white` (`#FFFFFF`), Top border `1px solid gray` (`#C8CFDF`).
- **Items**: 3 navigation items in column layout, width `80px`, gap `1px`, items center.
  - **Active ("Resumen")**: Icon `24px x 24px` in `Pink` (`#D92D6F`), Label text "Resumen" in Font `Caption XS Bold`, Color `Pink`.
  - **Inactive ("Viajes")**: Icon `24px x 24px` in `gray dark` (`#9CA7BF`), Label text "Viajes" in Font `Caption XS`, Color `gray dark`.
  - **Inactive ("Historial")**: Icon `24px x 24px` in `gray dark` (`#9CA7BF`), Label text "Historial" in Font `Caption XS`, Color `gray dark`.
- **Icon Assets** (IMPORTANT — uses local image files, NOT Phosphor icons on mobile):
  - Resumen: `/icons/Home.png` (apply CSS pink filter when active)
  - Viajes active: `/icons/pink plane.png`, inactive: `/icons/plane.png`
  - Historial: `/icons/book.png` (apply CSS pink filter when active)

### 7b. Mobile Header — Delete Trip Button (`header-delete-mobile`)
- **Placement**: Right side of the mobile `<header>`, opposite the user avatar.
- **Only visible on mobile** (`display: none` on desktop via global rule).
- **Visual spec**:
  - Container: `36px x 36px`, Border Radius `12px` (`var(--radius-md)`), Background `#ffe6eb` (pink light tint).
  - Icon (default state): `/icons/trash can.png`, `28px x 28px`.
  - Icon (hover state): `/icons/white trash can.png`, `28px x 28px`.
  - Hover: Background changes to `Pink` (`#D92D6F`), default icon hidden, white icon shown.
- **CSS classes**: `header-delete-mobile btn-icon-danger` (inherits the shared danger-icon style).
- **HTML** (inside `<header>` in `HeaderComponent`):
  ```html
  <button class="header-delete-mobile btn-icon-danger" id="open-delete-trip-modal-btn-mobile" title="Eliminar viaje">
    <img src="/icons/trash can.png" alt="Eliminar" style="width: 20px; height: 20px;" class="trash-icon-default" />
    <img src="/icons/white trash can.png" alt="Eliminar" style="width: 20px; height: 20px;" class="trash-icon-hover" />
  </button>
  ```

### 7c. Mobile Header — User Avatar (`header-avatar-mobile`)
- **Placement**: Left side of the mobile `<header>`, opposite the delete button.
- **Only visible on mobile** (`display: none` on desktop via global rule).
- **Visual spec**:
  - Container: `36px x 36px`, Border Radius `50%` (circular), Background `#ffe6eb` (pink light), No border.
  - Icon: `/icons/user.png` (or equivalent), `28px x 28px` (object-fit: contain), no color filter.

### 7d. Mobile Header Container (`.header`)
- **Layout**: `display: flex`, row layout, `justify-content: space-between`, `align-items: center`.
- **Spacing**: `padding: 20px 20px 16px 20px`. Uses negative margins (`-16px -16px 0 -16px`) to break out of the viewport padding and touch the edges. Height is `auto`.
- **Styling**: Background `white`, bottom border `1px solid gray light`.

### 7e. Header Trip Selector Text
- **Trip Title**: Must use the `<h2 class="trip-selector-title">` tag. Font size `24px` (H2 equivalent), weight `700`, line-height `32px`, margin `0`.
- **Trip Dates**: Must use the `<h3 class="trip-dates">` tag. Font size `16px` (Action B equivalent), weight `600`, color `gray dark`, `margin: 4px 0 0 0`.

### 8. Expense Item
- **Variants**: `type=food`, `type=shopping`, `type=transportation`.
- **Structure**: Width `288px`, Padding `8px 12px`, justify-content `space-between`, items center, Background `white` (`#FFFFFF`), Border `1px solid gray` (`#C8CFDF`), Border Radius `12px`.
- **Left Column**: Row layout, gap `12px`, items center.
  - Category Circle: Circular container (`32px x 32px`, Border Radius `94px`).
    - **`food`**: Background `yellow light` (`#FFF4ED`), icon color `yellow` (`#E48C4D`). Icon represents food (Phosphor: `ph ph-hamburger` or `ph ph-fork-knife`).
    - **`shopping`**: Background `purple light` (`#F3E9FB`), icon color `purple` (`#7E49A8`). Icon represents shopping bag (Phosphor: `ph ph-tag` or `ph ph-shopping-bag`).
    - **`transportation`**: Background `blue light` (`#F1F6FF`), icon color `blue` (`#5F7CB7`). Icon represents transportation (Phosphor: `ph ph-car` or `ph ph-bus`).
  - Text Labels (gap `0` / column):
    - Title: Font `Body M` (Medium 14px), Color `black`, text represents name. 
      - **Truncation**: Constrained to roughly 50% of the container (`max-width: 130px` on mobile, `220px` on desktop) using `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis`.
      - **Tooltip**: Truncated names are wrapped in a `.expense-name-wrapper` container with `data-fullname`. Hovering (desktop) or tapping (mobile) displays a floating dark tag with the full text (`font-size: 12px`, `background: black`).
    - Subtitle: Font `Caption M` (Medium 12px), Color `gray dark` (`#9CA7BF`), text represents category label ("Alimentación", "Compras", "Transporte").
- **Right Column**: Row layout, gap `8px`, items center.
  - Price text in Font `Body B` (Bold 14px), Color `black` (e.g., `- $30.00`).
  - **Delete Button** (`expense-delete-btn btn-icon-danger`): `36px x 36px`, Border Radius `12px`, Background `#ffe6eb`.
    - Default icon: `/icons/trash can.png`, `20px x 20px` (class `trash-icon-default`).
    - Hover icon: `/icons/white trash can.png`, `20px x 20px` (class `trash-icon-hover`).
    - Hover state: Background `Pink` (`#D92D6F`), default icon hidden, hover icon shown.
    - Clicking opens the Delete Expense confirmation modal.
  - **HTML pattern**:
    ```html
    <button class="expense-delete-btn btn-icon-danger" data-id="{expense.id}" title="Eliminar gasto" style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
      <img src="/icons/trash can.png" alt="Eliminar" style="width: 20px; height: 20px;" class="trash-icon-default" />
      <img src="/icons/white trash can.png" alt="Eliminar" style="width: 20px; height: 20px;" class="trash-icon-hover" />
    </button>
    ```

### 8b. Expenses List Container
- **Header**: Contains the `<h3 class="card-title">Gastos registrados</h3>` title (`20px`, `700`).
- **View All**: The "Ver todos" anchor link has been permanently removed from both the empty and populated states (it no longer exists in the UI).

### 9. Dropdown
- **Structure**: Column container. Label at top, Dropdown box below.
- **Label**: Font `Body B`, Color `black`, text "Text" (optional or dynamic).
- **Dropdown Box**: Row layout, padding `8px 16px`, items center, gap `12px`, height `48px`, background `white`, border `1px solid gray` (`#C8CFDF`), border-radius `8px`.
- **Value**: Font `Action` (Regular 16px), Color `gray` (`#C8CFDF`) or `black`. Placeholder is "USD".
- **Icon**: Chevron icon `18.92px x 10.27px` (Phosphor counterpart: `ph ph-caret-down`), Color `black`.

### 10. Date Field
- **Structure**: Column container. Label at top, Date input box below.
- **Label**: Font `Body B`, Color `black`, text "Fecha de inicio".
- **Date Box**: Row layout, padding `8px 16px`, items center, gap `10px`, height `48px`, background `white`, border `1px solid gray` (`#C8CFDF`), border-radius `8px`.
- **Value**: Font `Action`, Color `gray` (`#C8CFDF`), text "DD/MM/AA".
- **Icon**: Right side. Calendar icon `24px x 24px` (Phosphor counterpart: `ph ph-calendar`), Color `gray dark` / `black`.

---

## Layout & Responsive Rules
The Figma Design System specifies two distinct platforms:
- **Mobile Viewport**: Targeted width of `360px`. Utilizes the `platform=mobile` variants of components (e.g., Mobile Alert, Mobile Budget summary, Mobile Nav Bar, Mobile Daily Expenses).
- **Desktop Viewport**: Targeted layout containing the `desktop side menu` (`240px` wide) on the left and the main contents on the right, utilizing desktop-specific variants (e.g., Desktop Alert, Desktop Budget summary, Desktop Daily Expenses).
- **Responsive Layout Breakpoint**: The design elements imply a breakpoint around `768px` or `1024px` to switch from mobile structures (bottom navigation bar, $320px$ width cards) to desktop structures (left side menu, $500px+$ width cards). Since figma does not explicitly define this breakpoint, it should be set to `768px` or `1024px` in the CSS implementation using media queries.

---

## Implementation Rules
To translate these designs into a clean, maintainable vanilla web application codebase:

1. **CSS Custom Properties**: Define all design tokens in `src/style.css` using CSS custom variables on the `:root` scope. Do not hardcode values.
   - Example variables:
     ```css
     :root {
       --font-family: 'Parkinsans', system-ui, -apple-system, sans-serif;
       --color-pink: #D92D6F;
       --color-pink-light: #FDEFF4;
       --color-black: #2B2B2B;
       --color-white: #FFFFFF;
       --color-gray: #C8CFDF;
       --color-gray-light: #F7F8FA;
       --color-gray-dark: #9CA7BF;
       --color-red: #D04A4C;
       --color-red-light: #FFE8E8;
       --color-yellow: #E48C4D;
       --color-yellow-light: #FFF4ED;
       --color-purple: #7E49A8;
       --color-purple-light: #F3E9FB;
       --color-blue: #5F7CB7;
       --color-blue-light: #F1F6FF;

       --radius-xs: 4px;
       --radius-sm: 8px;
       --radius-md: 12px;
       --radius-pill: 40px;
       --radius-circle: 50%;

       --shadow-card: 0px 2px 10px 0px rgba(220, 228, 229, 1);
       --shadow-alert: 0px 1px 8px 0px rgba(81, 81, 81, 0.1);
     }
     ```
2. **Reusability and DRY**: Create components using semantic markup and reusable utility styles instead of repeating raw values in multiple CSS blocks.
3. **No Hardcoded Layouts**: Structure pages using Flexbox and CSS Grid. Use the exact spacing margins (`4px`, `8px`, `12px`, `16px`, `24px`, `40px`) to drive padding and gap sizes.
4. **Phosphor Icons Integration**: Use Phosphor Web Icons (`<i class="ph ph-..."></i>`) rather than drawing custom inline SVGs. Select the icon names that match the Figma shapes:
   - `Close`: `ph ph-x`
   - `Alert Close`: `ph ph-x`
   - `Alert Warning Icon`: `ph ph-warning-circle` (or `ph-warning`)
   - `Dropdown Chevron`: `ph ph-caret-down`
   - `Calendar`: `ph ph-calendar`
   - `Summary Tab Icon`: `ph ph-chart-pie` (or `ph-squares-four`)
   - `Trips Tab Icon`: `ph ph-airplane-takeoff` (or `ph-compass`)
   - `History Tab Icon`: `ph ph-clock-counter-clockwise` (or `ph-clock`)
   - `Logout`: `ph ph-sign-out`
   - `Avatar Placeholder`: `ph ph-user`
   - `Food/Alimentación Icon`: `ph ph-hamburger` (or `ph-fork-knife`)
   - `Shopping/Compras Icon`: `ph ph-shopping-bag` (or `ph-tag`)
   - `Transportation/Transporte Icon`: `ph ph-car` (or `ph-bus`)
5. **No Frameworks**: All UI components must be created and updated via Vanilla JS DOM manipulation (e.g., `document.createElement`, HTML templates, or class updates). No React or other runtime libraries.

## Figma MCP Usage
- Figma should be treated as the visual source of truth.
- Do not repeatedly query the same Figma information.
- Prefer using the Design System information documented in this Skill after the initial extraction.
- Query Figma again only when information required for implementation is missing or ambiguous.
- Do not waste MCP calls retrieving information that is already documented in this Skill.

## Important Constraints
- **No React**: Use only vanilla web technologies (HTML, CSS, JS).
- **No Unnecessary Frameworks**: Standard DOM APIs only.
- **Phosphor Icons**: Always use Phosphor Icons from the `@phosphor-icons/web` package for icon assets.
- **Preserve Project Structure**: Keep existing directories and file structure (e.g., `src/main.js`, `src/style.css`, etc.) unless modification is explicitly requested.
- **No Inventions**: Do not invent design tokens, spacing scales, or styles that deviate from Figma.
- **No Silent Approximations**: When implementing layouts, match the exact padding, border, and color values defined here.

## Missing/Undetermined in Figma Design System
These details are not defined in the Figma design and must be resolved during implementation or clarified with the user:
- **Input Focus/Active/Error States**: Figma only defines the placeholder state. Focused borders, focus ring outlines, and input error borders must be defined during implementation.
- **Dropdown List UI**: The visual style, colors, padding, scrollbars, and shadows of the dropdown options menu when clicked are undefined.
- **Date Picker UI**: There is no visual calendar popup or date selection interface designed.
- **Responsive Transitions**: No viewport transition logic or intermediate layout widths are defined.
- **Interaction Feedback**: Hover, active, focus, and disabled states are not defined for buttons (only Default and Disabled status), nav items, or list cards.
- **Other Category Tokens**: The system only provides colors and structures for "Alimentación", "Compras", and "Transporte". Other expense categories are undefined.
- **Dark Mode Theme**: Only a light theme is defined in the Figma file.
