//! 报表中心 IPC 命令
//!
//! 包含库存报表（收发存汇总、库龄分析、滞销预警、库存趋势）。
//! 后续采购/销售报表也在此模块扩展。

use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use tauri::State;

use crate::db::DbState;
use crate::error::AppError;

use super::PaginatedResponse;

// ================================================================
// 数据结构 — 库存报表
// ================================================================

/// 收发存汇总项
#[derive(Debug, Serialize)]
pub struct InventoryReportItem {
    pub material_id: i64,
    pub material_code: String,
    pub material_name: String,
    pub spec: Option<String>,
    pub category_name: Option<String>,
    pub unit_name: Option<String>,
    pub opening_qty: f64,    // 期初数量
    pub opening_value: i64,  // 期初金额（USD 分，按当前加权平均成本估算）
    pub inbound_qty: f64,    // 入库数量
    pub inbound_value: i64,  // 入库金额
    pub outbound_qty: f64,   // 出库数量
    pub outbound_value: i64, // 出库金额
    pub closing_qty: f64,    // 结存数量
    pub closing_value: i64,  // 结存金额（按当前加权平均成本估算）
}

/// 收发存汇总 KPI 统计
#[derive(Debug, Serialize)]
pub struct ReportStats {
    pub opening_value: i64,
    pub inbound_value: i64,
    pub outbound_value: i64,
    pub closing_value: i64,
}

/// 库存报表响应（包含分页 + KPI + 时间戳）
#[derive(Debug, Serialize)]
pub struct InventoryReportResponse {
    pub generated_at: String,
    pub stats: ReportStats,
    pub items: Vec<InventoryReportItem>,
    pub total: i64,
    pub page: u32,
    pub page_size: u32,
}

/// 库龄分析项
#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct InventoryAgingItem {
    pub material_id: i64,
    pub material_code: String,
    pub material_name: String,
    pub lot_no: String,
    pub received_date: String,
    pub days_in_stock: i64, // 在库天数
    pub qty_on_hand: f64,
    pub unit_cost: i64,
    pub value: i64, // 金额 = qty_on_hand * unit_cost
}

/// 滞销预警项
#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct InventorySlowMovingItem {
    pub material_id: i64,
    pub material_code: String,
    pub material_name: String,
    pub category_name: Option<String>,
    pub current_qty: f64,
    pub last_out_date: Option<String>,
    pub days_since_last_out: i64,
    pub avg_monthly_outbound: f64, // 近90天月均出库量
}

/// 库存趋势数据点（用于图表）
#[derive(Debug, Serialize)]
pub struct InventoryTrendPoint {
    pub date: String,
    pub total_qty: f64,
    pub total_value: i64,
}

/// 库存趋势响应
#[derive(Debug, Serialize)]
pub struct InventoryTrendResponse {
    pub generated_at: String,
    pub points: Vec<InventoryTrendPoint>,
}

/// 收发存筛选条件
#[derive(Debug, Deserialize)]
pub struct InventoryReportFilter {
    pub start_date: Option<String>, // YYYY-MM-DD
    pub end_date: Option<String>,   // YYYY-MM-DD
    pub warehouse_id: Option<i64>,
    pub category_id: Option<i64>,
    pub material_type: Option<String>, // raw / semi / finished
    pub keyword: Option<String>,
    pub page: u32,
    pub page_size: u32,
}

/// 库龄筛选
#[derive(Debug, Deserialize)]
pub struct AgingFilter {
    pub warehouse_id: Option<i64>,
    pub category_id: Option<i64>,
    pub min_days: Option<i64>,
    pub max_days: Option<i64>,
    pub keyword: Option<String>,
    pub page: u32,
    pub page_size: u32,
}

/// 滞销筛选
#[derive(Debug, Deserialize)]
pub struct SlowMovingFilter {
    pub days_threshold: i64, // 默认 90
    pub warehouse_id: Option<i64>,
    pub category_id: Option<i64>,
    pub page: u32,
    pub page_size: u32,
}

/// 趋势筛选
#[derive(Debug, Deserialize)]
pub struct TrendFilter {
    pub days: Option<i64>, // 默认 30
    pub warehouse_id: Option<i64>,
}

// ================================================================
// 内部辅助结构
// ================================================================

