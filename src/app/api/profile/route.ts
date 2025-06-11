// import { dbConnect } from "@/app/config/dbConfig";
// import { NextRequest, NextResponse } from "next/server";
// import User from "../../../models/User";
// import { getTokenData } from "@/helpers/getTokenData";

// export async function GET(request: NextRequest) {
//   try {
//     await dbConnect();

//     const tokenData = await getTokenData(request);
//     if (!tokenData || !tokenData.id) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     // console.log("[PROFILE_GET_REQUEST]", tokenData);

//     const user = await User.findById(tokenData.id)
//       .populate(
//         "subscriptionPlan",
//         "expiresAt isActive userLimit projectLimit type"
//       )
//       .select("-password");

//     if (!user) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json(user, { status: 200 });
//   } catch (error) {
//     console.error("[PROFILE_GET_ERROR]", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }


// In: app/api/profile/route.ts
// In: app/api/profile/route.ts

// In: app/api/profile/route.ts

import { dbConnect } from "@/app/config/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getTokenData } from "@/helpers/getTokenData";

// These imports are correct and necessary. They make the models available.
import User from "@/models/User";
import Company from "@/models/Company";
import SubscriptionPlan from "@/models/SubscriptionPlan";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const tokenData = await getTokenData(request);
    if (!tokenData?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const planSelection = "expiresAt isActive userLimit projectLimit type";

    const user = await User.findById(tokenData.id)
      .select("-password")
      .populate("subscriptionPlan", planSelection)
      .populate({
        path: "companyId",
        select: "name subscriptionPlan",
        // --- FIX IS HERE: EXPLICITLY PROVIDE THE COMPANY MODEL ---
        model: Company, // <-- ADD THIS LINE
        populate: {
          path: "subscriptionPlan",
          select: planSelection,
          model: SubscriptionPlan,
        },
      });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    const userObject = user.toObject();

    if (userObject.accountType === 'organization' && userObject.companyId?.subscriptionPlan) {
        userObject.subscriptionPlan = userObject.companyId.subscriptionPlan;
    }
    
    return NextResponse.json(userObject, { status: 200 });

  } catch (error: any) {
    console.error("[PROFILE_GET_ERROR]", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}