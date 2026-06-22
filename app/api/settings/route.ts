import { prisma } from "@/lib/prisma"; import { NextResponse } from "next/server";
export async function GET(){return NextResponse.json(await prisma.settings.upsert({where:{id:1},update:{},create:{id:1}}));}
export async function PUT(req:Request){const {initialBankroll,currency}=await req.json();if(!(initialBankroll>=0)||!["MOP","HKD"].includes(currency))return NextResponse.json({error:"参数无效"},{status:400});return NextResponse.json(await prisma.settings.upsert({where:{id:1},update:{initialBankroll,currency},create:{id:1,initialBankroll,currency}}));}
