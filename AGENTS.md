# AGENTS.md — 云枢 (CloudPivot IMS)

## 项目概述

越南家具工厂桌面端进销存系统。**Tauri 2**（Rust + SQLite）+ **Next.js 16**（SSG）+ **shadcn/ui** + **Tailwind CSS 4**。  
支持中/越/英三语、VND/CNY/USD 三币种。

## 目录结构

```
app/                       # Next.js App Router（Tauri 生产构建使用 SSG）
  layout.tsx               # 根布局：仅字体（Inter + Noto Sans SC + Raleway）
  globals.css              # 主题系统（浅色/深色 CSS 变量，遵循 shadcn 规范）
  [locale]/                # i18n 路由（next-intl）
    layout.tsx             # NextIntlClientProvider + ThemeProvider + AppLayout
    page.tsx               # 首页看板（已实现，含图表 + mock 数据）
    {模块名}/page.tsx      # 业务页面（当前均为 PagePlaceholder 占位）
components/
  ui/                      # shadcn/ui 组件（base-nova 风格，基于 @base-ui/react）
  layout/                  # 布局组件：AppLayout、Sidebar、Header、LocaleSwitcher
  common/                  # 通用组件：PagePlaceholder
  providers/               # ThemeProvider（next-themes）
config/nav.ts              # 侧边栏导航树 — 路由的唯一真实来源
i18n/                      # next-intl 配置（config / routing / request / navigation）
messages/{zh,vi,en}.json   # 翻译文件（当前骨架约 80 行/语言）
lib/utils.ts               # cn() 工具函数（clsx + tailwind-merge）
src-tauri/                 # Rust 后端（当前仅有最小框架，无数据库/IPC）
  src/lib.rs               # Tauri Builder + 日志插件
  Cargo.toml               # tauri 2.10, serde, log（尚未集成 sqlx）
docs/                      # 设计文档（共约 6000 行，实现功能前必读）
  01-requirements.md       # 需求规格：12 大模块详细设计
  02-database-design.md    # 数据库：45 张表 DDL + ER 关系
  03-ui-prototype.md       # 界面原型：30 个页面 wireframe + 交互规范
  04-development-plan.md   # 开发计划：5 阶段任务清单 + 当前进度
```

## 常用命令

```bash
pnpm dev                   # Next.js 开发服务器（Turbopack，端口 3000）
pnpm build                 # Next.js SSG 构建（输出到 ./out/）
pnpm tauri dev             # Tauri 全栈开发（自动启动 pnpm dev）
pnpm tauri build           # 生产构建（SSG + Rust 编译 + 安装包）
pnpm lint                  # ESLint 检查
pnpm format                # Prettier 格式化
pnpm typecheck             # tsc --noEmit（严格模式）
pnpm shadcn add <组件名>   # 安装 shadcn/ui 组件到 components/ui/
```

## 核心约定

### UI 组件：shadcn/ui 优先

**强制规则**：开发页面时，**必须优先使用 shadcn/ui 已有组件**，只有在 shadcn/ui 确实没有提供对应组件时才考虑自行实现。

- **风格**：`base-nova`（基于 `@base-ui/react` 原语，非 Radix）
- **安装**：`pnpm shadcn add <component>`（自动安装到 `components/ui/`）
- **图标**：统一使用 `lucide-react`，不引入其他图标库
- **路径别名**：`@/components/ui`、`@/lib/utils`、`@/hooks`

已安装组件：`badge` `button` `card` `chart` `checkbox` `input` `label` `progress` `select`

常用但尚未安装的组件（按需 add）：
- 布局类：`dialog` `drawer` `sheet` `tabs` `accordion` `collapsible` `separator`
- 表单类：`form` `field` `textarea` `switch` `radio-group` `combobox` `input-otp`
- 数据展示：`table` `pagination` `avatar` `tooltip` `hover-card` `skeleton` `empty`
- 交互类：`dropdown-menu` `context-menu` `popover` `alert-dialog` `command`
- 导航类：`breadcrumb` `navigation-menu` `sidebar`
- 反馈类：`sonner`（toast 通知）`spinner` `alert`

> **示例**：需要表格时用 `pnpm shadcn add table`，需要弹窗用 `pnpm shadcn add dialog`，  
> 需要侧边抽屉用 `pnpm shadcn add sheet`，需要 toast 通知用 `pnpm shadcn add sonner`。  
> **不要**手写 Modal/Drawer/Toast 等基础 UI。

### 语言与注释

- **所有面向用户的文案**必须通过 `t()` 获取（`next-intl`），**严禁硬编码任何语言的字符串**
- **代码注释**使用中文；变量名、函数名使用英文
- **Git commit** 使用中文 + emoji 前缀（如 `🚀 feat(用户管理): 添加登录功能`），不加 Co-authored-by

### 页面组件模式

`app/[locale]/` 下每个页面必须遵循此模式（SSG 所需）：

```tsx
import { setRequestLocale } from "next-intl/server";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);  // SSG 必需
  return <实际内容组件 />;
}
```

客户端组件使用 `"use client"` 指令 + `useTranslations()` Hook。

### i18n 翻译键

`messages/*.json` 按领域嵌套：`nav.*`、`common.*`、`header.*`、`sidebar.*`、`dashboard.*`。  
新增页面时必须**同时更新三个语言文件**（zh.json / vi.json / en.json）。

### 导航系统

`config/nav.ts` 定义侧边栏完整导航树（`NavItem` 类型：`titleKey` / `href` / `icon` / `children?`）。  
新增页面需同步三处：

1. `app/[locale]/{路由}/page.tsx` — 新建页面文件
2. `config/nav.ts` — 添加 NavItem 条目
3. `messages/*.json` — 在 `nav.*` 下添加翻译键

### 主题系统

- 浅色主色：`hsl(222,47%,51%)` 蓝色 | 深色主色：`hsl(28,72%,56%)` 暖橙色
- CSS 变量定义在 `app/globals.css`，遵循 shadcn 规范
- 自定义色值：`--color-wood`、`--color-nature`（家具行业）、`--color-success`、`--color-warning`
- **使用语义类**（`bg-primary`、`text-muted-foreground`），不要直接写 HSL 值

### Tauri 集成

- 仅当 `TAURI_ENV_PLATFORM` 环境变量存在时启用 SSG（`output: "export"`）
- 开发模式使用标准 Next.js 服务器（`localhost:3000`）
- Rust 后端当前为最小框架 — 数据库层、IPC 命令、用户认证**均未实现**
- 规划中：sqlx + SQLite、Repository trait 抽象、bcrypt 认证（详见 `docs/04-development-plan.md`）

## 设计文档

实现任何业务功能前，**务必先查阅对应设计文档**：

| 文档 | 用途 |
|------|------|
| `docs/01-requirements.md` | 业务规则、字段规格、校验规则 |
| `docs/02-database-design.md` | 表结构、关联关系、DDL |
| `docs/03-ui-prototype.md` | 页面布局、交互流程、组件规格 |
| `docs/04-development-plan.md` | 任务分解、当前进度状态 |

## 当前状态（阶段一，约 45%）

**已完成**：项目脚手架、Next.js + Tailwind + shadcn、ESLint/Prettier、i18n 框架、布局组件（侧边栏/顶栏/语言切换器）、App Router 路由、首页看板 UI 原型（mock 数据）、深浅主题系统。

**未开始**：Rust 数据库层（sqlx/SQLite）、IPC 命令、用户认证、全部 20+ 业务模块页面（当前为 `PagePlaceholder` 占位）、多币种逻辑、CI/CD。