/// 物料基本信息 + 当前库存（步骤 1 查询结果）
#[derive(Debug, sqlx::FromRow)]
struct MaterialWithStock {
    id: i64,
    code: String,
    name: String,
    spec: Option<String>,
    category_name: Option<String>,
    unit_name: Option<String>,
    current_qty: f64,
    avg_cost: i64,
}

/// 日期范围出入库汇总（步骤 2 查询结果）
#[derive(Debug, sqlx::FromRow)]
struct MovementSummary {
    material_id: i64,
    inbound_qty: f64,
    inbound_value: i64,
    outbound_qty: f64,
    outbound_value: i64,
}

/// start_date 到今天的总出入库（计算期初用）
#[derive(Debug, sqlx::FromRow)]
struct TotalSinceStart {
    material_id: i64,
    total_inbound: f64,
    total_outbound: f64,
}

/// 每日出入库汇总（趋势图用）
#[derive(Debug, sqlx::FromRow)]
struct DailyMovement {
    date: String,
    inbound_qty: f64,
    inbound_value: i64,
    outbound_qty: f64,
    outbound_value: i64,
}

// ================================================================
// 辅助函数
// ================================================================

/// 获取当前时间字符串（ISO 8601）
fn now_iso8601() -> String {
    chrono::Utc::now().format("%Y-%m-%dT%H:%M:%SZ").to_string()
}

// ================================================================
// IPC 命令 1: 收发存汇总
// ================================================================

