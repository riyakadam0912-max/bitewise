import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getChatGPTUser } from "../../chatgpt-auth";
import { getDb } from "../../../db";
import { diaryEntries, hydrationLogs, profiles } from "../../../db/schema";

const today = () => new Date().toISOString().slice(0, 10);

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getDb();
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, user.userId));
  const entries = await db.select().from(diaryEntries).where(and(eq(diaryEntries.userId, user.userId), eq(diaryEntries.entryDate, today())));
  const [water] = await db.select().from(hydrationLogs).where(and(eq(hydrationLogs.userId, user.userId), eq(hydrationLogs.entryDate, today())));
  return NextResponse.json({ profile: profile ?? null, entries, water: water?.glasses ?? 0 });
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as Record<string, unknown>;
  const db = getDb(); const now = new Date().toISOString();
  if (body.type === "profile") {
    const goal = String(body.goal ?? "Maintain weight"); const diet = String(body.diet ?? "Vegetarian");
    const target = goal === "Build muscle" ? 2300 : goal === "Lose weight gently" ? 1800 : 2000;
    await db.insert(profiles).values({ userId:user.userId, displayName:String(body.displayName ?? user.displayName), goal, diet, cuisine:String(body.cuisine ?? "Indian"), calorieTarget:target, proteinTarget:goal === "Build muscle" ? 130 : 105, carbsTarget:250, fatTarget:65, waterTarget:8, onboardingComplete:true, updatedAt:now }).onConflictDoUpdate({ target:profiles.userId, set:{ displayName:String(body.displayName ?? user.displayName), goal, diet, cuisine:String(body.cuisine ?? "Indian"), calorieTarget:target, proteinTarget:goal === "Build muscle" ? 130 : 105, onboardingComplete:true, updatedAt:now } });
  } else if (body.type === "entry") {
    await db.insert(diaryEntries).values({ userId:user.userId, entryDate:today(), meal:String(body.meal ?? "Lunch"), name:String(body.name ?? "Custom food"), calories:Number(body.calories) || 0, protein:Number(body.protein) || 0, carbs:Number(body.carbs) || 0, fat:Number(body.fat) || 0, createdAt:now });
  } else if (body.type === "water") {
    const glasses = Math.max(0, Math.min(20, Number(body.glasses) || 0));
    const [existing] = await db.select().from(hydrationLogs).where(and(eq(hydrationLogs.userId,user.userId),eq(hydrationLogs.entryDate,today())));
    if (existing) await db.update(hydrationLogs).set({ glasses, updatedAt:now }).where(eq(hydrationLogs.id,existing.id));
    else await db.insert(hydrationLogs).values({ userId:user.userId, entryDate:today(), glasses, updatedAt:now });
  } else if (body.type === "delete") {
    await db.delete(diaryEntries).where(and(eq(diaryEntries.userId,user.userId),eq(diaryEntries.id,Number(body.id))));
  }
  return NextResponse.json({ ok:true });
}
