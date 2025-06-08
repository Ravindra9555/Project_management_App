import { NextResponse } from "next/server";
import { dbConnect } from "@/app/config/dbConfig";
import User from "../../../../models/User";
import { getTokenData } from "@/helpers/getTokenData";
// Export an asynchronous function called POST that takes a Request object as a parameter
export async function POST(req: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the token data from the request
    const tokenData = await getTokenData(req);
    // If the token data does not have an id, return a 401 Unauthorized response
    if (!tokenData?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Find the user in the database using the id from the token data
    const user = await User.findById(tokenData.id);
    // If the user is not found, return a 404 Not Found response
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get the name and profilePic from the request body
    const { name, profilePic } = await req.json();
    // If the name is not provided, return a 400 Bad Request response
    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    // Create an object to store the updated data
    const updateData: any = { name };
    // If a profilePic is provided, add it to the updateData object
    if (profilePic) updateData.profilePic = profilePic;

    // Update the user in the database with the new data
    const updatedUser = await User.findByIdAndUpdate(tokenData.id, updateData, {
      new: true,
    });

    // Return a 200 OK response with the updated user data
    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          profilePic: updatedUser.profilePic,
          email: updatedUser.email,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    // Log the error to the console
    console.error("[PROFILE_UPDATE_ERROR]", err);
    // Return a 500 Internal Server Error response
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