/// 获取库存收发存汇总报表
#[tauri::command]
pub async fn get_inventory_report_summary(
    db: State<'_, DbState>,
    filter: InventoryReportFilter,
) -> Result<InventoryReportResponse, AppError> {
    log::info!(
        "报表查询: get_inventory_report_summary, 日期={:?}~{:?}, 仓库={:?}, 分类={:?}",
        filter.start_date,
        filter.end_date,
        filter.warehouse_id,
        filter.category_id
    );

    let start = std::time::Instant::now();

    // 默认日期：本月 1 日到今天
    let today = chrono::Utc::now().format("%Y-%m-%d").to_string();
    let first_of_month = chrono::Utc::now().format("%Y-%m-01").to_string();
    let start_date = filter.start_date.as_deref().unwrap_or(&first_of_month);
    let end_date = filter.end_date.as_deref().unwrap_or(&today);

    // ─── 步骤 1：物料列表 + 当前库存（先聚合 inventory 再 JOIN） ───
    let materials: Vec<MaterialWithStock> = sqlx::query_as(
        r#"
        SELECT m.id, m.code, m.name, m.spec, c.name AS category_name, u.name AS unit_name,
               COALESCE(i_agg.total_qty, 0) AS current_qty,
               COALESCE(i_agg.weighted_avg_cost, 0) AS avg_cost
        FROM materials m
        LEFT JOIN categories c ON c.id = m.category_id
        LEFT JOIN units u ON u.id = m.base_unit_id
        LEFT JOIN (
            SELECT material_id,
                   SUM(quantity) AS total_qty,
                   CASE WHEN SUM(quantity) = 0 THEN 0
                        ELSE CAST(ROUND(SUM(quantity * avg_cost) * 1.0 / SUM(quantity), 0) AS INTEGER)
                   END AS weighted_avg_cost
            FROM inventory
            WHERE (?1 IS NULL OR warehouse_id = ?1)
            GROUP BY material_id
        ) i_agg ON i_agg.material_id = m.id
        WHERE m.is_enabled = 1
          AND (?2 IS NULL OR m.category_id = ?2)
          AND (?3 IS NULL OR m.material_type = ?3)
          AND (?4 IS NULL OR m.name LIKE '%' || ?4 || '%' OR m.code LIKE '%' || ?4 || '%')
        ORDER BY m.code
        "#,
    )
    .bind(filter.warehouse_id)
    .bind(filter.category_id)
    .bind(&filter.material_type)
    .bind(&filter.keyword)
    .fetch_all(&db.pool)
    .await
    .map_err(|e| AppError::Database(format!("查询物料库存失败: {}", e)))?;

    // ─── 步骤 2：日期范围内出入库汇总 ───
    let movements: Vec<MovementSummary> = sqlx::query_as(
        r#"
        SELECT
            material_id,
            SUM(CASE WHEN quantity > 0 THEN quantity ELSE 0 END) AS inbound_qty,
            SUM(CASE WHEN quantity > 0 THEN CAST(ROUND(quantity * unit_cost, 0) AS INTEGER) ELSE 0 END) AS inbound_value,
            SUM(CASE WHEN quantity < 0 THEN ABS(quantity) ELSE 0 END) AS outbound_qty,
            SUM(CASE WHEN quantity < 0 THEN CAST(ROUND(ABS(quantity) * unit_cost, 0) AS INTEGER) ELSE 0 END) AS outbound_value
        FROM inventory_transactions
        WHERE transaction_date BETWEEN ?1 AND ?2
          AND (?3 IS NULL OR warehouse_id = ?3)
        GROUP BY material_id
        "#,
    )
    .bind(start_date)
    .bind(end_date)
    .bind(filter.warehouse_id)
    .fetch_all(&db.pool)
    .await
    .map_err(|e| AppError::Database(format!("查询出入库汇总失败: {}", e)))?;

    // ─── 额外查询：start_date 到今天的总出入库（计算期初） ───
    let totals_since: Vec<TotalSinceStart> = sqlx::query_as(
        r#"
        SELECT
            material_id,
            SUM(CASE WHEN quantity > 0 THEN quantity ELSE 0 END) AS total_inbound,
            SUM(CASE WHEN quantity < 0 THEN ABS(quantity) ELSE 0 END) AS total_outbound
        FROM inventory_transactions
        WHERE transaction_date >= ?1
          AND (?2 IS NULL OR warehouse_id = ?2)
        GROUP BY material_id
        "#,
    )
    .bind(start_date)
    .bind(filter.warehouse_id)
    .fetch_all(&db.pool)
    .await
    .map_err(|e| AppError::Database(format!("查询期初出入库失败: {}", e)))?;

    // ─── 步骤 3：内存合并计算 ───
    let movement_map: HashMap<i64, &MovementSummary> =
        movements.iter().map(|m| (m.material_id, m)).collect();
    let total_map: HashMap<i64, &TotalSinceStart> =
        totals_since.iter().map(|t| (t.material_id, t)).collect();

    let mut all_items: Vec<InventoryReportItem> = Vec::with_capacity(materials.len());

    for mat in &materials {
        let ts = total_map.get(&mat.id);
        let mv = movement_map.get(&mat.id);

        let total_inbound = ts.map_or(0.0, |t| t.total_inbound);
        let total_outbound = ts.map_or(0.0, |t| t.total_outbound);

        // 期初 = 当前库存 - (start_date 到今天的入库) + (start_date 到今天的出库)
        let opening_qty = mat.current_qty - total_inbound + total_outbound;
        let opening_value = (opening_qty * mat.avg_cost as f64).round() as i64;

        let inbound_qty = mv.map_or(0.0, |m| m.inbound_qty);
        let inbound_value = mv.map_or(0, |m| m.inbound_value);
        let outbound_qty = mv.map_or(0.0, |m| m.outbound_qty);
        let outbound_value = mv.map_or(0, |m| m.outbound_value);

        // 结存 = 期初 + 入库 - 出库
        let closing_qty = opening_qty + inbound_qty - outbound_qty;
        let closing_value = (closing_qty * mat.avg_cost as f64).round() as i64;

        // 跳过无数据的物料（期初/入/出/结存全为0）
        if opening_qty == 0.0 && inbound_qty == 0.0 && outbound_qty == 0.0 && closing_qty == 0.0 {
            continue;
        }

        all_items.push(InventoryReportItem {
            material_id: mat.id,
            material_code: mat.code.clone(),
            material_name: mat.name.clone(),
            spec: mat.spec.clone(),
            category_name: mat.category_name.clone(),
            unit_name: mat.unit_name.clone(),
            opening_qty,
            opening_value,
            inbound_qty,
            inbound_value,
            outbound_qty,
            outbound_value,
            closing_qty,
            closing_value,
        });
    }

    // KPI 汇总（全量数据）
    let stats = ReportStats {
        opening_value: all_items.iter().map(|i| i.opening_value).sum(),
        inbound_value: all_items.iter().map(|i| i.inbound_value).sum(),
        outbound_value: all_items.iter().map(|i| i.outbound_value).sum(),
        closing_value: all_items.iter().map(|i| i.closing_value).sum(),
    };

    let total = all_items.len() as i64;

    // 前端分页
    let page = filter.page.max(1);
    let page_size = filter.page_size.max(1);
    let start_idx = ((page - 1) * page_size) as usize;
    let paged_items: Vec<InventoryReportItem> = all_items
        .into_iter()
        .skip(start_idx)
        .take(page_size as usize)
        .collect();

    let elapsed = start.elapsed();
    log::info!("报表查询完成: 耗时 {:?}, 总行数 {}", elapsed, total);

    Ok(InventoryReportResponse {
        generated_at: now_iso8601(),
        stats,
        items: paged_items,
        total,
        page,
        page_size,
    })
}

