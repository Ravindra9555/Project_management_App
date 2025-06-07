// app/api/plan/select/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/app/config/dbConfig";
import SubscriptionPlan from "@/app/models/SubscriptionPlan";
import User from "@/app/models/User";
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId, type } = await req.json();

    if (!userId || !type) {
      return NextResponse.json(
        { message: "userId and type are required" },
        { status: 400 }
      );
    }

    if (!["free", "pro", "enterprise"].includes(type)) {
      return NextResponse.json(
        { message: "Invalid plan type" },
        { status: 400 }
      );
    }

    const planData = {
      userId,
      type,
      projectLimit: type==="enterprise" ? 15 : type === "pro" ? 5 : 5,
      userLimit: type === "enterprise" ? 1000 : type === "pro" ? 50 : 3,
      isActive: true,
    };

    const savedPlan = await SubscriptionPlan.findOneAndUpdate(
      { userId },
      planData,
      { upsert: true, new: true }
    );

    await User.findByIdAndUpdate(userId, {
      subscriptionPlan: savedPlan._id,
    });

    return NextResponse.json(
      { message: "Plan selected successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("[PLAN_SELECT_ERROR]", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
