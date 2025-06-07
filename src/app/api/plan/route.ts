import { dbConnect } from "@/app/config/dbConfig";
import { getTokenData } from "@/helpers/getTokenData";
import { NextRequest, NextResponse } from "next/server";
import SubscriptionPlan from "@/app/models/SubscriptionPlan";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const tokenData = await getTokenData(req);

    if (!tokenData?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const plan = await SubscriptionPlan.findOne({ userId: tokenData.id })
      .populate("userId", "name email role");

    if (!plan) {
      return NextResponse.json({ message: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Plan fetched successfully",
      plan,
    });
  } catch (error) {
    console.error("[PLAN_GET_ERROR]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