// ================================================================
// IPC 命令 2: 库龄分析
// ================================================================

/// 获取库龄分析报表
#[tauri::command]
pub async fn get_inventory_aging_analysis(
    db: State<'_, DbState>,
    filter: AgingFilter,
) -> Result<PaginatedResponse<InventoryAgingItem>, AppError> {
    log::info!(
        "报表查询: get_inventory_aging_analysis, 仓库={:?}, 天数={:?}~{:?}",
        filter.warehouse_id,
        filter.min_days,
        filter.max_days
    );

    let start = std::time::Instant::now();

    // 计数查询
    let total: (i64,) = sqlx::query_as(
        r#"
        SELECT COUNT(*)
        FROM inventory_lots il
        JOIN materials m ON m.id = il.material_id
        WHERE il.qty_on_hand > 0
          AND COALESCE(m.lot_tracking_mode, 'none') IN ('optional', 'required')
          AND (?1 IS NULL OR il.warehouse_id = ?1)
          AND (?2 IS NULL OR m.category_id = ?2)
          AND (?3 IS NULL OR CAST(julianday('now') - julianday(il.received_date) AS INTEGER) >= ?3)
          AND (?4 IS NULL OR CAST(julianday('now') - julianday(il.received_date) AS INTEGER) <= ?4)
          AND (?5 IS NULL OR m.name LIKE '%' || ?5 || '%' OR m.code LIKE '%' || ?5 || '%')
        "#,
    )
    .bind(filter.warehouse_id)
    .bind(filter.category_id)
    .bind(filter.min_days)
    .bind(filter.max_days)
    .bind(&filter.keyword)
    .fetch_one(&db.pool)
    .await
    .map_err(|e| AppError::Database(format!("统计库龄数量失败: {}", e)))?;

    let page = filter.page.max(1);
    let page_size = filter.page_size.max(1);
    let offset = (page - 1) * page_size;

    let items: Vec<InventoryAgingItem> = sqlx::query_as(
        r#"
        SELECT
            il.material_id,
            m.code AS material_code,
            m.name AS material_name,
            il.lot_no,
            il.received_date,
            CAST(julianday('now') - julianday(il.received_date) AS INTEGER) AS days_in_stock,
            il.qty_on_hand,
            il.receipt_unit_cost AS unit_cost,
            CAST(ROUND(il.qty_on_hand * il.receipt_unit_cost, 0) AS INTEGER) AS value
        FROM inventory_lots il
        JOIN materials m ON m.id = il.material_id
        WHERE il.qty_on_hand > 0
          AND COALESCE(m.lot_tracking_mode, 'none') IN ('optional', 'required')
          AND (?1 IS NULL OR il.warehouse_id = ?1)
          AND (?2 IS NULL OR m.category_id = ?2)
          AND (?3 IS NULL OR CAST(julianday('now') - julianday(il.received_date) AS INTEGER) >= ?3)
          AND (?4 IS NULL OR CAST(julianday('now') - julianday(il.received_date) AS INTEGER) <= ?4)
          AND (?5 IS NULL OR m.name LIKE '%' || ?5 || '%' OR m.code LIKE '%' || ?5 || '%')
        ORDER BY days_in_stock DESC
        LIMIT ?6 OFFSET ?7
        "#,
    )
    .bind(filter.warehouse_id)
    .bind(filter.category_id)
    .bind(filter.min_days)
    .bind(filter.max_days)
    .bind(&filter.keyword)
    .bind(page_size)
    .bind(offset)
    .fetch_all(&db.pool)
    .await
    .map_err(|e| AppError::Database(format!("查询库龄分析失败: {}", e)))?;

    let elapsed = start.elapsed();
    log::info!("库龄分析完成: 耗时 {:?}, 总行数 {}", elapsed, total.0);

    Ok(PaginatedResponse {
        total: total.0,
        items,
        page,
        page_size,
    })
}

