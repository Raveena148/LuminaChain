# ChainVault Design System

This document outlines the scalable SCSS architecture and responsive design strategy used in the ChainVault frontend.

## 🎨 Architecture Overview

We use a modular SCSS architecture to separate concerns and ensure maintainability.

```
styles/
├── _variables.scss    # Design tokens (Colors, Typography, Spacing)
├── _mixins.scss       # Reusable logic (Breakpoints, Effects)
└── globals.scss       # Global reset and utility classes
```

### 1. Variables (`_variables.scss`)
Central source of truth for all design tokens.
- **Colors**: `$primary`, `$secondary`, `$success`, `$glass`
- **Gradients**: `$gradient-primary`, `$gradient-card`
- **Layout**: `$container-max-width`, `$header-height`

### 2. Mixins (`_mixins.scss`)
Helper functions to speed up development and ensure consistency.

**Responsive Design:**
```scss
@include mobile { ... } // < 768px
@include tablet { ... } // < 1024px
```

**Visual Effects:**
```scss
@include glass;        // Applies glassmorphism background & blur
@include gradient-text; // Applies gradient text effect
@include card-hover;   // Standard hover lift & shadow
@include flex-center;  // Flexbox centering shortcut
```

## 📱 Responsive Strategy

### 1. Grid Layouts
We use `CSS Grid` with `auto-fit` for flexible dashboard layouts that naturally wrap on smaller screens.
```scss
grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
```

### 2. Navigation
- **Desktop**: Full link display.
- **Mobile**: Links hidden (future: drawer menu), Search bar expands.

### 3. Data Tables
Tables are wrapped in a container with `overflow-x: auto` to allow horizontal scrolling on mobile devices without breaking the page layout.

## 🛠️ Best Practices

1.  **Utility-First Classes**: Use global classes like `.glass-card` and `.gradient-text` for common patterns to reduce code duplication.
2.  **Component-Scoped Styles**: Use CSS Modules (`*.module.scss`) for specific component logic to avoid naming collisions.
3.  **Semantic Variables**: Always use variables (`$success`) instead of hardcoded hex values (`#10b981`).
4.  **Mobile-First Awareness**: Always test grid collapses and table overflows.

## 🚀 Frontend-First Development Flow

1.  **Mock First**: Build components using static mock data or local state.
2.  **Style**: Apply mixins and variables for consistent design.
3.  **Integrate**: Connect to `api.ts` only after UI is polished.
4.  **Error States**: Handle loading/error states visibly in the UI.

This architecture ensures that as the application grows, the design remains consistent and easy to update.
