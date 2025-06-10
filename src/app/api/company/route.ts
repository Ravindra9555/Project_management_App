import { dbConnect } from "@/app/config/dbConfig";
import Company from "@/models/Company";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId is required" });
    }

    const companies = await Company.find({ "createdBy" : userId })
    .populate("createdBy" ,"name  email role accountType isActive")
    .populate("subscriptionPlan");
    return NextResponse.json(companies);
  } catch (error) {
    return NextResponse.json({ error: error, "message" :"Internal Server Error" });
  }
}
