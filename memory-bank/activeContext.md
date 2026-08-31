# Active Context

## 当前状态

项目处于 **功能完备、持续打磨** 阶段，当前版本 **v0.3.3**（2026-08-19 发布）。本月主要围绕"销售 → 生产"链路打通与权限精细化收敛：新增销售单下推生产、库管角色权限收紧，并修复一批上线前缺陷（Tauri 版本不匹配、记住我登录、看板权限报错等）。

## 最近完成（v0.3.3 已提交）

- **销售单下推生产**（`4566f7d`/`34bfdd5`/`b3daa38`）：审核后手动「下推生产」→ 每行成品一张工单，仅生产差额（base_quantity − shipped_qty − 已下推量），无启用 BOM 的行提示跳过；工单关联来源销售单。迁移 019。
- **库管权限收紧**（`cf726b7`）：收回库管自由出入库过账 + 盘点审核确认，迁移 020/021；调拨确认保留。
- **看板权限门控**（`d000c82` / `85c4777` / `0ac4433` / `843b7d1`）：看板部件按权限逐项门控、待出库明细补齐库存/成本字段、Tauri 版本不匹配修复、不勾选记住我登录被踢回修复。
- **依赖升级**（`8a0031d`）：Next/React/Tauri/Biome/Tailwind 等前后端依赖升级至最新稳定版。

## 活跃文件

- `src-tauri/src/commands/production_order.rs` — 下推命令 + 创建/展算公共函数
- `src-tauri/src/commands/inventory.rs` — 库存过账/盘点守卫兜底
- `src-tauri/migrations/postgres/019~021_*.sql` — 销售-工单关联与库管权限调整
- `src-tauri/pnpm-workspace.yaml` — Tauri override 版本对齐
- `components/providers/auth-provider.tsx` — 登录态清理顺序
- `app/[locale]/sales-orders/_components/push-production-dialog.tsx` — 下推弹窗

## 已做出的决策

- **下推为手动按钮而非审核自动触发**：避免 BOM 缺失时审核被卡，用户可控。
- **每行成品一张工单**：符合现有工单结构，进度独立。
- **数量 = base_quantity − shipped_qty − 已下推量（只生产差额）**：已下推量动态 SUM 计算不落列，取消工单自动释放额度。
- **无启用 BOM 跳过而非中断**：下推结果分 created/skipped 两组返回，前端分色展示。
- **库管仅保留调拨确认**：过账/盘点审核上收管理员，与操作员收紧对齐。

## 下一步

- **运行时实测下推链路**：真实库跑迁移 019 → 审核销售单 → 下推生成工单 → 领料 → 开工 → 完工入库 → 销售出库；核对重复下推（第二次应全部跳过）。
- 权限重构上线验证（遗留）：迁移 017+018 实测、多角色登录冒烟等。
- 里程碑 2（有门控勿提前）：等 login_success 日志确认车队无旧版后删除 legacy `users.role`/`role_id`。

## 阻塞

- 无。
