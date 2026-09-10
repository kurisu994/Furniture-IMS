---
name: 20-frontend
description: Next.js 16 (SSG) 前端架构、shadcn/ui (base-nova)、国际化与 UI 交互规范
paths:
  - "app/**"
  - "components/**"
  - "config/**"
  - "hooks/**"
  - "i18n/**"
  - "messages/**"
  - "lib/**"
---

# 前端架构与 UI 交互规范

## 1. 技术栈版本矩阵

- **应用框架**：Next.js 16.3.1 (App Router, SSG 静态导出模式 `output: 'export'`)
- **核心视图**：React 19.2.8 + TypeScript 5.9.3 (严格模式)
- **样式与组件**：Tailwind CSS 4.3.3 + shadcn/ui base-nova 风格 (@base-ui/react 1.7.0 底层)
- **国际化与主题**：next-intl 4.13.6 + next-themes 0.4.6
- **辅助库**：recharts 3.10.1 (图表)、date-fns 4.4.0 (日期)、react-day-picker 10.0.1 (日历选择)、react-arborist 3.16.0 (分类树)、lucide-react 1.31.0 (图标)、sonner 2.0.8 (通知)、xlsx 0.18.5 (Excel 导出)
- **代码规范与包管理**：Biome 2.5.8 (Lint + Format)、pnpm 10.33.0

## 2. 页面与组件开发模式

### 页面渲染模式 (SSG)
所有 `app/[locale]/**/page.tsx` 路由页面必须使用以下标准化签名：
```tsx
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <BusinessView />;
}
```
遵循 `setRequestLocale(locale)` 与 `async Page` 模式，确保静态生成与多语言预渲染正常工作。

### IPC 调用与环境降级
- 页面与组件通过 `lib/tauri/` 下封装的 API 进行 Rust IPC 调用。
- 内部必须通过 `isTauriEnv()` 进行运行时环境检测：在桌面端走真实 IPC 调用；在 Web/浏览器开发环境下优雅降级返回 Mock 数据，支持纯前端独立调试。

### 统一业务列表骨架
- 列表页统一使用 `BusinessListTableShell` 组件。
- 保证页面交互体验统一：表头吸顶、首列冻结（sticky）、分页栏吸底悬浮、自适应横向滚动。

### 权限驱动 UI
- 通过 `usePermission()` hook 获取当前用户权限能力：
  - `can(module, action)`：判断是否有特定模块的具体操作权限（如 `manual_stock.confirm`）
  - `canAccess(module)`：判断是否有模块的访问权限，用于菜单与入口隐藏
  - `isAdmin`：快捷判断是否具有管理员最高权限

### 导航树单一真实来源
- 侧边栏路由与菜单结构统一在 `config/nav.ts` 中维护，禁止在布局中硬编码菜单项。

## 3. 国际化 (i18n) 规范

- 多语言文案按业务域切分存放在 `messages/{locale}/{domain}.json`（如 `messages/{zh,vi,en}/inventory.json`）。
- **文案禁止硬编码**：所有面向用户的界面文本必须通过 `t()` 获取。
- 新增页面或修改文案时，必须同步补充中文 (zh)、越南语 (vi)、英语 (en) 三语翻译。

## 4. 主题配色与工程命令

### 主题主色
| 模式 | 主色调 | 对应值 |
|------|--------|--------|
| 浅色 | 蓝色 | `hsl(222, 47%, 51%)` |
| 深色 | 暖橙 | `hsl(28, 72%, 56%)` |

代码中应使用 Tailwind 语义类名（如 `text-primary`, `bg-background`），禁止直接在业务样式中硬编码 HSL 颜色值。

### 常用工程命令
| 命令 | 职责说明 |
|------|----------|
| `just dev` | Tauri 全链路开发模式（Next.js + Rust 后端同时启动） |
| `just dev-web` | 纯 Next.js 开发服务（Turbopack，3000 端口） |
| `just build` | 桌面客户端生产打包构建 |
| `just lint` | Biome 静态检查与 TypeScript 检查 |
| `just fmt` | Biome 代码自动格式化 |
| `just test` | 运行全部测试套件 |
| `just ui <名>` | 安装或更新 shadcn/ui 组件 |
| `just i18n-check` | 检查三语国际化字典键位完整性 |
| `just release <tag>` | 自动触发一键打包发布流程 |

## 5. 负向约束与踩坑红线

- ❌ **严禁使用 Radix UI 原语**：shadcn 组件已全面基于 `@base-ui/react`（base-nova 风格），切勿安装或混入 Radix UI 组件。
- ❌ **Select 必须显式传 `items` prop**：base-nova 的 Select 组件若未传递 `items` prop，选中后输入框会回退显示原始 value 字符串而非 label。
- ❌ **严禁使用 Drawer / Sheet**：业务详情与编辑表单交互必须统一使用 Dialog 弹窗。
- ❌ **严禁手写 Modal / Toast**：弹窗统一 Dialog，系统通知统一使用 Sonner。
- ❌ **严禁使用 npm / yarn**：项目锁定 pnpm，不得破坏 `pnpm-lock.yaml`。
