import {PrismaClient} from "@prisma/client";import {calculate} from "../lib/bets";const p=new PrismaClient();const rows=[
  ["2026-06-14","足球","英超 · 曼城 vs 阿森纳","大球 2.5","赛前",1.92,300,"赢",576,"节奏判断正确"],
  ["2026-06-15","篮球","NBA · 湖人 vs 勇士","勇士 +4.5","滚球",1.88,250,"输",0,"第四节失速"],
  ["2026-06-16","电竞","LPL · BLG vs TES","BLG 获胜","单关",1.72,400,"赢半",544,""],
  ["2026-06-18","足球","西甲 · 皇马 vs 巴萨","主胜","单关",2.15,200,"输半",100,""],
  ["2026-06-20","网球","ATP · 决赛","总局数大 22.5","赛前",1.85,180,"走水",180,"退赛取消"],
  ["2026-06-22","篮球","NBA · 总决赛","主队 -3.5","赛前",1.91,300,"未结算",0,"等待开赛"]
] as const;async function main(){await p.settings.upsert({where:{id:1},update:{initialBankroll:5000,currency:"MOP"},create:{id:1,initialBankroll:5000,currency:"MOP"}});await p.bet.deleteMany();for(const r of rows){const [date,sport,event,selection,type,odds,stake,status,returnAmount,notes]=r;const {profit,roi}=calculate(stake,odds,status);await p.bet.create({data:{date:new Date(date),sport,event,selection,type,odds,stake,status,returnAmount,notes,profit,roi}})}}main().finally(()=>p.$disconnect());
