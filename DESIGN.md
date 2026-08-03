# Aquavern — Design System

> Premium dark-tech SaaS interface for maritime ship intelligence and communication.

## Brand Identity

- **Product:** Aquavern (Internal Intelligence System)
- **Tone:** Premium, technical, calm, intelligent, authoritative
- **Audience:** Internal teams coordinating ship-to-ship logistics and services
- **Mode:** Dark-only — optimized for extended operational use

---

## Design Dials

| Dial | Value | Rationale |
|------|-------|-----------|
| DESIGN_VARIANCE | 7/10 | Offset layouts with generous whitespace, subtle asymmetry |
| MOTION_INTENSITY | 6/10 | Fluid micro-interactions, scroll reveals, never excessive |
| VISUAL_DENSITY | 4/10 | Airy, premium spacing — content breathes |

---

## Color Palette

### Surfaces

| Token | Value | Usage |
|-------|-------|-------|
| Surface | `#0d0e12` | Primary background |
| Surface elevated | `#121318` | Elevated cards, modals |
| Surface glass | `rgba(255,255,255,0.045)` | Glass-panel backgrounds |
| Surface hover | `rgba(255,255,255,0.06)` | Hover state surfaces |

### Borders

| Token | Value | Usage |
|-------|-------|-------|
| Subtle | `rgba(255,255,255,0.06)` | Section dividers, low-emphasis borders |
| Default | `rgba(255,255,255,0.08)` | Standard card borders |
| Strong | `rgba(255,255,255,0.12)` | Glass panel borders, elevated components |
| Active | `rgba(255,255,255,0.18)` | Active/focused state borders |

### Text

| Token | Opacity | Usage |
|-------|---------|-------|
| Primary | `#ffffff` | Headlines, navigation, labels |
| Secondary | `0.58` | Body text, menu items |
| Tertiary | `0.38` | Captions, timestamps, meta |
| Disabled | `0.20` | Disabled controls |

### Accent

| Token | Value | Usage |
|-------|-------|-------|
| Primary accent | `#67e8f9` (cyan-300) | Interactive highlights |
| Accent subtle | `rgba(103,232,249,0.12)` | Subtle backgrounds |
| Accent glow | `rgba(103,232,249,0.06)` | Ambient glow orbs |

---

## Typography

### Stack
- **Primary:** Inter, system-ui, -apple-system, sans-serif
- **Scale:** Tailwind's default (text-xs through text-4xl)

### Hierarchy
```
Page title (H1):    text-2xl/tight sm:text-3xl  → font-semibold
Section title (H2): text-xl                      → font-semibold
Card title:         text-sm                      → font-semibold
Body:               text-sm/6                    → text-white/45
Caption:            text-[11px]                  → text-white/30
Eyebrow:            text-[11px] uppercase tracking-[0.22em] → font-medium, O30%
```

### Special styles
- **Time/date stamps:** `text-[11px] text-white/30`
- **Badge/label text:** `text-[10px] uppercase tracking-[0.18em] text-white/30`
- **Section eyebrow:** `text-[11px] uppercase tracking-[0.22em] font-medium text-white/30`
- **Monospace (reasoning):** `font-mono text-[11px]`

---

## Spacing

### Section gaps
```
Between sections:  gap-5 (20px)
Card padding:      p-4 or p-5
Modal padding:     px-6 py-5
List items:        gap-2 or gap-3
```
### Page max-widths
```
Standard pages:     max-w-7xl (1280px)
Chatbot messages:   max-w-4xl (896px)
Narrow content:     max-w-md (Login card)
```

---

## Glass Panel System

The `.glass-panel` class provides the signature material for the app:

```css
.glass-panel {
  background: linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02));
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 8px 32px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.07);
  backdrop-filter: blur(20px);
}
```

A `::before` pseudo-element adds a diagonal gradient overlay for depth:

```css
.glass-panel::before {
  background: linear-gradient(145deg, rgba(255,255,255,0.06), transparent 40%, ...);
}
```

**Always** set children to `position: relative; z-index: 1` to sit above the overlay.

---

## Shadows

| Layer | Shadow |
|-------|--------|
| Cards | `0 4px 20px rgba(0,0,0,0.2)` |
| Glass panels | `0 8px 32px rgba(0,0,0,0.32)` + inset highlight |
| Elevated | `0 18px 60px rgba(0,0,0,0.42)` |
| Modals | `0 32px 100px rgba(0,0,0,0.6)` |
| Hover glow | `0 12px 40px rgba(34,211,238,0.05)` |

---

## Components

### Button
- **Variants:** `primary` (white/bold), `secondary` (glass), `ghost` (transparent), `danger` (red)
- **Sizes:** `sm` (9), `default` (11), `lg` (12), `icon` (11^2), `icon-sm` (9^2)
- **States:** default, hover, active (`scale-[0.97]`), focus-visible (ring), disabled (40%)
- **Loading:** spinner replaces children visually, `sr-only` label for screen readers
- **Radius:** `rounded-lg/default`, `rounded-xl/lg`, `rounded-lg/icons`

### Navbar
- Sticky top, 64px height, `bg-black/40 backdrop-blur-2xl`
- Desktop: pill-shaped nav bar with `layoutId="nav-pill"` shared-element transition
- Mobile: slide-in drawer from right with staggered link animation (40ms delay per item)
- Brand: icon + name/subtitle (hidden on smallest screens)
- Logout: desktop icon-only, mobile full-width red button

