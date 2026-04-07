-- ================================================================
-- CloudPivot IMS — 初始化迁移脚本 (v1)
-- 创建全部 45 张表 + 索引
-- 参考: docs/02-database-design.md
-- ================================================================

-- ================================================================
-- 2.1 基础模块
-- ================================================================

-- 物料分类
CREATE TABLE categories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_id   INTEGER,                              -- 父分类，NULL 为顶级
    name        TEXT    NOT NULL,
    code        TEXT    NOT NULL UNIQUE,
    sort_order  INTEGER DEFAULT 0,
    level       INTEGER DEFAULT 1,
    path        TEXT,                                 -- 层级路径，如 "1/3/7"
    remark      TEXT,
    is_enabled  INTEGER DEFAULT 1,
    created_at  TEXT    DEFAULT (datetime('now')),
    updated_at  TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_path ON categories(path);

-- 计量单位
CREATE TABLE units (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT    NOT NULL UNIQUE,
    name_en         TEXT,
    name_vi         TEXT,
    symbol          TEXT,
    decimal_places  INTEGER DEFAULT 0,
    sort_order      INTEGER DEFAULT 0,
    is_enabled      INTEGER DEFAULT 1,
    created_at      TEXT DEFAULT (datetime('now')),
    updated_at      TEXT DEFAULT (datetime('now'))
);

