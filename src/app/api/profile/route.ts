import { dbConnect } from "@/app/config/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/User";
import { getTokenData } from "@/helpers/getTokenData";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const tokenData = await getTokenData(request);
    if (!tokenData || !tokenData.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log("[PROFILE_GET_REQUEST]", tokenData);

    const user = await User.findById(tokenData.id)
      .populate(
        "subscriptionPlan",
        "expiresAt isActive userLimit projectLimit type"
      )
      .select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("[PROFILE_GET_ERROR]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
