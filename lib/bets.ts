import { z } from "zod";
export const STATUSES=["未结算","赢","输","走水","赢半","输半"] as const;
export const betSchema=z.object({date:z.coerce.date(),sport:z.string().min(1),event:z.string().min(1),selection:z.string().min(1),type:z.string().min(1),odds:z.coerce.number().gt(1),stake:z.coerce.number().positive(),status:z.enum(STATUSES),returnAmount:z.coerce.number().min(0).default(0),notes:z.string().optional().default("")});
export type BetInput=z.infer<typeof betSchema>;
export function calculate(stake:number,odds:number,status:string){let profit=0;if(status==="赢")profit=stake*odds-stake;else if(status==="输")profit=-stake;else if(status==="赢半")profit=stake*(odds-1)/2;else if(status==="输半")profit=-stake/2;return {profit,roi:status==="未结算"?0:(profit/stake)*100};}