### Service Card
- Rounded-2xl container with `.glass-panel`-like styling
- Hover: `translateY(-4px)` + cyan border glow
- Consists of: avatar/initials, ship name + location, service tags, footer with date + CTA
- Tag overflow: `+N more` for services beyond 4

### Modals (CreateServiceModal, ShipServiceDetail)
- Backdrop: `bg-black/50 backdrop-blur-sm`
- Entrance: `opacity: 0 → 1, y: 24 → 0` with `ease: [0.16,1,0.3,1]`
- Decorative: edge glow line at top (cyan gradient)
- ShipServiceDetail slides in from right; CreateServiceModal centers

### Chat Messages
- **Outgoing:** white background, black text, `rounded-2xl rounded-br-md`, `max-w-[80%]`
- **Incoming:** glass background, `rounded-2xl rounded-bl-md`, `max-w-[80%]`
- **Timestamp:** `text-[11px]` at 40% opacity
- **Entry:** opacity + y offset with slight scale

---

## Motion Design

### Transition Default
```js
{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }
```
This is a custom ease curve (expo-out) used throughout. For micro-interactions:
```js
{ type: "spring", stiffness: 400, damping: 32 }
```

### Page Entries
- Elements fade in with `y: 10-18px` offset
- Stagger delays: 40-80ms between items
- Filter blur: `filter: "blur(4px)" → "blur(0px)"` for extra smoothness

### Navigation
- Desktop: `layoutId="nav-pill"` for active pill transition
- Mobile drawer: slides from right with staggered link entries

### Chat
- Messages animate in with `opacity: 0 → 1, y: 10 → 0, scale: 0.98 → 1`
- `AnimatePresence` handles mount/unmount transitions
- Auto-scroll to bottom with `requestAnimationFrame`

### Hover Effects
- Cards: `y: -4px`, subtle shadow increase, border glow
- Buttons: `scale-[0.97]` on press
- Notification items: left accent line appears, glow blob expands

### Ambient Animations
- Login page: slow-scale glow orb (8s infinite)
- Chatbot: gentle pulse on the model status badge
- Notification bell: subtle float (4s infinite)
- Empty states: gentle bob on icons (3-4s infinite)

---

## Responsive Behavior

### Breakpoints
```
Phone (default):  < 640px   — single column, stacked views
Tablet (sm):      640px+    — expanded layouts
Desktop (md):     768px+    — sidebars, multi-column
Wide (lg):       1024px+    — full experience
```

### Per-Page Behavior

| Page | Mobile | Desktop |
|------|--------|---------|
| Login | Full-width card, min padding | Centered card, max-w-md |
| Home/Chat | Stack (list → window + back) | Side-by-side grid (30%/70%) |
| Chatbot | Full-width messages | Max-w-4xl centered |
| Services | 1-col grid | 2-3 col grid |
| Notifications | Full-width list | Glass panel with margin |
| Navbar | Hamburger + slide drawer | Pills + desktop buttons |

### Navbar Responsiveness
- Brand subtitle hidden below `sm`
- Desktop nav hidden below `md`
- Logout label hidden below `lg` (icon-only)

---

## State Patterns

Every data-driven component implements these states:

### Loading
- Centered spinner with descriptive text
- Or skeleton shimmer (using `.skeleton` class with animated gradient)

### Error
- Icon (`AlertTriangle`) + message + "Try Again" button
- Toast/destructive styling: red border, red text, red background
- Inline errors (forms): appear below the field

### Empty
- Icon + heading + description + CTA
- Subtle floating animation on icon for visual interest
- Never shows raw data containers

### Data
- Consistent card/list rendering
- Animated entrance with stagger

---

## Accessibility

- **Reduced motion:** Global CSS disables all animations under `prefers-reduced-motion: reduce`
- **Focus:** All interactive elements have `focus-visible` rings (cyan-300 at 35% opacity)
- **Contrast:** Dark-on-light text (white on black surfaces) exceeds WCAG AAA
- **Labels:** All form inputs have associated `<label>` elements
- **Screen readers:** Icon buttons have `aria-label`, loading states have `sr-only` text
- **Touch targets:** All interactive elements ≥ 44×44px

---

## CSS Utilities (index.css)

| Class | Purpose |
|-------|---------|
| `.glass-panel` | Frosted glass surface with depth overlay |
| `.glow-edge` | Cyan-tinted border gradient glow |
| `.soft-grid` | Diagonal grid pattern background |
| `.ambient-glow` | Radial cyan glow behind content |
| `.skeleton` | Shimmer loading placeholder |
| `.focus-ring` | Cyan focus indicator ring |
| `.no-scrollbar` | Hide scrollbar (content still scrolls) |
| `.text-eyebrow` | Small uppercase label style |
| `.text-caption` | Small secondary caption style |

---

## Icon Usage

- **Library:** Lucide React v1
- **Standard size:** `h-4 w-4` for inline icons
- **Avatar icons:** `h-[18px] w-[18px]` for message avatars
- **Decorative:** Icons always have semantic meaning — never purely decorative
- **Color:** Inherit text color via `text-white/*` with appropriate opacity