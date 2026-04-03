# AGENTS.md — CloudPivot IMS

## Project Overview

CloudPivot (云枢) is a **desktop IMS** (Inventory Management System) for a Vietnamese furniture factory.  
Stack: **Tauri 2** (Rust backend + SQLite) + **Next.js 16** (SSG) + **TypeScript** + **shadcn/ui** + **Tailwind CSS 4**.  
Supports **3 languages** (zh/vi/en) and **3 currencies** (VND/CNY/USD).

## Architecture

```
app/                    # Next.js App Router (SSG for Tauri)
  layout.tsx            # Root: fonts only (Inter + Noto Sans SC + Raleway)
  globals.css           # Theme system (light/dark CSS vars per shadcn convention)
  [locale]/             # i18n routing via next-intl
    layout.tsx          # NextIntlClientProvider + ThemeProvider + AppLayout
    page.tsx            # Dashboard (real implementation with charts)
    materials/page.tsx  # Business pages (currently PagePlaceholder stubs)
    ...                 # ~20 route directories matching config/nav.ts
components/
  ui/                   # shadcn/ui components (base-nova style, @base-ui/react)
  layout/               # AppLayout, Sidebar, Header, LocaleSwitcher
  common/               # Shared components (PagePlaceholder)
  providers/            # ThemeProvider (next-themes)
config/nav.ts           # Sidebar navigation tree — source of truth for all routes
i18n/                   # next-intl config (config.ts, routing.ts, request.ts, navigation.ts)
messages/{zh,vi,en}.json # Translation files (currently ~80 lines each, skeleton)
lib/utils.ts            # cn() helper (clsx + tailwind-merge)
src-tauri/              # Rust backend (currently minimal — no DB, no IPC commands)
  src/lib.rs            # Tauri builder with log plugin only
  Cargo.toml            # tauri 2.10, serde, log (no sqlx yet)
  tauri.conf.json       # Window 1440×900, devUrl localhost:3000
docs/                   # 4 design documents (~6000 lines total)
  01-requirements.md    # Full requirements spec (12 modules)
  02-database-design.md # 45-table DDL + ER diagrams
  03-ui-prototype.md    # 30 page wireframes + interaction specs
  04-development-plan.md# 5-phase plan with task tracking
```

## Key Commands

```bash
pnpm dev                 # Next.js dev server (Turbopack, port 3000)
pnpm build               # Next.js SSG build (output: ./out/)
pnpm tauri dev           # Full Tauri + Next.js dev (auto-runs pnpm dev)
pnpm tauri build         # Production build (SSG + Rust compile + installer)
pnpm lint                # ESLint
pnpm format              # Prettier
pnpm typecheck           # tsc --noEmit (strict mode)
```

## Critical Conventions

### Language & Comments
- **All UI text** must use `t()` from `next-intl` — never hardcode Chinese/Vietnamese/English strings.
- **Code comments** in Chinese; variable/function names in English.
- **Git commits** in Chinese with emoji prefix (e.g. `🚀 feat(用户管理): 添加登录功能`). No Co-authored-by trailers.

### Page Component Pattern
Every page under `app/[locale]/` follows this exact pattern:
```tsx
import { setRequestLocale } from "next-intl/server";
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);  // Required for SSG
  return <ActualContent />;
}
```
Client components use `"use client"` directive and `useTranslations()` hook.

### i18n Keys
Translation keys in `messages/*.json` are nested by domain: `nav.*`, `common.*`, `header.*`, `sidebar.*`, `dashboard.*`. When adding new pages, add keys to all 3 locale files.

### Shadcn/UI
- Style: **base-nova** (uses `@base-ui/react` primitives, not Radix)
- Add components via: `pnpm shadcn add <component>`
- Path aliases: `@/components/ui`, `@/lib/utils`, `@/hooks`
- Icons: `lucide-react` exclusively

### Navigation
`config/nav.ts` defines the full sidebar tree with `NavItem` type (`titleKey`, `href`, `icon`, `children?`). Adding a new page requires:
1. Add route directory under `app/[locale]/`
2. Add NavItem entry in `config/nav.ts`
3. Add translation key in `messages/*.json` under `nav.*`

### Theming
- Light primary: `hsl(222,47%,51%)` blue — Dark primary: `hsl(28,72%,56%)` warm orange
- CSS variables defined in `app/globals.css` following shadcn convention
- Custom tokens: `--color-wood`, `--color-nature` (furniture industry), `--color-success`, `--color-warning`
- Use semantic classes (`bg-primary`, `text-muted-foreground`), not raw HSL

### Tauri Integration
- SSG mode (`output: "export"`) activated only when `TAURI_ENV_PLATFORM` env is set
- Dev mode uses standard Next.js server at `localhost:3000`
- Rust backend is minimal — database layer, IPC commands, and auth are **not yet implemented**
- Planned: sqlx + SQLite, Repository trait abstraction, bcrypt auth (see `docs/04-development-plan.md`)

## Design Documents

Before implementing any business feature, **always consult**:
- `docs/01-requirements.md` — Business rules, field specs, validation rules
- `docs/02-database-design.md` — Table schemas, relationships, DDL
- `docs/03-ui-prototype.md` — Page layouts, interaction flows, component specs
- `docs/04-development-plan.md` — Task breakdown with current progress status

## Current State (Phase 1, ~45% complete)

**Done**: Project scaffold, Next.js+Tailwind+shadcn, ESLint/Prettier, i18n framework, layout (sidebar/header/locale-switcher), App Router routes, dashboard UI prototype with mock data, light/dark theme system.

**Not started**: Rust database layer (sqlx/SQLite), IPC commands, user auth, all 20+ business module pages (currently `PagePlaceholder` stubs), multi-currency logic, CI/CD.
