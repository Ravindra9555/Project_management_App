// app/api/project/route.ts
import { NextResponse } from "next/server";
import { getTokenData } from "@/helpers/getTokenData";
import { dbConnect } from "@/app/config/dbConfig";
import User from "../../../models/User";
import Project from "../../../models/Project";
// Export an asynchronous function called GET that takes a Request object as a parameter
export async function GET(req: Request) {
  try {
    // Connect to the database
    await dbConnect();
    // Get the token data from the request
    const tokenData = await getTokenData(req);
    // If the token data does not have an id, return a 401 Unauthorized response
    if (!tokenData?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // Find the user in the database using the id from the token data
    const user = await User.findById(tokenData.id);
    // If the user is not found, return a 404 Not Found response
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

       let filter = {};

    if (user.accountType === "organization" && user.role === "admin") {
      // Admin of an organization sees all company projects
      filter = { companyId: user.companyId };
    } else {
      // Individual, or engineer/worker/client
      filter = {
        $or: [
          { createdBy: user._id },
          { assignedUsers: user._id },
        ]
      };
    }

    const projects = await Project
      .find(filter)
      .populate("assignedUsers", "name email role")
      .populate("createdBy", "name email");

    return NextResponse.json({ projects }, { status: 200 });
 

  } catch (err) {
    // Log the error to the console
    console.error("[PROJECT_LIST_ERROR]", err);
    // Return a 500 Internal Server Error response
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