// ================================================================
// IPC 命令 3: 滞销预警
// ================================================================

/// 获取滞销预警报表
#[tauri::command]
pub async fn get_inventory_slow_moving(
    db: State<'_, DbState>,
    filter: SlowMovingFilter,
) -> Result<PaginatedResponse<InventorySlowMovingItem>, AppError> {
    log::info!(
        "报表查询: get_inventory_slow_moving, 阈值={}天, 仓库={:?}",
        filter.days_threshold,
        filter.warehouse_id
    );

    let start = std::time::Instant::now();

    // 计数查询
    let total: (i64,) = sqlx::query_as(
        r#"
        SELECT COUNT(*)
        FROM materials m
        LEFT JOIN (
            SELECT material_id,
                   SUM(quantity) AS total_qty,
                   MAX(last_out_date) AS last_out_date
            FROM inventory
            WHERE (?2 IS NULL OR warehouse_id = ?2)
            GROUP BY material_id
        ) i_agg ON i_agg.material_id = m.id
        WHERE m.is_enabled = 1
          AND COALESCE(i_agg.total_qty, 0) > 0
          AND (i_agg.last_out_date IS NULL
               OR CAST(julianday('now') - julianday(i_agg.last_out_date) AS INTEGER) > ?1)
          AND (?3 IS NULL OR m.category_id = ?3)
        "#,
    )
    .bind(filter.days_threshold)
    .bind(filter.warehouse_id)
    .bind(filter.category_id)
    .fetch_one(&db.pool)
    .await
    .map_err(|e| AppError::Database(format!("统计滞销数量失败: {}", e)))?;

    let page = filter.page.max(1);
    let page_size = filter.page_size.max(1);
    let offset = (page - 1) * page_size;

    let items: Vec<InventorySlowMovingItem> = sqlx::query_as(
        r#"
        SELECT
            m.id AS material_id,
            m.code AS material_code,
            m.name AS material_name,
            c.name AS category_name,
            COALESCE(i_agg.total_qty, 0) AS current_qty,
            i_agg.last_out_date,
            CASE
                WHEN i_agg.last_out_date IS NULL THEN 9999
                ELSE CAST(julianday('now') - julianday(i_agg.last_out_date) AS INTEGER)
            END AS days_since_last_out,
            COALESCE(
                (SELECT (SUM(ABS(quantity)) / MAX(CAST(julianday('now') - julianday(MIN(transaction_date)) AS REAL), 1.0)) * 30.0
                 FROM inventory_transactions
                 WHERE material_id = m.id
                   AND transaction_type IN ('sales_out', 'production_out')
                   AND transaction_date >= date('now', '-90 days')
                 GROUP BY material_id),
                0
            ) AS avg_monthly_outbound
        FROM materials m
        LEFT JOIN categories c ON c.id = m.category_id
        LEFT JOIN (
            SELECT material_id,
                   SUM(quantity) AS total_qty,
                   MAX(last_out_date) AS last_out_date
            FROM inventory
            WHERE (?2 IS NULL OR warehouse_id = ?2)
            GROUP BY material_id
        ) i_agg ON i_agg.material_id = m.id
        WHERE m.is_enabled = 1
          AND COALESCE(i_agg.total_qty, 0) > 0
          AND (i_agg.last_out_date IS NULL
               OR CAST(julianday('now') - julianday(i_agg.last_out_date) AS INTEGER) > ?1)
          AND (?3 IS NULL OR m.category_id = ?3)
        ORDER BY days_since_last_out DESC
        LIMIT ?4 OFFSET ?5
        "#,
    )
    .bind(filter.days_threshold)
    .bind(filter.warehouse_id)
    .bind(filter.category_id)
    .bind(page_size)
    .bind(offset)
    .fetch_all(&db.pool)
    .await
    .map_err(|e| AppError::Database(format!("查询滞销预警失败: {}", e)))?;

    let elapsed = start.elapsed();
    log::info!("滞销预警完成: 耗时 {:?}, 总行数 {}", elapsed, total.0);

    Ok(PaginatedResponse {
        total: total.0,
        items,
        page,
        page_size,
    })
}

