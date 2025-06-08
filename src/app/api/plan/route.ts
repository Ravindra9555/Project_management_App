import { dbConnect } from "@/app/config/dbConfig";
import { getTokenData } from "@/helpers/getTokenData";
import { NextRequest, NextResponse } from "next/server";
import SubscriptionPlan from "../../../models/SubscriptionPlan";

// Export an asynchronous function called GET that takes a NextRequest as an argument
export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();
    // Get the token data from the request
    const tokenData = await getTokenData(req);

    // If the token data does not have an id, return a 401 Unauthorized response
    if (!tokenData?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Find the subscription plan associated with the user id in the token data
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