-- 物料/产品
CREATE TABLE materials (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    code            TEXT    NOT NULL UNIQUE,
    name            TEXT    NOT NULL,
    material_type   TEXT    NOT NULL CHECK (material_type IN ('raw', 'semi', 'finished')),
    category_id     INTEGER,
    spec            TEXT,
    base_unit_id    INTEGER NOT NULL,
    aux_unit_id     INTEGER,
    conversion_rate REAL CHECK(conversion_rate IS NULL OR conversion_rate > 0),
    ref_cost_price  INTEGER DEFAULT 0,
    sale_price      INTEGER DEFAULT 0,
    safety_stock    REAL    DEFAULT 0,
    max_stock       REAL    DEFAULT 0,
    lot_tracking_mode TEXT DEFAULT 'none' CHECK (lot_tracking_mode IN ('none', 'optional', 'required')),
    texture         TEXT,
    color           TEXT,
    surface_craft   TEXT,
    length_mm       REAL,
    width_mm        REAL,
    height_mm       REAL,
    barcode         TEXT,
    image_path      TEXT,
    remark          TEXT,
    is_enabled      INTEGER DEFAULT 1,
    created_at      TEXT    DEFAULT (datetime('now')),
    updated_at      TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_materials_type ON materials(material_type);
CREATE INDEX idx_materials_category ON materials(category_id);
CREATE INDEX idx_materials_barcode ON materials(barcode);
CREATE INDEX idx_materials_lot_track ON materials(lot_tracking_mode);

-- 供应商
CREATE TABLE suppliers (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    code                TEXT    NOT NULL UNIQUE,
    name                TEXT    NOT NULL,
    short_name          TEXT,
    country             TEXT    NOT NULL DEFAULT 'VN' CHECK(country IN ('VN', 'CN', 'MY', 'ID', 'TH', 'US', 'EU', 'OTHER')),
    contact_person      TEXT,
    contact_phone       TEXT,
    email               TEXT,
    business_category   TEXT,
    province            TEXT,
    city                TEXT,
    address             TEXT,
    bank_name           TEXT,
    bank_account        TEXT,
    tax_id              TEXT,
    currency            TEXT    DEFAULT 'USD' CHECK (currency IN ('VND', 'CNY', 'USD')),
    settlement_type     TEXT    DEFAULT 'cash' CHECK (settlement_type IN ('cash', 'monthly', 'quarterly')),
    credit_days         INTEGER DEFAULT 0,
    grade               TEXT    DEFAULT 'B' CHECK (grade IN ('A', 'B', 'C', 'D')),
    remark              TEXT,
    is_enabled          INTEGER DEFAULT 1,
    created_at          TEXT    DEFAULT (datetime('now')),
    updated_at          TEXT    DEFAULT (datetime('now'))
);

-- 客户
CREATE TABLE customers (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    code                TEXT    NOT NULL UNIQUE,
    name                TEXT    NOT NULL,
    customer_type       TEXT    NOT NULL CHECK (customer_type IN ('dealer', 'retail', 'project', 'export')),
    country             TEXT    DEFAULT 'VN' CHECK (country IN ('VN', 'CN', 'US', 'EU', 'OTHER')),
    contact_person      TEXT,
    contact_phone       TEXT,
    email               TEXT,
    shipping_address    TEXT,
    currency            TEXT    DEFAULT 'USD' CHECK (currency IN ('VND', 'CNY', 'USD')),
    credit_limit        INTEGER DEFAULT 0,
    settlement_type     TEXT    DEFAULT 'cash' CHECK (settlement_type IN ('cash', 'monthly', 'quarterly')),
    credit_days         INTEGER DEFAULT 0,
    grade               TEXT    DEFAULT 'normal' CHECK (grade IN ('vip', 'normal', 'new')),
    default_discount    REAL    DEFAULT 0,
    remark              TEXT,
    is_enabled          INTEGER DEFAULT 1,
    created_at          TEXT    DEFAULT (datetime('now')),
    updated_at          TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_customers_code ON customers(code);
CREATE INDEX idx_customers_type ON customers(customer_type);

-- 仓库
CREATE TABLE warehouses (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    code            TEXT    NOT NULL UNIQUE,
    name            TEXT    NOT NULL,
    warehouse_type  TEXT    NOT NULL CHECK (warehouse_type IN ('raw', 'semi', 'finished', 'return')),
    manager         TEXT,
    phone           TEXT,
    address         TEXT,
    remark          TEXT,
    is_enabled      INTEGER DEFAULT 1,
    created_at      TEXT    DEFAULT (datetime('now')),
    updated_at      TEXT    DEFAULT (datetime('now'))
);

-- 默认仓映射
CREATE TABLE default_warehouses (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    material_type   TEXT    NOT NULL CHECK (material_type IN ('raw', 'semi', 'finished')),
    warehouse_id    INTEGER NOT NULL,
    remark          TEXT,
    created_at      TEXT    DEFAULT (datetime('now')),
    updated_at      TEXT    DEFAULT (datetime('now')),
    UNIQUE(material_type)
);

CREATE INDEX idx_dw_warehouse ON default_warehouses(warehouse_id);

-- 供应商物料关联
CREATE TABLE supplier_materials (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id     INTEGER NOT NULL,
    material_id     INTEGER NOT NULL,
    supply_price    INTEGER,
    currency        TEXT    DEFAULT 'USD' CHECK (currency IN ('VND', 'CNY', 'USD')),
    lead_days       INTEGER DEFAULT 7,
    min_order_qty   REAL,
    is_preferred    INTEGER DEFAULT 0,
    valid_from      TEXT,
    valid_to        TEXT,
    last_purchase_date TEXT,
    remark          TEXT,
    created_at      TEXT    DEFAULT (datetime('now')),
    updated_at      TEXT    DEFAULT (datetime('now')),
    UNIQUE(supplier_id, material_id)
);

CREATE INDEX idx_sm_supplier ON supplier_materials(supplier_id);
CREATE INDEX idx_sm_material ON supplier_materials(material_id);
CREATE INDEX idx_sm_preferred ON supplier_materials(is_preferred);

-- ================================================================
-- 2.2 BOM 模块
-- ================================================================

-- 物料清单（头）
CREATE TABLE bom (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    bom_code        TEXT    NOT NULL UNIQUE,
    material_id     INTEGER NOT NULL,
    version         TEXT    NOT NULL DEFAULT 'V1.0',
    effective_date  TEXT,
    status          TEXT    DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive')),
    total_standard_cost INTEGER DEFAULT 0,
    custom_order_id INTEGER,
    remark          TEXT,
    created_at      TEXT    DEFAULT (datetime('now')),
    updated_at      TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_bom_material ON bom(material_id);

-- 物料清单（明细）
CREATE TABLE bom_items (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    bom_id              INTEGER NOT NULL,
    child_material_id   INTEGER NOT NULL,
    standard_qty        REAL    NOT NULL,
    wastage_rate        REAL    DEFAULT 0,
    actual_qty          REAL    GENERATED ALWAYS AS (standard_qty * (1 + wastage_rate / 100.0)) STORED,
    process_step        TEXT,
    is_key_part         INTEGER DEFAULT 0,
    substitute_id       INTEGER,
    remark              TEXT,
    sort_order          INTEGER DEFAULT 0,
    created_at          TEXT    DEFAULT (datetime('now')),
    updated_at          TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_bom_items_bom ON bom_items(bom_id);
CREATE INDEX idx_bom_items_child ON bom_items(child_material_id);

-- ================================================================
-- 2.3 采购模块
-- ================================================================

-- 采购单
CREATE TABLE purchase_orders (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    order_no             TEXT    NOT NULL UNIQUE,
    supplier_id          INTEGER NOT NULL,
    order_date           TEXT    NOT NULL,
    expected_date        TEXT,
    warehouse_id         INTEGER NOT NULL,
    currency             TEXT    DEFAULT 'USD' CHECK (currency IN ('VND', 'CNY', 'USD')),
    exchange_rate        REAL    DEFAULT 1,
    status               TEXT    DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'partial_in', 'completed', 'cancelled')),
    total_amount         INTEGER DEFAULT 0,
    total_amount_base    INTEGER DEFAULT 0,
    discount_amount      INTEGER DEFAULT 0,
    freight_amount       INTEGER DEFAULT 0,
    other_charges        INTEGER DEFAULT 0,
    payable_amount       INTEGER DEFAULT 0,
    remark               TEXT,
    created_by_user_id   INTEGER,
    created_by_name      TEXT,
    approved_by_user_id  INTEGER,
    approved_by_name     TEXT,
    approved_at          TEXT,
    cancelled_by_user_id INTEGER,
    cancelled_by_name    TEXT,
    cancelled_at         TEXT,
    created_at           TEXT    DEFAULT (datetime('now')),
    updated_at           TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_po_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_po_date ON purchase_orders(order_date);
CREATE INDEX idx_po_status ON purchase_orders(status);
CREATE INDEX idx_po_warehouse ON purchase_orders(warehouse_id);

-- 采购单明细
CREATE TABLE purchase_order_items (
    id                       INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id                 INTEGER NOT NULL,
    material_id              INTEGER NOT NULL,
    spec                     TEXT,
    unit_id                  INTEGER NOT NULL,
    unit_name_snapshot       TEXT NOT NULL,
    conversion_rate_snapshot REAL NOT NULL DEFAULT 1,
    base_quantity            REAL    NOT NULL,
    quantity                 REAL    NOT NULL,
    unit_price               INTEGER NOT NULL,
    amount                   INTEGER NOT NULL DEFAULT 0,
    received_qty             REAL    DEFAULT 0,
    warehouse_id             INTEGER NOT NULL,
    remark                   TEXT,
    sort_order               INTEGER DEFAULT 0
);

CREATE INDEX idx_poi_order ON purchase_order_items(order_id);
CREATE INDEX idx_poi_warehouse ON purchase_order_items(warehouse_id);
CREATE INDEX idx_po_items_material ON purchase_order_items(material_id);

-- 入库单
CREATE TABLE inbound_orders (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    order_no             TEXT    NOT NULL UNIQUE,
    purchase_id          INTEGER,
    supplier_id          INTEGER,
    inbound_date         TEXT    NOT NULL,
    warehouse_id         INTEGER NOT NULL,
    inbound_type         TEXT    DEFAULT 'purchase' CHECK (inbound_type IN ('purchase', 'return', 'production', 'other')),
    source_type          TEXT,
    source_id            INTEGER,
    currency             TEXT    DEFAULT 'USD' CHECK (currency IN ('VND', 'CNY', 'USD')),
    exchange_rate        REAL    DEFAULT 1,
    total_amount         INTEGER DEFAULT 0,
    allocated_discount   INTEGER DEFAULT 0,
    allocated_freight    INTEGER DEFAULT 0,
    allocated_other      INTEGER DEFAULT 0,
    payable_amount       INTEGER DEFAULT 0,
    status               TEXT    DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed')),
    remark               TEXT,
    created_by_user_id   INTEGER,
    created_by_name      TEXT,
    confirmed_by_user_id INTEGER,
    confirmed_by_name    TEXT,
    confirmed_at         TEXT,
    created_at           TEXT    DEFAULT (datetime('now')),
    updated_at           TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_inbound_purchase ON inbound_orders(purchase_id);
CREATE INDEX idx_inbound_date ON inbound_orders(inbound_date);
CREATE INDEX idx_inbound_orders_wh ON inbound_orders(warehouse_id);
CREATE INDEX idx_io_source ON inbound_orders(source_type, source_id);
CREATE INDEX idx_io_supplier ON inbound_orders(supplier_id);

-- 入库单明细
CREATE TABLE inbound_order_items (
    id                       INTEGER PRIMARY KEY AUTOINCREMENT,
    inbound_id               INTEGER NOT NULL,
    purchase_order_item_id   INTEGER,
    material_id              INTEGER NOT NULL,
    unit_id                  INTEGER NOT NULL,
    unit_name_snapshot       TEXT NOT NULL,
    conversion_rate_snapshot REAL NOT NULL DEFAULT 1,
    base_quantity            REAL    NOT NULL,
    quantity                 REAL    NOT NULL,
    unit_price               INTEGER NOT NULL,
    amount                   INTEGER NOT NULL DEFAULT 0,
    lot_no                   TEXT,
    supplier_batch_no        TEXT,
    trace_attrs_json         TEXT,
    remark                   TEXT,
    sort_order               INTEGER DEFAULT 0
);

CREATE INDEX idx_ioi_inbound ON inbound_order_items(inbound_id);
CREATE INDEX idx_inbound_items_po_item ON inbound_order_items(purchase_order_item_id);
CREATE INDEX idx_inbound_items_material ON inbound_order_items(material_id);

-- 采购退货单
CREATE TABLE purchase_returns (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    return_no            TEXT    NOT NULL UNIQUE,
    inbound_id           INTEGER NOT NULL,
    supplier_id          INTEGER NOT NULL,
    return_date          TEXT    NOT NULL,
    currency             TEXT    DEFAULT 'USD' CHECK (currency IN ('VND', 'CNY', 'USD')),
    exchange_rate        REAL    DEFAULT 1,
    return_reason        TEXT,
    total_amount         INTEGER DEFAULT 0,
    total_amount_base    INTEGER DEFAULT 0,
    status               TEXT    DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed')),
    remark               TEXT,
    created_by_user_id   INTEGER,
    created_by_name      TEXT,
    confirmed_by_user_id INTEGER,
    confirmed_by_name    TEXT,
    confirmed_at         TEXT,
    created_at           TEXT    DEFAULT (datetime('now')),
    updated_at           TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_pr_supplier ON purchase_returns(supplier_id);
CREATE INDEX idx_pr_inbound ON purchase_returns(inbound_id);
CREATE INDEX idx_pr_status ON purchase_returns(status);
CREATE INDEX idx_pr_date ON purchase_returns(return_date);

-- 采购退货单明细
CREATE TABLE purchase_return_items (
    id                       INTEGER PRIMARY KEY AUTOINCREMENT,
    return_id                INTEGER NOT NULL,
    source_inbound_item_id   INTEGER NOT NULL,
    lot_id                   INTEGER,
    material_id              INTEGER NOT NULL,
    unit_id                  INTEGER NOT NULL,
    unit_name_snapshot       TEXT NOT NULL,
    conversion_rate_snapshot REAL NOT NULL DEFAULT 1,
    base_quantity            REAL    NOT NULL,
    quantity                 REAL    NOT NULL,
    unit_price               INTEGER NOT NULL,
    amount                   INTEGER NOT NULL DEFAULT 0,
    remark                   TEXT
);

CREATE INDEX idx_pri_return ON purchase_return_items(return_id);
CREATE INDEX idx_pri_source_inbound ON purchase_return_items(source_inbound_item_id);
CREATE INDEX idx_pri_lot ON purchase_return_items(lot_id);

-- ================================================================
-- 2.4 销售模块
-- ================================================================

-- 销售单
CREATE TABLE sales_orders (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    order_no             TEXT    NOT NULL UNIQUE,
    customer_id          INTEGER NOT NULL,
    order_date           TEXT    NOT NULL,
    delivery_date        TEXT,
    warehouse_id         INTEGER NOT NULL,
    currency             TEXT    DEFAULT 'USD' CHECK (currency IN ('VND', 'CNY', 'USD')),
    exchange_rate        REAL    DEFAULT 1,
    status               TEXT    DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'partial_out', 'completed', 'cancelled')),
    total_amount         INTEGER DEFAULT 0,
    total_amount_base    INTEGER DEFAULT 0,
    discount_rate        REAL    DEFAULT 0,
    discount_amount      INTEGER DEFAULT 0,
    freight_amount       INTEGER DEFAULT 0,
    other_charges        INTEGER DEFAULT 0,
    receivable_amount    INTEGER DEFAULT 0,
    shipping_address     TEXT,
    remark               TEXT,
    created_by_user_id   INTEGER,
    created_by_name      TEXT,
    approved_by_user_id  INTEGER,
    approved_by_name     TEXT,
    approved_at          TEXT,
    cancelled_by_user_id INTEGER,
    cancelled_by_name    TEXT,
    cancelled_at         TEXT,
    created_at           TEXT    DEFAULT (datetime('now')),
    updated_at           TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_so_customer ON sales_orders(customer_id);
CREATE INDEX idx_so_date ON sales_orders(order_date);
CREATE INDEX idx_so_status ON sales_orders(status);
CREATE INDEX idx_so_warehouse ON sales_orders(warehouse_id);

-- 销售单明细
CREATE TABLE sales_order_items (
    id                       INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id                 INTEGER NOT NULL,
    material_id              INTEGER NOT NULL,
    spec                     TEXT,
    unit_id                  INTEGER NOT NULL,
    unit_name_snapshot       TEXT NOT NULL,
    conversion_rate_snapshot REAL NOT NULL DEFAULT 1,
    base_quantity            REAL    NOT NULL,
    quantity                 REAL    NOT NULL,
    unit_price               INTEGER NOT NULL,
    discount_rate            REAL    DEFAULT 0,
    amount                   INTEGER NOT NULL DEFAULT 0,
    shipped_qty              REAL    DEFAULT 0,
    warehouse_id             INTEGER NOT NULL,
    remark                   TEXT,
    sort_order               INTEGER DEFAULT 0
);

CREATE INDEX idx_soi_order ON sales_order_items(order_id);
CREATE INDEX idx_soi_warehouse ON sales_order_items(warehouse_id);
CREATE INDEX idx_so_items_material ON sales_order_items(material_id);

-- 出库单
CREATE TABLE outbound_orders (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    order_no             TEXT    NOT NULL UNIQUE,
    sales_id             INTEGER,
    customer_id          INTEGER,
    outbound_date        TEXT    NOT NULL,
    warehouse_id         INTEGER NOT NULL,
    outbound_type        TEXT    DEFAULT 'sales' CHECK (outbound_type IN ('sales', 'return', 'production', 'other')),
    source_type          TEXT,
    source_id            INTEGER,
    currency             TEXT    DEFAULT 'USD' CHECK (currency IN ('VND', 'CNY', 'USD')),
    exchange_rate        REAL    DEFAULT 1,
    total_amount         INTEGER DEFAULT 0,
    allocated_discount   INTEGER DEFAULT 0,
    allocated_freight    INTEGER DEFAULT 0,
    allocated_other      INTEGER DEFAULT 0,
    receivable_amount    INTEGER DEFAULT 0,
    status               TEXT    DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed')),
    remark               TEXT,
    created_by_user_id   INTEGER,
    created_by_name      TEXT,
    confirmed_by_user_id INTEGER,
    confirmed_by_name    TEXT,
    confirmed_at         TEXT,
    created_at           TEXT    DEFAULT (datetime('now')),
    updated_at           TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_oo_sales ON outbound_orders(sales_id);
CREATE INDEX idx_oo_date ON outbound_orders(outbound_date);
CREATE INDEX idx_outbound_orders_wh ON outbound_orders(warehouse_id);
CREATE INDEX idx_oo_source ON outbound_orders(source_type, source_id);
CREATE INDEX idx_oo_customer ON outbound_orders(customer_id);

-- 出库单明细
CREATE TABLE outbound_order_items (
    id                                  INTEGER PRIMARY KEY AUTOINCREMENT,
    outbound_id                         INTEGER NOT NULL,
    sales_item_id                       INTEGER,
    lot_id                              INTEGER,
    material_id                         INTEGER NOT NULL,
    unit_id                             INTEGER NOT NULL,
    unit_name_snapshot                  TEXT NOT NULL,
    conversion_rate_snapshot            REAL NOT NULL DEFAULT 1,
    base_quantity                       REAL    NOT NULL,
    quantity                            REAL    NOT NULL,
    unit_price                          INTEGER NOT NULL,
    amount                              INTEGER NOT NULL DEFAULT 0,
    standard_cost_unit_price_snapshot   INTEGER DEFAULT 0,
    standard_cost_amount_snapshot       INTEGER DEFAULT 0,
    standard_cost_bom_id                INTEGER,
    standard_cost_bom_version           TEXT,
    cost_unit_price                     INTEGER DEFAULT 0,
    cost_amount                         INTEGER DEFAULT 0,
    remark                              TEXT,
    sort_order                          INTEGER DEFAULT 0
);

CREATE INDEX idx_ooi_outbound ON outbound_order_items(outbound_id);
CREATE INDEX idx_ooi_sales_item ON outbound_order_items(sales_item_id);
CREATE INDEX idx_ooi_lot ON outbound_order_items(lot_id);
CREATE INDEX idx_ooi_material ON outbound_order_items(material_id);

-- 销售退货单
CREATE TABLE sales_returns (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    return_no            TEXT    NOT NULL UNIQUE,
    outbound_id          INTEGER NOT NULL,
    customer_id          INTEGER NOT NULL,
    return_date          TEXT    NOT NULL,
    currency             TEXT    DEFAULT 'USD' CHECK (currency IN ('VND', 'CNY', 'USD')),
    exchange_rate        REAL    DEFAULT 1,
    return_reason        TEXT,
    total_amount         INTEGER DEFAULT 0,
    total_amount_base    INTEGER DEFAULT 0,
    status               TEXT    DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed')),
    remark               TEXT,
    created_by_user_id   INTEGER,
    created_by_name      TEXT,
    confirmed_by_user_id INTEGER,
    confirmed_by_name    TEXT,
    confirmed_at         TEXT,
    created_at           TEXT    DEFAULT (datetime('now')),
    updated_at           TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_sr_customer ON sales_returns(customer_id);
CREATE INDEX idx_sr_outbound ON sales_returns(outbound_id);
CREATE INDEX idx_sr_date ON sales_returns(return_date);
CREATE INDEX idx_sr_status ON sales_returns(status);

-- 销售退货单明细
CREATE TABLE sales_return_items (
    id                       INTEGER PRIMARY KEY AUTOINCREMENT,
    return_id                INTEGER NOT NULL,
    source_outbound_item_id  INTEGER NOT NULL,
    lot_id                   INTEGER,
    material_id              INTEGER NOT NULL,
    unit_id                  INTEGER NOT NULL,
    unit_name_snapshot       TEXT NOT NULL,
    conversion_rate_snapshot REAL NOT NULL DEFAULT 1,
    base_quantity            REAL    NOT NULL,
    quantity                 REAL    NOT NULL,
    unit_price               INTEGER NOT NULL,
    amount                   INTEGER NOT NULL DEFAULT 0,
    remark                   TEXT
);

CREATE INDEX idx_sri_return ON sales_return_items(return_id);
CREATE INDEX idx_sri_source_outbound ON sales_return_items(source_outbound_item_id);
CREATE INDEX idx_sri_lot ON sales_return_items(lot_id);

-- ================================================================
-- 2.5 库存模块
-- ================================================================

-- 库存表
CREATE TABLE inventory (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    material_id     INTEGER NOT NULL,
    warehouse_id    INTEGER NOT NULL,
    quantity        REAL    DEFAULT 0 CHECK(quantity >= 0),
    reserved_qty    REAL    DEFAULT 0 CHECK(reserved_qty >= 0),
    available_qty   REAL    GENERATED ALWAYS AS (quantity - reserved_qty) STORED,
    avg_cost        INTEGER DEFAULT 0,
    last_in_date    TEXT,
    last_out_date   TEXT,
    updated_at      TEXT    DEFAULT (datetime('now')),
    UNIQUE(material_id, warehouse_id)
);

CREATE INDEX idx_inv_material ON inventory(material_id);
CREATE INDEX idx_inv_warehouse ON inventory(warehouse_id);

-- 批次库存
CREATE TABLE inventory_lots (
    id                     INTEGER PRIMARY KEY AUTOINCREMENT,
    lot_no                 TEXT    NOT NULL UNIQUE,
    material_id            INTEGER NOT NULL,
    warehouse_id           INTEGER NOT NULL,
    source_inbound_item_id INTEGER NOT NULL,
    supplier_id            INTEGER,
    received_date          TEXT    NOT NULL,
    supplier_batch_no      TEXT,
    trace_attrs_json       TEXT,
    qty_on_hand            REAL    DEFAULT 0 CHECK(qty_on_hand >= 0),
    qty_reserved           REAL    DEFAULT 0 CHECK(qty_reserved >= 0),
    available_qty          REAL    GENERATED ALWAYS AS (qty_on_hand - qty_reserved) STORED,
    receipt_unit_cost      INTEGER DEFAULT 0,
    remark                 TEXT,
    created_at             TEXT    DEFAULT (datetime('now')),
    updated_at             TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_lot_material ON inventory_lots(material_id);
CREATE INDEX idx_lot_warehouse ON inventory_lots(warehouse_id);
CREATE INDEX idx_lot_received ON inventory_lots(received_date);

-- 库存预留明细
CREATE TABLE inventory_reservations (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    source_type     TEXT    NOT NULL CHECK (source_type IN ('custom_order', 'sales_order')),
    source_id       INTEGER NOT NULL,
    material_id     INTEGER NOT NULL,
    warehouse_id    INTEGER NOT NULL,
    reserved_qty    REAL    NOT NULL,
    consumed_qty    REAL    DEFAULT 0,
    released_qty    REAL    DEFAULT 0,
    status          TEXT    DEFAULT 'active' CHECK (status IN ('active', 'consumed', 'released', 'cancelled')),
    remark          TEXT,
    created_at      TEXT    DEFAULT (datetime('now')),
    updated_at      TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_invr_source ON inventory_reservations(source_type, source_id);
CREATE INDEX idx_invr_material ON inventory_reservations(material_id);
CREATE INDEX idx_invr_warehouse ON inventory_reservations(warehouse_id);
CREATE INDEX idx_invr_status ON inventory_reservations(status);

-- 预留批次分配明细
CREATE TABLE inventory_reservation_lots (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    reservation_id  INTEGER NOT NULL,
    lot_id          INTEGER,
    reserved_qty    REAL    NOT NULL,
    consumed_qty    REAL    DEFAULT 0,
    released_qty    REAL    DEFAULT 0,
    status          TEXT    DEFAULT 'allocated' CHECK (status IN ('allocated', 'consumed', 'released', 'cancelled')),
    sort_order      INTEGER DEFAULT 0,
    remark          TEXT,
    created_at      TEXT    DEFAULT (datetime('now')),
    updated_at      TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_invrl_reservation ON inventory_reservation_lots(reservation_id);
CREATE INDEX idx_invrl_lot ON inventory_reservation_lots(lot_id);
CREATE INDEX idx_invrl_status ON inventory_reservation_lots(status);

-- 库存流水
CREATE TABLE inventory_transactions (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_no      TEXT    NOT NULL UNIQUE,
    transaction_date    TEXT    NOT NULL,
    material_id         INTEGER NOT NULL,
    warehouse_id        INTEGER NOT NULL,
    lot_id              INTEGER,
    transaction_type    TEXT    NOT NULL CHECK (transaction_type IN (
        'purchase_in', 'sales_out', 'purchase_return', 'sales_return',
        'check_gain', 'check_loss', 'transfer_in', 'transfer_out',
        'production_out', 'production_in', 'other_in', 'other_out'
    )),
    quantity            REAL    NOT NULL,
    before_qty          REAL    NOT NULL,
    after_qty           REAL    NOT NULL,
    unit_cost           INTEGER DEFAULT 0,
    source_type         TEXT,
    source_id           INTEGER,
    source_item_id      INTEGER,
    related_order_no    TEXT,
    operator_user_id    INTEGER,
    operator_name       TEXT,
    remark              TEXT,
    created_at          TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_invt_material ON inventory_transactions(material_id);
CREATE INDEX idx_invt_warehouse ON inventory_transactions(warehouse_id);
CREATE INDEX idx_invt_lot ON inventory_transactions(lot_id);
CREATE INDEX idx_invt_date ON inventory_transactions(transaction_date);
CREATE INDEX idx_invt_type ON inventory_transactions(transaction_type);
CREATE INDEX idx_invt_related ON inventory_transactions(related_order_no);

-- 盘点单
CREATE TABLE stock_checks (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    check_no             TEXT    NOT NULL UNIQUE,
    warehouse_id         INTEGER NOT NULL,
    check_date           TEXT    NOT NULL,
    status               TEXT    DEFAULT 'draft' CHECK (status IN ('draft', 'checking', 'confirmed')),
    scope_type           TEXT    DEFAULT 'warehouse' CHECK (scope_type IN ('warehouse', 'category')),
    scope_category_id    INTEGER,
    scope_snapshot_json  TEXT,
    remark               TEXT,
    created_by_user_id   INTEGER,
    created_by_name      TEXT,
    confirmed_by_user_id INTEGER,
    confirmed_by_name    TEXT,
    confirmed_at         TEXT,
    created_at           TEXT    DEFAULT (datetime('now')),
    updated_at           TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_sc_scope_category ON stock_checks(scope_category_id);
CREATE INDEX idx_sc_wh ON stock_checks(warehouse_id);
CREATE INDEX idx_sc_date ON stock_checks(check_date);
CREATE INDEX idx_sc_status ON stock_checks(status);

-- 盘点单明细
CREATE TABLE stock_check_items (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    check_id        INTEGER NOT NULL,
    material_id     INTEGER NOT NULL,
    lot_id          INTEGER,
    lot_no_snapshot TEXT,
    system_qty      REAL    NOT NULL,
    actual_qty      REAL,
    diff_qty        REAL    GENERATED ALWAYS AS (COALESCE(actual_qty, 0) - system_qty) STORED,
    unit_price      INTEGER DEFAULT 0,
    diff_amount     INTEGER GENERATED ALWAYS AS (
        CAST(ROUND((COALESCE(actual_qty, 0) - system_qty) * unit_price, 0) AS INTEGER)
    ) STORED,
    remark          TEXT
);

CREATE INDEX idx_sci_check ON stock_check_items(check_id);
CREATE INDEX idx_sci_lot ON stock_check_items(lot_id);
CREATE INDEX idx_stock_check_items_material ON stock_check_items(material_id);

-- 调拨单
CREATE TABLE transfers (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    transfer_no          TEXT    NOT NULL UNIQUE,
    from_warehouse_id    INTEGER NOT NULL,
    to_warehouse_id      INTEGER NOT NULL,
    transfer_date        TEXT    NOT NULL,
    status               TEXT    DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed')),
    remark               TEXT,
    created_by_user_id   INTEGER,
    created_by_name      TEXT,
    confirmed_by_user_id INTEGER,
    confirmed_by_name    TEXT,
    confirmed_at         TEXT,
    created_at           TEXT    DEFAULT (datetime('now')),
    updated_at           TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_transfers_from_wh ON transfers(from_warehouse_id);
CREATE INDEX idx_transfers_to_wh ON transfers(to_warehouse_id);
CREATE INDEX idx_transfers_date ON transfers(transfer_date);
CREATE INDEX idx_transfers_status ON transfers(status);

-- 调拨单明细
CREATE TABLE transfer_items (
    id                       INTEGER PRIMARY KEY AUTOINCREMENT,
    transfer_id              INTEGER NOT NULL,
    lot_id                   INTEGER,
    material_id              INTEGER NOT NULL,
    unit_id                  INTEGER NOT NULL,
    unit_name_snapshot       TEXT NOT NULL,
    conversion_rate_snapshot REAL NOT NULL DEFAULT 1,
    base_quantity            REAL    NOT NULL,
    quantity                 REAL    NOT NULL,
    remark                   TEXT
);

CREATE INDEX idx_ti_transfer ON transfer_items(transfer_id);
CREATE INDEX idx_ti_lot ON transfer_items(lot_id);
CREATE INDEX idx_transfer_items_material ON transfer_items(material_id);

-- ================================================================
-- 2.6 财务模块
-- ================================================================

-- 应付账款
CREATE TABLE payables (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id     INTEGER NOT NULL,
    inbound_id      INTEGER,
    return_id       INTEGER,
    adjustment_type TEXT    DEFAULT 'normal' CHECK (adjustment_type IN ('normal', 'return_offset')),
    order_no        TEXT,
    payable_date    TEXT    NOT NULL,
    currency        TEXT    NOT NULL DEFAULT 'USD' CHECK(currency IN ('VND', 'CNY', 'USD')),
    exchange_rate   REAL    DEFAULT 1,
    payable_amount  INTEGER NOT NULL,
    payable_amount_base INTEGER DEFAULT 0,
    paid_amount     INTEGER DEFAULT 0,
    unpaid_amount   INTEGER GENERATED ALWAYS AS (payable_amount - paid_amount) STORED,
    due_date        TEXT,
    status          TEXT    DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partial', 'paid')),
    remark          TEXT,
    created_at      TEXT    DEFAULT (datetime('now')),
    updated_at      TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_pay_supplier ON payables(supplier_id);
CREATE INDEX idx_pay_status ON payables(status);
CREATE INDEX idx_pay_date ON payables(payable_date);
CREATE INDEX idx_paydt_due ON payables(due_date);

-- 付款记录
CREATE TABLE payment_records (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    payable_id      INTEGER NOT NULL,
    payment_date    TEXT    NOT NULL,
    payment_amount  INTEGER NOT NULL,
    currency        TEXT    NOT NULL CHECK(currency IN ('VND', 'CNY', 'USD')),
    payment_method  TEXT,
    remark          TEXT,
    created_at      TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_payment_records_payable ON payment_records(payable_id);

-- 应收账款
CREATE TABLE receivables (
    id                     INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id            INTEGER NOT NULL,
    outbound_id            INTEGER,
    return_id              INTEGER,
    adjustment_type        TEXT    DEFAULT 'normal' CHECK (adjustment_type IN ('normal', 'return_offset')),
    order_no               TEXT,
    receivable_date        TEXT    NOT NULL,
    currency               TEXT    NOT NULL DEFAULT 'USD' CHECK(currency IN ('VND', 'CNY', 'USD')),
    exchange_rate          REAL    DEFAULT 1,
    receivable_amount      INTEGER NOT NULL,
    receivable_amount_base INTEGER DEFAULT 0,
    received_amount        INTEGER DEFAULT 0,
    unreceived_amount      INTEGER GENERATED ALWAYS AS (receivable_amount - received_amount) STORED,
    due_date               TEXT,
    status                 TEXT    DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partial', 'paid')),
    remark                 TEXT,
    created_at             TEXT    DEFAULT (datetime('now')),
    updated_at             TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_recv_customer ON receivables(customer_id);
CREATE INDEX idx_recv_status ON receivables(status);
CREATE INDEX idx_recv_date ON receivables(receivable_date);
CREATE INDEX idx_recv_due ON receivables(due_date);

-- 收款记录
CREATE TABLE receipt_records (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    receivable_id   INTEGER NOT NULL,
    receipt_date    TEXT    NOT NULL,
    receipt_amount  INTEGER NOT NULL,
    currency        TEXT    NOT NULL CHECK(currency IN ('VND', 'CNY', 'USD')),
    receipt_method  TEXT,
    remark          TEXT,
    created_at      TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_receipt_records_receivable ON receipt_records(receivable_id);

-- ================================================================
-- 2.7 定制单模块
-- ================================================================

-- 定制单
CREATE TABLE custom_orders (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    order_no             TEXT    NOT NULL UNIQUE,
    customer_id          INTEGER NOT NULL,
    order_date           TEXT    NOT NULL,
    delivery_date        TEXT,
    currency             TEXT    DEFAULT 'USD' CHECK (currency IN ('VND', 'CNY', 'USD')),
    exchange_rate        REAL    DEFAULT 1,
    custom_type          TEXT    NOT NULL CHECK (custom_type IN ('size', 'material', 'full')),
    priority             TEXT    DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent', 'critical')),
    status               TEXT    DEFAULT 'quoting' CHECK (status IN ('quoting', 'confirmed', 'producing', 'completed', 'cancelled')),
    ref_material_id      INTEGER,
    ref_bom_id           INTEGER,
    custom_desc          TEXT,
    quote_amount         INTEGER DEFAULT 0,
    quote_amount_base    INTEGER DEFAULT 0,
    cost_amount          INTEGER DEFAULT 0,
    attachment_path      TEXT,
    sales_order_id       INTEGER,
    remark               TEXT,
    created_by_user_id   INTEGER,
    created_by_name      TEXT,
    confirmed_by_user_id INTEGER,
    confirmed_by_name    TEXT,
    confirmed_at         TEXT,
    cancelled_by_user_id INTEGER,
    cancelled_by_name    TEXT,
    cancelled_at         TEXT,
    created_at           TEXT    DEFAULT (datetime('now')),
    updated_at           TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_co_customer ON custom_orders(customer_id);
CREATE INDEX idx_co_status ON custom_orders(status);
CREATE INDEX idx_co_date ON custom_orders(order_date);

-- 定制配置明细
CREATE TABLE custom_order_items (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id        INTEGER NOT NULL,
    config_key      TEXT    NOT NULL,
    standard_value  TEXT,
    custom_value    TEXT    NOT NULL,
    extra_charge    INTEGER DEFAULT 0,
    remark          TEXT,
    sort_order      INTEGER DEFAULT 0
);

CREATE INDEX idx_coi_order ON custom_order_items(order_id);

-- ================================================================
-- 2.7a 生产工单模块
-- ================================================================

-- 生产工单
CREATE TABLE work_orders (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    work_order_code     TEXT    NOT NULL UNIQUE,
    bom_id              INTEGER NOT NULL,
    custom_order_id     INTEGER,
    product_material_id INTEGER NOT NULL,
    planned_qty         REAL    NOT NULL,
    completed_qty       REAL    NOT NULL DEFAULT 0,
    status              TEXT    DEFAULT 'draft' CHECK (status IN ('draft', 'picking', 'producing', 'completed', 'cancelled')),
    planned_start_date  TEXT,
    planned_end_date    TEXT,
    actual_start_date   TEXT,
    actual_end_date     TEXT,
    remark              TEXT,
    created_by_user_id  INTEGER,
    created_by_name     TEXT,
    created_at          TEXT    DEFAULT (datetime('now')),
    updated_at          TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_wo_bom ON work_orders(bom_id);
CREATE INDEX idx_wo_custom ON work_orders(custom_order_id);
CREATE INDEX idx_wo_product ON work_orders(product_material_id);
CREATE INDEX idx_wo_status ON work_orders(status);

-- 工单领料明细
CREATE TABLE work_order_materials (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    work_order_id   INTEGER NOT NULL,
    material_id     INTEGER NOT NULL,
    bom_item_id     INTEGER,
    lot_id          INTEGER,
    planned_qty     REAL    NOT NULL,
    issued_qty      REAL    NOT NULL DEFAULT 0,
    returned_qty    REAL    NOT NULL DEFAULT 0,
    remark          TEXT,
    created_at      TEXT    DEFAULT (datetime('now')),
    updated_at      TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_wom_wo ON work_order_materials(work_order_id);
CREATE INDEX idx_wom_material ON work_order_materials(material_id);
CREATE INDEX idx_wom_lot ON work_order_materials(lot_id);

-- ================================================================
-- 2.8 智能补货模块
-- ================================================================

-- 补货策略配置
CREATE TABLE replenishment_rules (
    id                    INTEGER PRIMARY KEY AUTOINCREMENT,
    material_id           INTEGER NOT NULL,
    analysis_days         INTEGER DEFAULT 90,
    lead_days             INTEGER DEFAULT 7,
    safety_days           INTEGER DEFAULT 3,
    batch_multiple        REAL    DEFAULT 1,
    preferred_supplier_id INTEGER,
    is_enabled            INTEGER DEFAULT 1,
    updated_at            TEXT    DEFAULT (datetime('now')),
    UNIQUE(material_id)
);

CREATE INDEX idx_rr_material ON replenishment_rules(material_id);

-- 补货建议记录
CREATE TABLE replenishment_logs (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    material_id         INTEGER NOT NULL,
    suggestion_date     TEXT    NOT NULL,
    physical_qty        REAL    NOT NULL,
    reserved_qty        REAL    DEFAULT 0,
    available_qty       REAL    NOT NULL,
    safety_stock        REAL    NOT NULL,
    daily_consumption   REAL    DEFAULT 0,
    days_until_stockout REAL    DEFAULT 0,
    suggested_qty       REAL    NOT NULL,
    supplier_id         INTEGER,
    ref_price           INTEGER,
    ref_currency        TEXT    DEFAULT 'USD',
    status              TEXT    DEFAULT 'pending' CHECK (status IN ('pending', 'ordered', 'ignored')),
    purchase_order_id   INTEGER,
    created_at          TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_rl_material ON replenishment_logs(material_id);
CREATE INDEX idx_rl_date ON replenishment_logs(suggestion_date);
CREATE INDEX idx_rl_status ON replenishment_logs(status);

-- ================================================================
-- 2.9 系统模块
-- ================================================================

-- 用户
CREATE TABLE users (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    username             TEXT    NOT NULL UNIQUE,
    display_name         TEXT    NOT NULL,
    password_hash        TEXT    NOT NULL,
    role                 TEXT    NOT NULL CHECK (role IN ('admin', 'operator')),
    is_enabled           INTEGER DEFAULT 1,
    must_change_password INTEGER DEFAULT 1,
    failed_login_count   INTEGER DEFAULT 0,
    locked_until         TEXT,
    password_changed_at  TEXT,
    session_version      INTEGER DEFAULT 1,
    last_login_at        TEXT,
    created_at           TEXT    DEFAULT (datetime('now')),
    updated_at           TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_enabled ON users(is_enabled);

-- 系统配置
CREATE TABLE system_config (
    key         TEXT    PRIMARY KEY,
    value       TEXT    NOT NULL,
    remark      TEXT,
    updated_at  TEXT    DEFAULT (datetime('now'))
);

-- 汇率管理
CREATE TABLE exchange_rates (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    currency        TEXT    NOT NULL CHECK (currency IN ('VND', 'CNY')),
    rate            REAL    NOT NULL CHECK(rate > 0),
    effective_date  TEXT    NOT NULL,
    updated_by_user_id INTEGER,
    updated_by_name TEXT,
    remark          TEXT,
    created_at      TEXT    DEFAULT (datetime('now')),
    UNIQUE(currency, effective_date)
);

CREATE INDEX idx_exr_currency ON exchange_rates(currency);
CREATE INDEX idx_exr_date ON exchange_rates(effective_date);

-- 操作日志
CREATE TABLE operation_logs (
    id                     INTEGER PRIMARY KEY AUTOINCREMENT,
    module                 TEXT    NOT NULL,
    action                 TEXT    NOT NULL,
    target_type            TEXT,
    target_id              INTEGER,
    target_no              TEXT,
    detail                 TEXT,
    operator_user_id       INTEGER,
    operator_name_snapshot TEXT,
    created_at             TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_oplog_module ON operation_logs(module);
CREATE INDEX idx_oplog_date ON operation_logs(created_at);
CREATE INDEX idx_oplog_target ON operation_logs(target_type, target_id);
CREATE INDEX idx_oplog_operator ON operation_logs(operator_user_id);
