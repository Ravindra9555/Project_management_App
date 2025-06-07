// app/api/plan/update/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/app/config/dbConfig";
import SubscriptionPlan from "@/app/models/SubscriptionPlan";
import User from "@/app/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId, type } = await req.json();

    if (!userId || !type) {
      return NextResponse.json({ message: "userId and plan type are required" }, { status: 400 });
    }

    const validTypes = ["free", "pro", "enterprise"];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ message: "Invalid plan type" }, { status: 400 });
    }

    const planSettings = {
      type,
      projectLimit:type=== "enterprise" ? 150 : type === "pro" ? 50 : 5,
      userLimit: type === "enterprise" ? 1000 : type === "pro" ? 50 : 3,
      isActive: true,
    };

    const updatedPlan = await SubscriptionPlan.findOneAndUpdate(
      { userId },
      { userId, ...planSettings },
      { upsert: true, new: true }
    );

    // Update the user reference (if missing or changed)
    await User.findByIdAndUpdate(userId, {
      subscriptionPlan: updatedPlan._id,
    });

    return NextResponse.json({
      message: "Plan updated successfully",
      plan: updatedPlan,
    }, { status: 200 });

  } catch (error) {
    console.error("[PLAN_UPDATE_ERROR]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