// ================================================================
// IPC 命令 4: 库存趋势
// ================================================================

/// 获取库存趋势数据（用于图表）
///
/// 返回近 N 天每天的库存结存量和结存金额。
/// 通过当前库存 + 每日出入库汇总倒推历史值。
#[tauri::command]
pub async fn get_inventory_trend(
    db: State<'_, DbState>,
    filter: TrendFilter,
) -> Result<InventoryTrendResponse, AppError> {
    let days = filter.days.unwrap_or(30).clamp(1, 365);

    log::info!(
        "报表查询: get_inventory_trend, 天数={}, 仓库={:?}",
        days,
        filter.warehouse_id
    );

    let start = std::time::Instant::now();

    // 获取当前库存总量和总金额
    let current: (f64, i64) = sqlx::query_as(
        r#"
        SELECT
            COALESCE(SUM(quantity), 0),
            COALESCE(SUM(CAST(ROUND(quantity * avg_cost, 0) AS INTEGER)), 0)
        FROM inventory
        WHERE (?1 IS NULL OR warehouse_id = ?1)
        "#,
    )
    .bind(filter.warehouse_id)
    .fetch_one(&db.pool)
    .await
    .map_err(|e| AppError::Database(format!("查询当前库存失败: {}", e)))?;

    let (current_qty, current_value) = current;

    // 获取每日出入库汇总
    let daily: Vec<DailyMovement> = sqlx::query_as(
        r#"
        SELECT
            transaction_date AS date,
            SUM(CASE WHEN quantity > 0 THEN quantity ELSE 0 END) AS inbound_qty,
            SUM(CASE WHEN quantity > 0 THEN CAST(ROUND(quantity * unit_cost, 0) AS INTEGER) ELSE 0 END) AS inbound_value,
            SUM(CASE WHEN quantity < 0 THEN ABS(quantity) ELSE 0 END) AS outbound_qty,
            SUM(CASE WHEN quantity < 0 THEN CAST(ROUND(ABS(quantity) * unit_cost, 0) AS INTEGER) ELSE 0 END) AS outbound_value
        FROM inventory_transactions
        WHERE transaction_date >= date('now', '-' || ?1 || ' days')
          AND (?2 IS NULL OR warehouse_id = ?2)
        GROUP BY transaction_date
        ORDER BY transaction_date
        "#,
    )
    .bind(days)
    .bind(filter.warehouse_id)
    .fetch_all(&db.pool)
    .await
    .map_err(|e| AppError::Database(format!("查询每日出入库失败: {}", e)))?;

    // 构建日期到变动的映射
    let daily_map: HashMap<String, &DailyMovement> =
        daily.iter().map(|d| (d.date.clone(), d)).collect();

    // 生成完整日期序列
    let today = chrono::Utc::now().date_naive();
    let dates: Vec<String> = (0..days)
        .rev()
        .map(|i| {
            (today - chrono::Duration::days(i))
                .format("%Y-%m-%d")
                .to_string()
        })
        .collect();

    // 从最后一天（今天）开始倒推
    let mut qty = current_qty;
    let mut value = current_value;
    let mut points: Vec<InventoryTrendPoint> = Vec::with_capacity(dates.len());

    // 先从今天往回倒推计算每天的结存值
    for date in dates.iter().rev() {
        points.push(InventoryTrendPoint {
            date: date.clone(),
            total_qty: qty,
            total_value: value,
        });
        // 倒推：当天的库存 = 前一天的库存 + 当天入库 - 当天出库
        // 所以：前一天的库存 = 当天库存 - 当天入库 + 当天出库
        if let Some(dm) = daily_map.get(date) {
            qty = qty - dm.inbound_qty + dm.outbound_qty;
            value = value - dm.inbound_value + dm.outbound_value;
        }
    }

    // 反转为时间正序
    points.reverse();

    let elapsed = start.elapsed();
    log::info!("库存趋势完成: 耗时 {:?}, 数据点 {}", elapsed, points.len());

    Ok(InventoryTrendResponse {
        generated_at: now_iso8601(),
        points,
    })
}
