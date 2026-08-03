# Aquavern — Project Guide

## Stack

- **Framework:** React 19 + Vite 8 (Rolldown bundler)
- **Language:** JavaScript (JSX)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite` plugin)
- **Animation:** Motion (`motion/react`) — the library formerly known as Framer Motion
- **Routing:** React Router v7 (BrowserRouter)
- **State:** Zustand v5 (auth store), local useState for component state
- **Icons:** Lucide React v1
- **Auth:** Supabase (email/password auth)
- **AI:** NVIDIA NIM API via `generateNIMCompletion` service
- **Utilities:** clsx + tailwind-merge (via `cn()`)

## Architecture

```
src/
├── api/              # Supabase auth helpers
├── assets/           # Static assets (SVGs, images)
├── components/
│   ├── auth/         # ProtectedRoute, AuthInit
│   ├── chat/         # ChatInterface, ChatList, ChatWindow
│   ├── chatbot/      # ChatbotInterface (AI chat)
│   ├── navbar/       # Navbar
│   ├── notifications/# NotificationPanel
│   ├── services/     # ServiceCard, ShipServiceDetail, CreateServiceModal
│   └── ui/           # Button, TypingDots, AutoResizeTextarea
├── data/             # mockData.js
├── hooks/            # useAuth
├── layouts/          # MainLayout
├── lib/              # cn() utility (clsx + tailwind-merge)
├── pages/            # Home, Chatbot, Login, Notifications, Services
├── services/         # shipServices, nvidiaLLM
├── store/            # authStore (Zustand)
└── utils/            # supabase client, axios instance
```

## Pages & Routing

| Route | Component | Auth | Description |
|-------|-----------|------|-------------|
| `/login` | Login | Public | Email/password sign in / sign up |
| `/home` | Home | Protected | Internal chat interface (thread-based) |
| `/chatbot` | Chatbot | Protected | AI assistant (NVIDIA NIM gpt-oss-120b) |
| `/services` | Services | Protected | Ship service listings with CRUD |
| `/notifications` | Notifications | Protected | System notification center |
| `/` | — | Redirect | Automatically redirects to `/home` |

## Design Tokens

All tokens are defined in `src/index.css` as CSS custom properties:

### Colors
- `--color-surface: #0d0e12` — primary background
- `--color-surface-elevated: #121318` — elevated surface
- `--color-surface-glass: rgba(255,255,255,0.045)` — glass surface
- `--color-border: rgba(255,255,255,0.12)` — standard border
- `--color-accent: #67e8f9` — cyan accent
- `--color-accent-subtle: rgba(103,232,249,0.12)` — subtle accent

### Spacing
- Scale: `xs(2px) → sm(4px) → md(8px) → lg(16px) → xl(24px) → 2xl(32px) → 3xl(48px) → 4xl(64px)`

### Radii
- `sm: 6px`, `md: 8px`, `lg: 12px`, `xl: 16px`, `full: 9999px`

### Shadows
- `--shadow-card`, `--shadow-elevated`, `--shadow-modal`, `--shadow-glow-cyan`

## Component Conventions

### Button
- Location: `src/components/ui/Button.jsx`
- Variants: `primary`, `secondary`, `ghost`, `danger`
- Sizes: `sm`, `default`, `lg`, `icon`, `icon-sm`
- Prop `loading` shows spinner and disables
- Uses `forwardRef`

### Glass Panel
- CSS class `.glass-panel` with `backdrop-filter: blur(20px)`
- Pseudo-element `::before` handles gradient overlay depth
- Always wrap interactive children with relative `z-1`

### Page Structure
- Every page has: eyebrow label → heading → description (optional) → content
- Uses `flex h-full min-h-0 flex-col gap-5 overflow-hidden` pattern
- Scrollable content uses `overflow-y-auto overscroll-contain`

## Motion Guidelines
- Import from `motion/react`: `import { motion, AnimatePresence } from "motion/react"`
- `useReducedMotion()` — always respect prefers-reduced-motion (handled globally in CSS)
- Default transition: `{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }` — the "expo-out" curve
- Animate only `transform` and `opacity` — never dimensions
- Use `layoutId` for shared-element transitions (Navbar active pill)
- Entry animations: `initial → animate` with slight `y` offset (10-18px) + `opacity`

## Responsiveness

- Breakpoints: `sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px`
- Mobile: ChatInterface uses stacked view (list → window with back button)
- Desktop: ChatInterface uses side-by-side grid
- Max-width containers: `max-w-7xl` for pages, `max-w-4xl` for chatbot messages
- No `h-screen` — always `min-h-[100dvh]` or `h-full`
- Grid over flex-percentage math

## Key Environment Variables
```
VITE_SUPABASE_URL=<supabase-project-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<supabase-anon-key>
VITE_NVIDIA_BASE_URL=/api/nvidia/v1
VITE_NVIDIA_DIRECT_URL=https://integrate.api.nvidia.com/v1
VITE_NVIDIA_API_KEY=<nvidia-nim-key>
VITE_NVIDIA_MODEL=openai/gpt-oss-120b
```

## Build & Dev

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint check
```

## Common Patterns

### Error/loading/empty states
Every data-fetching component implements all four states:
1. **Loading** — spinner or skeleton
2. **Error** — error message + retry button
3. **Empty** — illustration + message + call to action
4. **Data** — content display

### Form inputs
- Label above input (`text-[11px] uppercase tracking-[0.16em]`)
- Icon inside input (absolute positioned)
- Focus: `focus:border-white/25 focus:bg-white/[0.06]`
- Error below input in red

### Dark mode
- This is a dark-only app — no light mode toggle
- `color-scheme: dark` in root
- All surfaces use off-black (`#0d0e12`), never pure `#000000`

### Accessibility
- All interactive elements have `focus-visible` ring styles
- Buttons have `aria-label` where icon-only
- Form inputs have associated labels
- Motion respects `prefers-reduced-motion`
- Skip navigation is implicit via clear visual hierarchy