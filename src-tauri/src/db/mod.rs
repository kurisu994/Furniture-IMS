//! 数据库模块 — SQLite 连接池初始化与管理
//!
//! 负责创建数据库连接池、执行 PRAGMA 初始化和自动迁移。
//! v1.0 使用 SQLite，通过 Repository trait 抽象，为 v2.0 PostgreSQL 迁移预留。

pub mod migration;

use sqlx::SqlitePool;
use sqlx::sqlite::SqlitePoolOptions;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

use crate::error::AppError;

/// 数据库管理状态，注入 Tauri 全局状态
pub struct DbState {
    pub pool: SqlitePool,
}

/// 初始化数据库连接池
///
/// 流程：
/// 1. 确定数据库文件路径（Tauri app_data_dir）
/// 2. 创建连接池并执行 PRAGMA 初始化
/// 3. 运行迁移脚本
pub async fn init_db(app: &AppHandle) -> Result<SqlitePool, AppError> {
    // 获取应用数据目录（Tauri 2 API）
    let app_data_dir: PathBuf = app
        .path()
        .app_data_dir()
        .map_err(|e| AppError::Database(format!("无法获取应用数据目录: {}", e)))?;

    // 确保目录存在
    std::fs::create_dir_all(&app_data_dir).map_err(|e| {
        AppError::Database(format!("创建数据目录失败: {}", e))
    })?;

    let db_path = app_data_dir.join("cloudpivot.db");
    let db_url = format!("sqlite:{}?mode=rwc", db_path.display());

    log::info!("数据库路径: {}", db_path.display());

    // 创建连接池
    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await
        .map_err(|e| AppError::Database(format!("数据库连接失败: {}", e)))?;

    // 执行 PRAGMA 初始化
    init_pragmas(&pool).await?;

    // 执行迁移
    migration::run_migrations(&pool).await?;

    log::info!("数据库初始化完成");
    Ok(pool)
}

/// 执行 SQLite PRAGMA 初始化
///
/// 参考 docs/02-database-design.md §3.2 PRAGMA 初始化清单
async fn init_pragmas(pool: &SqlitePool) -> Result<(), AppError> {
    sqlx::raw_sql(
        "PRAGMA journal_mode = WAL;
         PRAGMA busy_timeout = 5000;
         PRAGMA foreign_keys = OFF;
         PRAGMA synchronous = NORMAL;
         PRAGMA cache_size = -8000;
         PRAGMA temp_store = MEMORY;",
    )
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(format!("PRAGMA 初始化失败: {}", e)))?;

    log::info!("SQLite PRAGMA 初始化完成");
    Ok(())
}
