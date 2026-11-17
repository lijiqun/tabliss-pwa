# YT音频点唱 — Tabliss 壳 PWA

点唱机（油猴脚本 `YouTube音频点唱机.user.js`）宿主页面的「Chrome 应用化」方案。

## 这是什么

Tabliss 原站（web.tabliss.io）有壁纸安装清单但缺 Service Worker，Chrome 不提供安装入口；本项目是一个**壳页面**——iframe 嵌入 web.tabliss.io + 完整安装清单（192/512px 图标）+ 最小 Service Worker，部署到 GitHub Pages 后 Chrome 即可正式安装为应用：

- 独立窗口（无地址栏、无标签栏，纯壁纸 + 时钟）
- **独立任务栏图标**（安装型 PWA 有独立应用标识，Chrome「创建快捷方式」做不到）
- 出现在开始菜单 / 桌面，双击即开

点唱机脚本的 `@match` 已包含 `https://lijiqun.github.io/tabliss-pwa/*`，在此应用窗口内照常运行。

## 线上地址

- 应用：https://lijiqun.github.io/tabliss-pwa/
- 仓库：https://github.com/lijiqun/tabliss-pwa

## 文件清单

| 文件 | 作用 |
|---|---|
| `index.html` | 壳页：iframe 嵌 web.tabliss.io + theme-color + SW 注册 |
| `pwa.json` | 安装清单（应用名 / 图标 / standalone 窗口模式 / 主题色） |
| `sw.js` | 最小 Service Worker（Chrome 安装的硬性条件；导航强制绕缓存拿最新壳页，离线兜底） |
| `icon-192.png` / `icon-512.png` | 应用图标（Chrome 安装要求 ≥144px，两档） |
| `.nojekyll` | GitHub Pages 跳过 Jekyll 处理 |

## 本地开发

```bash
# 本地预览（localhost 属于安全上下文，PWA 可安装）
python -m http.server 8000
# 浏览器打开 http://localhost:8000
```

## 部署 / 更新

本仓库即部署源（GitHub Pages 自动发布 `main` 分支根目录）：

1. 改文件 → `git push origin main`
2. 约 1 分钟后线上生效

| 改什么 | 生效方式 |
|---|---|
| 主题色（`pwa.json` 的 `theme_color` + `index.html` 的 `<meta theme-color>`，两处同步） | 应用窗口 Ctrl+Shift+R 强刷 |
| 应用图标 | **卸载重装**（Chrome 安装时固化图标，刷新不更新） |
| 应用名 | 卸载重装（`name` 用于安装确认与系统列表，`short_name` 用于任务栏/开始菜单磁贴） |

## 权限说明

- Tabliss 的天气需要**地理位置**：壳页 iframe 以 `allow="geolocation"` 授权（跨域 iframe 默认被 Permissions Policy 禁用），首次使用 Chrome 会弹一次权限询问，允许即可
- 全屏：`allow="fullscreen"` 已带
- 其他能力（摄像头/麦克风/通知）Tabliss 不请求，无需放开

## 已知边界

- 应用窗口内点击壁纸不会触发浏览器页面跳转（iframe 隔离），点唱机的外点最小化用「点击盾」实现同一效果（脚本 v1.2.48 起）
- 地址栏导航不受任何脚本控制（浏览器限制）
- GitHub Pages 有约 10 分钟 CDN 缓存，更新文件后若「没变化」先强刷（Ctrl+Shift+R）
- Chrome 安装型 PWA 的图标/名称在安装时固化，改动需卸载重装

## 相关

- 点唱机脚本母本与版本史：`lijiqun/userscript_dev` 仓库的 `YouTube音频点唱机/` 目录
