# Kurisu 的开发日志

## 2026-09-10 记忆银行规范化重构（旧版 6 枢纽迁移到新版四层结构）

- **背景**：项目原本使用旧版 6 枢纽平铺结构（`projectbrief.md` / `productContext.md` / `systemPatterns.md` / `techContext.md` / `activeContext.md` / `progress.md`），在高频更新和多人协作时存在冲突风险与上下文加载冗余。
- **改动**：
  1. 采用新版四层架构切分：共识层（`00-project.md` + 分领域 `1X-*.md`）、任务层（`active/main.md`）、个人层（`journal/kurisu.md`）、归档层（`archive/2026-09/progress-legacy.md`）。
  2. 合并 `projectbrief.md` + `productContext.md` 为 `00-project.md`，事实零丢失。
  3. 拆分 `systemPatterns.md` + `techContext.md` 为 4 份精准带 `paths` 的领域规范：`10-backend.md`、`11-database.md`、`20-frontend.md`、`21-order-inventory-flows.md`，单份字符数均在 1200~2900 字符内，远低于 9,000 字符上限。
  4. 整理原 `activeContext.md` 为「目标 / 验收标准 / 备注」格式存入 `active/main.md`。
  5. 自动化校验 139 个技术标识符全部 100% 完整继承，零丢失。
  6. 配置 `.gitattributes` union merge，安装平台注入 hook。

