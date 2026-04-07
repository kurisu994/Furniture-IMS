//! 统一错误类型
//!
//! 使用 `thiserror` 定义应用级错误，所有模块统一使用此类型。
//! 实现 `serde::Serialize` 以便通过 Tauri IPC 返回前端。

use serde::Serialize;

/// 应用统一错误类型
#[derive(Debug, thiserror::Error)]
pub enum AppError {
    /// 数据库错误
    #[error("数据库错误: {0}")]
    Database(String),

    /// SQL 执行错误
    #[error("SQL 错误: {0}")]
    Sqlx(#[from] sqlx::Error),

    /// 认证错误
    #[error("认证错误: {0}")]
    Auth(String),

    /// 业务逻辑错误
    #[error("业务错误: {0}")]
    Business(String),

    /// IO 错误
    #[error("IO 错误: {0}")]
    Io(#[from] std::io::Error),
}

/// 为 Tauri IPC 序列化错误信息
impl Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&self.to_string())
    }
}
