//! IPC 命令模块
//!
//! 定义所有前端可调用的 Tauri 命令。
//! 命令通过 `#[tauri::command]` 注解暴露给前端。

use serde::Deserialize;
use tauri::State;

use crate::auth::{self, LoginResponse, UserInfo};
use crate::db::DbState;
use crate::error::AppError;

/// ping 测试命令 — 验证前后端通信链路
#[tauri::command]
pub async fn ping(db: State<'_, DbState>) -> Result<String, AppError> {
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

// ================================================================
// 认证命令
// ================================================================

/// 登录请求参数
#[derive(Deserialize)]
pub struct LoginRequest {
    username: String,
    password: String,
}

/// 用户登录
#[tauri::command]
pub async fn login(
    db: State<'_, DbState>,
    request: LoginRequest,
) -> Result<LoginResponse, AppError> {
    auth::login(&db.pool, &request.username, &request.password).await
}

/// 修改密码请求参数
#[derive(Deserialize)]
pub struct ChangePasswordRequest {
    user_id: i64,
    new_password: String,
}

/// 修改密码
#[tauri::command]
pub async fn change_password(
    db: State<'_, DbState>,
    request: ChangePasswordRequest,
) -> Result<(), AppError> {
    auth::change_password(&db.pool, request.user_id, &request.new_password).await
}

/// 获取用户信息
#[tauri::command]
pub async fn get_user_info(
    db: State<'_, DbState>,
    user_id: i64,
) -> Result<UserInfo, AppError> {
    auth::get_user_info(&db.pool, user_id).await
}
