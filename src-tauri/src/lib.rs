//! CloudPivot IMS — Tauri 应用入口
//!
//! 负责初始化日志、数据库、注册 IPC 命令并启动应用。

mod commands;
mod db;
mod error;

use db::DbState;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // 初始化日志插件
            app.handle().plugin(
                tauri_plugin_log::Builder::default()
                    .level(log::LevelFilter::Info)
                    .build(),
            )?;

            // 初始化数据库（异步）
            let handle = app.handle().clone();
            tauri::async_runtime::block_on(async move {
                match db::init_db(&handle).await {
                    Ok(pool) => {
                        log::info!("数据库初始化成功");
                        // 将连接池注入全局状态
                        handle.manage(DbState { pool });
                    }
                    Err(e) => {
                        log::error!("数据库初始化失败: {}", e);
                        panic!("数据库初始化失败: {}", e);
                    }
                }
            });

            Ok(())
        })
        // 注册 IPC 命令
        .invoke_handler(tauri::generate_handler![
            commands::ping,
            commands::get_db_version,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
