# Responsive Design System

This document describes the responsive patterns, breakpoints, and conventions used throughout the Tax Records Portal frontend.

## Breakpoints

We follow Tailwind's default breakpoints with **mobile-first** design:

| Token | Min-width | Typical devices |
|-------|-----------|-----------------|
| (base) | 0px | Small phones (320px+) |
| `sm` | 640px | Large phones / small tablets |
| `md` | 768px | Tablets portrait |
| `lg` | 1024px | Tablets landscape / small laptops |
| `xl` | 1280px | Desktops |

**Key thresholds:**
- `sm` (640px) — Tables switch from card-stack to full table. Modals switch from full-screen to centered. Inputs shrink from 48px to 40px height.
- `lg` (1024px) — Sidebar becomes fixed. Split-view sidebars appear alongside main content.

## Layout Shell

The app uses `MainLayout` (sidebar + topnav + content):

- **Sidebar** (`w-60` / 240px): Hidden off-screen below `lg`, slides in via hamburger. Always visible at `lg+`.
- **TopNav** (`h-[70px]`): Hamburger visible below `lg`. User name/subtitle hidden below `md` (avatar only).
- **Content area**: `px-4 py-5` on mobile, `md:px-8 md:py-7` on desktop.

## Component Patterns

### ResponsiveTable

**File:** `src/components/common/ResponsiveTable.tsx`

Wraps any `<table>` to provide card-stack view on mobile. The existing desktop table is passed as `children` and rendered unchanged on `sm+`.

```tsx
<ResponsiveTable
  data={items}
  keyExtractor={(item) => item.id}
  primaryFields={(item) => [
    { label: "Name", value: item.name },
    { label: "Status", value: <StatusBadge status={item.status} /> },
  ]}
  secondaryFields={(item) => [
    { label: "Email", value: item.email },
  ]}
  onItemClick={(item) => navigate(`/detail/${item.id}`)}
  isLoading={loading}
  emptyMessage="No results."
>
  <table className="w-full table-fixed">
    {/* existing desktop table markup — unchanged */}
  </table>
</ResponsiveTable>
```

**Props:**
- `primaryFields` — Always visible on mobile card (title row + key info)
- `secondaryFields` — Hidden behind "More details" expand toggle
- `actions` — Render a `KebabMenu` with `KebabMenuItem` children for row actions
- `cardClassName` — Extra classes per card (e.g. red border for overdue)
- `children` — The desktop `<table>`, wrapped in `overflow-x-auto` on `sm+`

**Hook:** `useIsCompact()` from `src/hooks/useMediaQuery.ts` — returns `true` below 768px (md). Tables switch to card-stack at `md` because 5-6 column tables are unusable between 640-768px.

**Note:** `useIsMobile()` (640px/sm) is available for other components like modals and layout shifts. `useIsCompact()` (768px/md) is specifically for data tables.

### Modal

Full-screen on mobile (`h-full w-full`), centered card on `sm+` (`sm:h-auto sm:rounded-lg sm:mx-4 sm:max-h-[90vh]`). Actions footer includes `env(safe-area-inset-bottom)` padding.

### Pagination

Prev/next arrows + "1 / 5" counter on mobile. Full numbered pagination on `sm+`.

### Grids

All grids follow mobile-first stacking:

| Desktop columns | Responsive pattern |
|---|---|
| 2 | `grid-cols-1 sm:grid-cols-2` |
| 3 | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` |
| 4 | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` |

For split views (main + sidebar):
```
grid grid-cols-1 lg:grid-cols-[1fr_380px]
```

### Filter Bars

Stack vertically on mobile, inline on `sm+`:
```
flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between
```
SearchInput and Button use `w-full sm:w-auto`.

### Sticky Footers

Action bars pinned to bottom include safe-area padding and responsive layout:
```
fixed bottom-0 right-0 left-0 lg:left-60 pb-[env(safe-area-inset-bottom)]
```
Inner content: `flex flex-col sm:flex-row ... px-4 sm:px-8`

## Touch Targets

- **Minimum:** 32px for all interactive elements (`p-2` on icon-only buttons)
- **Preferred:** 44px+ for primary actions
- **Input/Button height:** `py-3 sm:py-2.5` — 48px on mobile, 40px on desktop
- **Dropdown triggers:** Same `py-3 sm:py-2.5` pattern

## Viewport Units

Always use `dvh` (dynamic viewport height) instead of `vh`. On mobile browsers, `100vh` includes the area behind the URL bar, causing content to be hidden. `100dvh` adapts to the actual visible viewport.

- `h-dvh` instead of `h-screen` — Sidebar, splash screens
- `min-h-dvh` instead of `min-h-screen` — Page layouts, error pages
- `max-h-[90dvh]` instead of `max-h-[90vh]` — Modal max height
- `calc(100dvh - X)` instead of `calc(100vh - X)` — Scrollable panels

Tailwind 3.4+ provides native `h-dvh`, `min-h-dvh`, `max-h-dvh` utilities.

## Safe Area Insets

`viewport-fit=cover` is set in `index.html`. Use `env(safe-area-inset-bottom)` on:
- Modal action footers
- Sticky action bars (NewClient, EditClientProfile)
- Toast container (mobile bottom positioning)

### Toasts

- **Desktop (sm+):** Top-right, 360px fixed width
- **Mobile (< sm):** Bottom of screen, 12px side margins, safe-area-inset-bottom
- CSS overrides in `src/styles/global.css` reposition react-toastify container on mobile

### Navigation Patterns

- **2-segment breadcrumbs** → Use `BackButton` (`← Parent Page`)
- **3+ segment breadcrumbs** → Use `BreadcrumbNav` (auto-collapses middle segments at all screen sizes)

### Detail Page Layout

- **Short-value fields** (dates, names, numbers, badges): `grid-cols-2` always — don't stack to 1-column on mobile
- **Long-value fields** (addresses, descriptions): `grid-cols-1 sm:grid-cols-2` — stack on mobile
- **Form inputs**: `grid-cols-1 sm:grid-cols-2` — need full width for touch targets
- **Action button rows**: Add `flex-wrap` so buttons wrap on narrow screens

## Conventions for New Components

1. **Start mobile-first** — base styles are for `320px`, add `sm:` / `lg:` for larger screens
2. **Use `ResponsiveTable`** for any new data table — don't reinvent card-stack
3. **Use `useIsMobile()`** sparingly — prefer CSS breakpoints. Use the hook only when you need conditional rendering (different components, not just different styles)
4. **Test at 320px** — the narrowest supported width. All content must be accessible without horizontal scroll
5. **Never use fixed widths** (`w-80`, `w-2/5`) on flex children without responsive alternatives
6. **Dropdowns/popovers** — use `w-full sm:w-64` or `max-w-[calc(100vw-2rem)]` patterns to prevent overflow
