import { prisma } from "@/lib/prisma"; import { betSchema,calculate } from "@/lib/bets"; import { NextResponse } from "next/server";
export async function GET(){return NextResponse.json(await prisma.bet.findMany({orderBy:{date:"desc"}}));}
export async function POST(req:Request){const p=betSchema.safeParse(await req.json());if(!p.success)return NextResponse.json({error:p.error.flatten()},{status:400});const x=p.data,{profit,roi}=calculate(x.stake,x.odds,x.status);return NextResponse.json(await prisma.bet.create({data:{...x,profit,roi}}),{status:201});}
