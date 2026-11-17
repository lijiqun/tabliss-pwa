# Tabliss 壳 PWA — 使用说明

## 这是什么

点唱机宿主页面的「Chrome 应用化」方案。Tabliss 原站（web.tabliss.io）有壁纸安装清单但缺 Service Worker，Chrome 不提供安装入口；本目录是一个**壳页面**——iframe 嵌入 web.tabliss.io + 完整安装清单（192/512px 图标）+ 最小 Service Worker，部署到 GitHub Pages 后 Chrome 即可正式安装为应用：

- 独立窗口（无地址栏、无标签栏，纯壁纸 + 时钟）
- **独立任务栏图标**（安装型 PWA 有独立应用标识，快捷方式方式做不到）
- 出现在开始菜单 / 桌面，双击即开

点唱机（`@match` 已含 `lijiqun.github.io/tabliss-pwa/*`）在此应用窗口内照常运行。

## 文件清单

| 文件 | 作用 |
|---|---|
| `index.html` | 壳页：iframe 嵌 web.tabliss.io + theme-color + SW 注册 |
| `pwa.json` | 安装清单（应用名 / 图标 / standalone 窗口模式 / 主题色） |
| `sw.js` | 最小 Service Worker（Chrome 安装的硬性条件；导航强制绕缓存拿最新壳页，离线兜底） |
| `icon-192.png` / `icon-512.png` | 应用图标（Chrome 安装要求 ≥144px，两档） |

## 首次部署

1. GitHub → New repository → 名称 `tabliss-pwa`、Public、勾选 Add a README
2. 仓库页 → Add file → Upload files → 上传本目录 5 个文件（不含 README.md）→ Commit
3. 仓库 Settings → Pages → Branch 选 `main` / `(root)` → Save，等约 1 分钟
4. Chrome 打开 `https://<用户名>.github.io/tabliss-pwa/` → 地址栏安装图标 → 安装

## 日常更新

| 改什么 | 怎么生效 |
|---|---|
| 主题色（pwa.json `theme_color` + index.html `<meta theme-color>`，两处同步） | 上传后应用窗口 Ctrl+Shift+R 强刷 |
| 应用图标 | 上传后**卸载重装**（Chrome 安装时固化图标，刷新不更新） |
| 壳页结构 | 上传后刷新即生效（SW v2 起导航强制绕缓存） |

## 权限说明

- Tabliss 的天气需要**地理位置**：壳页 iframe 以 `allow="geolocation"` 授权（跨域 iframe 默认被 Permissions Policy 禁用），首次使用 Chrome 会弹一次权限询问，允许即可
- 全屏：`allow="fullscreen"` 已带
- 其他能力（摄像头/麦克风/通知）Tabliss 不请求，无需放开

## 已知边界

- 应用窗口内点击壁纸不会触发浏览器的页面跳转（iframe 隔离），点唱机的外点最小化用 `blur + hasFocus` 实现同一效果（v1.2.47 起）
- 地址栏导航不受任何脚本控制（浏览器限制）
- GitHub Pages 有约 10 分钟 CDN 缓存，更新文件后若「没变化」先强刷（Ctrl+Shift+R）
