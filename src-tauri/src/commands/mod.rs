//! IPC 命令模块
//!
//! 定义所有前端可调用的 Tauri 命令。
//! 命令通过 `#[tauri::command]` 注解暴露给前端。

use tauri::State;

use crate::db::DbState;
use crate::error::AppError;

/// ping 测试命令 — 验证前后端通信链路
///
/// 前端调用此命令后会返回 "pong" + 数据库状态
#[tauri::command]
pub async fn ping(db: State<'_, DbState>) -> Result<String, AppError> {
    // 验证数据库连接是否可用
    let row: (i64,) = sqlx::query_as("SELECT 1")
        .fetch_one(&db.pool)
        .await
        .map_err(|e| AppError::Database(format!("数据库连接测试失败: {}", e)))?;

    Ok(format!("pong (db_status: ok, test_query: {})", row.0))
}

/// 获取数据库版本信息
#[tauri::command]
pub async fn get_db_version(db: State<'_, DbState>) -> Result<i64, AppError> {
    let version: i64 =
        sqlx::query_scalar("SELECT COALESCE(MAX(version), 0) FROM schema_migrations")
            .fetch_one(&db.pool)
            .await
            .map_err(|e| AppError::Database(format!("查询数据库版本失败: {}", e)))?;

    Ok(version)
}
