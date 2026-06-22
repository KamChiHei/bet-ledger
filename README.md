# 投注盈亏仪表盘

仅用于个人记账和复盘，不连接博彩网站，也不提供预测或投注建议。

## 运行

```powershell
Copy-Item .env.example .env
npm install
npx prisma generate
npm run db:push
npm run db:seed
npm run dev
```

打开 `http://localhost:3000`。生产构建使用 `npm run build && npm start`。

## 结构

- `app/page.tsx`：首页服务端入口。
- `components/Dashboard.tsx`：统计卡、图表、筛选、分页、表单与 CSV 交互。
- `app/api/bets/*`：投注 CRUD API；所有盈亏均在服务端重算。
- `app/api/settings/route.ts`：初始本金与币种设置。
- `lib/bets.ts`：Zod 校验及赢、输、走水、赢半、输半计算规则。
- `prisma/schema.prisma`：SQLite 数据模型。
- `prisma/seed.ts`：覆盖式写入示例数据。

## CSV 格式

最简单的方式是先从页面导出 CSV，再按相同表头填写后导入。必需列：`date,sport,event,selection,type,odds,stake,status`；可选列：`returnAmount,notes`。状态只能为 `未结算/赢/输/走水/赢半/输半`，日期推荐 `YYYY-MM-DD`。
