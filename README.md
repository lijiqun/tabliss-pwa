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
| `tabliss.json` | Tabliss 导出的配置（长沙天气 / 24 小时制时钟 / Unsplash 壁纸话题），可下载后导入 Tabliss |
| `deploy.sh` | 部署脚本：同步到部署仓库并推送（临时克隆、用完即删） |

## 本地开发

```bash
# 本地预览（localhost 属于安全上下文，PWA 可安装）
python -m http.server 8000
# 浏览器打开 http://localhost:8000
```

## 部署 / 更新

**本目录是真源**，部署目标是独立仓库 `lijiqun/tabliss-pwa`（GitHub Pages 自动发布其 `main` 分支）：

```bash
# 改完本目录的文件后
./deploy.sh
```

脚本会临时克隆部署仓库 → 覆盖部署文件 → 提交推送 → 删除临时目录（不留本地工作副本）。约 1 分钟后线上生效。

| 改什么 | 生效方式 |
|---|---|
| 主题色（`pwa.json` 的 `theme_color` + `index.html` 的 `<meta theme-color>`，两处同步） | 应用窗口 Ctrl+Shift+R 强刷 |
| 应用图标 | **卸载重装**（Chrome 安装时固化图标，刷新不更新） |
| 应用名 | 卸载重装（`name` 用于安装确认与系统列表，`short_name` 用于任务栏/开始菜单磁贴） |

## Tabliss 配置（tabliss.json）

Tabliss 的配置导入是**基于文件**的（bundle 里只有 FileReader/Blob 实现，无 URL 导入参数），所以：

1. 配置已托管在 https://lijiqun.github.io/tabliss-pwa/tabliss.json
2. 在**任意 web.tabliss.io 标签页**（或应用窗口内）打开 Tabliss 设置 → Import → 选择该文件导入一次
3. Tabliss 存入 web.tabliss.io 域的 localStorage → 同源同浏览器配置共享，**应用窗口之后每次启动自动套用**（天气城市、时钟样式、壁纸来源全部生效）

## 权限说明

- Tabliss 的天气需要**地理位置**：壳页 iframe 以 `allow="geolocation"` 授权（跨域 iframe 默认被 Permissions Policy 禁用），首次使用 Chrome 会弹一次权限询问，允许即可
- 全屏：`allow="fullscreen"` 已带
- 其他能力（摄像头/麦克风/通知）Tabliss 不请求，无需放开

## 已知边界

- 应用窗口内点击壁纸不会触发浏览器页面跳转（iframe 隔离），点唱机的外点最小化用「点击盾」实现同一效果（脚本 v1.2.48 起）
- 地址栏导航不受任何脚本控制（浏览器限制）
- GitHub Pages 有约 10 分钟 CDN 缓存，更新文件后若「没变化」先强刷（Ctrl+Shift+R）

## 图标更新指南（2026-11-18 实战踩坑，v3→v8 六轮迭代）

任务栏/窗口图标有一条固化链，**改线上图标文件只是第一步**，四层缓存按序处理：

1. **Chrome HTTP 缓存锁旧图（死结）**：manifest 图标 URL 不变时，重装 PWA 也只会从 Chrome 缓存拿旧 PNG 重新生成旧 ICO——手动改文件会被 Chrome 校验（`.ico.md5` 伴生文件，二进制 md5）后重新拉取覆盖。**根治 = 图标文件换新 URL**（本次 icon-\* → appicon-\*，manifest/favicon/SW/deploy.sh 同步改），URL 变了缓存必然失效
2. **Chrome 进程内存**：运行中 PWA 窗口的任务栏图标由 Chrome 进程动态提供（不走快捷方式），必须**完全退出 Chrome**（`taskkill /F /IM chrome.exe`，桌面版 Chrome 有 23 个进程含后台常驻，关窗口不够）后冷启动才重新读盘
3. **Chrome 图标缓存残留**：`User Data/Default/Web Applications/_crx_<appid>/`（ICO+md5）、`Web Applications/Manifest Resources/<appid>/`（manifest 图标副本）、`JumpListIcons*`——冷启动前删掉对应部分
4. **Windows 图标缓存**：`%LOCALAPPDATA%\IconCache.db` + `%LOCALAPPDATA%\Microsoft\Windows\Explorer\iconcache_*.db`。**坑：WSL 调 `cmd /c "del %LOCALAPPDATA%\..."` 会静默失败**（变量展开/文件锁，错误被 2>nul 吞掉，文件实际没删），必须 kill explorer 后用 WSL `rm` 直接删并 `ls` 验证为 0，再启动 explorer

图标本体规格：从原始 music.png 用正圆蒙版（半径取球体实边 404，蒙版边必须落在实心球内，贴光晕过渡带会出现「圆旁多余蓝色」）抠出球体去光晕，占画布 80% 居中，透明底。Chrome 安装时将 PNG 转 ICO（多尺寸 16-256）存入 `_crx_<appid>/`。

## 相关

- 点唱机脚本母本与版本史：`lijiqun/userscript_dev` 仓库的 `YouTube音频点唱机/` 目录
