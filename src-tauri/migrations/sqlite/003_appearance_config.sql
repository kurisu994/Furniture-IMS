-- ================================================================
-- CloudPivot IMS — 外观显示偏好配置项 (v3)
-- 补充 system_config 中缺少的显示偏好字段
-- ================================================================

INSERT OR IGNORE INTO system_config (key, value, remark) VALUES
    ('compact_list_view', '0', '紧凑列表视图: 0=关闭 1=开启'),
    ('large_font_mode', '0', '大字体模式: 0=关闭 1=开启'),
    ('sidebar_auto_collapse', '0', '侧边栏自动收起: 0=关闭 1=开启');
