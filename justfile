# CloudPivot — 项目命令入口
# 使用 `just <command>` 运行

# 默认命令：显示帮助
default:
    @just --list

# === 开发 ===

# 启动 Tauri 开发模式（前端 + 后端热重载）
dev:
    pnpm tauri dev

# 仅启动 Next.js 前端开发服务器
dev-web:
    pnpm dev

# === 构建 ===

# 构建生产版本（Tauri 桌面应用）
build:
    pnpm tauri build

# 仅构建 Next.js 前端
build-web:
    pnpm build

# 构建 Debug 版本（含调试符号）
build-debug:
    pnpm tauri build --debug

# === 代码检查 ===

# 运行全部代码检查（前端 + 后端）
lint: lint-web lint-rust

# ESLint + TypeScript 类型检查
lint-web:
    pnpm lint
    pnpm exec tsc --noEmit

# cargo clippy
lint-rust:
    cd src-tauri && cargo clippy --all-targets --all-features -- -D warnings

# 格式化全部代码（prettier + cargo fmt）
fmt: fmt-web fmt-rust

# prettier 格式化前端代码
fmt-web:
    pnpm exec prettier --write "src/**/*.{ts,tsx,css,json}"

# cargo fmt 格式化 Rust 代码
fmt-rust:
    cd src-tauri && cargo fmt --all

# === 测试 ===

# 运行全部测试（前端 + 后端）
test: test-rust

# cargo test
test-rust:
    cd src-tauri && cargo test --all-features

# === 依赖管理 ===

# 安装全部依赖（pnpm install + cargo fetch）
install:
    pnpm install
    cd src-tauri && cargo fetch

# 清理构建产物
clean:
    rm -rf out .next
    cd src-tauri && cargo clean

# === 工具 ===

# 检查翻译文件完整性（对比 en-US 和 zh-CN 的 key）
i18n-check:
    #!/usr/bin/env bash
    set -euo pipefail
    EN_KEYS=$(cat src/i18n/locales/en-US.json | python3 -c "import sys,json; d=json.load(sys.stdin); keys=set(); [keys.update([f'{k}.{sk}' for sk in v]) for k,v in d.items()]; print('\n'.join(sorted(keys)))")
    ZH_KEYS=$(cat src/i18n/locales/zh-CN.json | python3 -c "import sys,json; d=json.load(sys.stdin); keys=set(); [keys.update([f'{k}.{sk}' for sk in v]) for k,v in d.items()]; print('\n'.join(sorted(keys)))")
    MISSING_IN_ZH=$(comm -23 <(echo "$EN_KEYS") <(echo "$ZH_KEYS"))
    MISSING_IN_EN=$(comm -13 <(echo "$EN_KEYS") <(echo "$ZH_KEYS"))
    if [ -n "$MISSING_IN_ZH" ]; then
        echo "⚠️  Missing in zh-CN:"
        echo "$MISSING_IN_ZH" | sed 's/^/  /'
    fi
    if [ -n "$MISSING_IN_EN" ]; then
        echo "⚠️  Missing in en-US:"
        echo "$MISSING_IN_EN" | sed 's/^/  /'
    fi
    if [ -z "$MISSING_IN_ZH" ] && [ -z "$MISSING_IN_EN" ]; then
        echo "✅ All translation keys are in sync"
    fi
