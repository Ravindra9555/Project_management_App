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

    // Set the filter for the projects based on the user's role
    const filter = user.role === "admin"
      ? { } // admin sees all projects
      : {
          $or: [
            { createdBy: user._id },
            { assignedUsers: user._id }
          ]
        };

    // Find the projects in the database using the filter and populate the assignedUsers and createdBy fields
    const projects = await Project
      .find(filter)
      .populate("assignedUsers", "name email role")
      .populate("createdBy", "name email");

    // Return a 200 OK response with the projects
    return NextResponse.json({ projects }, { status: 200 });

  } catch (err) {
    // Log the error to the console
    console.error("[PROJECT_LIST_ERROR]", err);
    // Return a 500 Internal Server Error response
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
