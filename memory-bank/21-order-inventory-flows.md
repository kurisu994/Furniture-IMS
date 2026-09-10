---
name: 21-order-inventory-flows
description: 采购、销售、库存流水、批次核算与生产工单流转业务规则
paths:
  - "src-tauri/src/commands/order_shared.rs"
  - "src-tauri/src/commands/inventory*.rs"
  - "src-tauri/src/commands/purchase.rs"
  - "src-tauri/src/commands/sales.rs"
  - "src-tauri/src/commands/production_order.rs"
  - "src-tauri/src/commands/manual_stock_movement.rs"
  - "lib/tauri/order*.ts"
  - "lib/tauri/inventory*.ts"
---

# 订单、库存与生产核心业务流转规则

## 1. 采购与入库流程

- **共享状态机**：基于 `order_shared.rs` 处理采购单草稿、提交、审核、作废与删除逻辑。
- **入库与成本分摊**：
  - 入库时自动按物料属性生成新批次记录。
  - 支持附加运费与关税分摊，将间接费用按金额或数量比例摊入批次单位采购成本。
- **退货成本回调**：采购退货确认时，原批次对应成本与库存联动扣减，并冲减应付账款。

## 2. 销售、出库与生产下推

### 行折扣与金额核算
- **字段命名规范**：前后端统一使用 `discountRate`（行折扣率），杜绝历史遗留的 `lineDiscount` 命名。
- **出库核算**：出库确认遵循 FIFO（先进先出）扣减批次，按行折扣率计算折后实收金额，并记录出库时点的移动加权成本与批次双成本快照。
- **退货尾差处理**：销售退货按原出库折后金额比例倒算，最后一笔退货采用倒挤法消除舍入尾差，确保冲减应收金额精确对齐。

### 销售下推生产
- **手动触发**：销售单审核通过后，操作员可手动点击「下推生产」。
- **工单生成规则**：销售明细中的每行成品独立生成一张生产工单。
- **差额计算**：工单计划数量严格按 `base_quantity − shipped_qty − 已下推工单量` 动态计算差额，取消未完成工单后额度自动释放。
- **BOM 容错处理**：若某行成品物料未配置启用状态的 BOM，系统自动标记为跳过并提示，不中断其余有效行的工单生成。工单记录来源销售单 ID。

## 3. 库存运维与自由出入库

- **底层原子操作**：由 `inventory_ops.rs` 统一承接增减库存、扣减批次余量、记录收发流水与重算移动平均成本。
- **自由出入库流程**：
  1. 支持录入多行明细并保存为草稿；
  2. 出库确认前进行批量可用库存预检并高亮超仓物料；
  3. 执行 `confirm_manual_stock_movement` 原子过账，更新实时库存与流水。
- **权限收紧防护**：
  - `manual_stock.confirm`（自由出入库过账）与盘点单审核确认权限严格上收至管理员角色。
  - 库管角色（warehouse_staff）仅保留草稿录入与调拨确认权限，防止非授权原子改写账实数据。
- **并发行锁**：库存余额与批次数量的查询与扣减必须强制使用 `FOR UPDATE` 行锁，杜绝超卖。
