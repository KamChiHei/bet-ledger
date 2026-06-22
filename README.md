# 投注盈亏仪表盘

个人投注记账和复盘工具，不连接博彩网站，也不提供预测或投注建议。

## 给普通用户：Windows 离线版

普通用户无需安装 Node.js、npm 或数据库，也不需要使用终端：

1. 从 GitHub Actions 的 `BetLedger-Windows` 构建产物下载 `.exe`。
2. 运行安装版或便携版 `.exe`。
3. 应用会自动创建本地 SQLite 数据库，此后数据都保存在这台电脑上。

数据库位于 Windows 用户数据目录的 `bet-ledger.db`。卸载应用不会主动删除该文件，升级安装也不会覆盖已有记录。用户仍可通过应用内 CSV 导出功能定期备份。

## 开发运行

```powershell
Copy-Item .env.example .env
npm install
npx prisma generate
npm run db:push
npm run db:seed
npm run dev
```

打开 `http://localhost:3000`。生产构建使用 `npm run build`。

## 生成 Windows 安装包

```powershell
npm install
npx prisma generate
npm run desktop:build
```

生成结果位于 `release/`：NSIS 安装版和便携版均为 `.exe`。也可以在 GitHub 仓库的 Actions 页面手动运行 **Build Windows desktop app**，完成后下载构建产物。

## 主要结构

- `electron/main.cjs`：桌面窗口、本地 Next 服务和用户数据库初始化。
- `scripts/prepare-desktop.mjs`：准备 standalone 服务与首次启动数据库模板。
- `.github/workflows/windows-desktop.yml`：云端自动构建 Windows 安装包。
- `components/Dashboard.tsx`：统计卡、图表、筛选、分页、表单与 CSV 交互。
- `app/api/bets/*`：投注 CRUD API，所有盈亏均在服务端重算。
- `lib/bets.ts`：Zod 校验及盈亏、ROI 计算规则。
- `prisma/schema.prisma`：SQLite 数据模型。
- `prisma/seed.ts`：示例数据。

## CSV 格式

建议先从应用导出 CSV，再按相同表头填写后导入。必需列为 `date,sport,event,selection,type,odds,stake,status`；可选列为 `returnAmount,notes`。状态只能是 `未结算/赢/输/走水/赢半/输半`，日期推荐使用 `YYYY-MM-DD`。
