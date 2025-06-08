import { NextResponse } from "next/server";
import { dbConnect } from "@/app/config/dbConfig";
import SubscriptionPlan from "@/models/SubscriptionPlan";
import User from "@/models/User";
import Company from "../../../../models/Company";

// Export an asynchronous function called POST that takes a Request object as a parameter
export async function POST(req: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Destructure the userId, type, accountType, and companyData from the request body
    const { userId, type, accountType, companyData } = await req.json();

    // Check if userId, type, and accountType are present
    if (!userId || !type || !accountType) {
      // Return a JSON response with a 400 status code and a message
      return NextResponse.json(
        { message: "userId, type, and accountType are required" },
        { status: 400 }
      );
    }

    // Check if the type is one of the allowed types
    if (!["free", "pro", "enterprise"].includes(type)) {
      // Return a JSON response with a 400 status code and a message
      return NextResponse.json(
        { message: "Invalid plan type" },
        { status: 400 }
      );
    }

    // Check if the accountType is one of the allowed types
    if (!["individual", "organization"].includes(accountType)) {
      // Return a JSON response with a 400 status code and a message
      return NextResponse.json(
        { message: "Invalid accountType" },
        { status: 400 }
      );
    }

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      // Return a JSON response with a 404 status code and a message
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Initialize the companyId to null
    let companyId = null;

    // If the accountType is organization
    if (accountType === "organization") {
      // Check if companyData and companyData.name are present
      if (!companyData || !companyData.name) {
        // Return a JSON response with a 400 status code and a message
        return NextResponse.json(
          {
            message:
              "Company data with at least a name is required for organization account",
          },
          { status: 400 }
        );
      }

      // Set the createdBy field of companyData to userId
      companyData.createdBy = userId;
      // Create a new organization with the companyData
      const organization = await Company.create(companyData);
      // Set the companyId to the _id of the organization
      companyId = organization._id;

      // Set the user's companyId to the companyId of the organization
      user.companyId = companyId;
      // Set the user's role to admin
      user.role = "admin";
      // Set the user's accountType to organization
      user.accountType = "organization";
      // Save the user
      await user.save();
    } else {
      // Set the user's accountType to individual
      user.accountType = "individual";
      // Set the user's companyId to null
      user.companyId = null;
      // Save the user
      await user.save();
    }

    // Create a planData object with the userId, companyId, type, projectLimit, userLimit, and isActive
    const planData = {
      userId,
      companyId,
      type,
      projectLimit: type === "enterprise" ? 15 : type === "pro" ? 10 : 3,
      userLimit: type === "enterprise" ? 500 : type === "pro" ? 50 : 5,
      isActive: true,
    };

    // Find or create a subscriptionPlan with the planData
    const savedPlan = await SubscriptionPlan.findOneAndUpdate(
      { userId },
      planData,
      { upsert: true, new: true }
    );

    // Set the user's subscriptionPlan to the _id of the savedPlan
    user.subscriptionPlan = savedPlan._id;
    // Save the user
    await user.save();
    // if organization, update company
    if (accountType === "organization") {
      // Find and update the organization with the companyId and set the subscriptionPlan to the _id of the savedPlan
      const organization = await Company.findByIdAndUpdate(
        companyId,
        { subscriptionPlan: savedPlan._id },
        { new: true }
      );
      // If the organization is not found, return a JSON response with a 404 status code and a message
      if (!organization) {
        return NextResponse.json(
          { message: "Organization not found" },
          { status: 404 }
        );
      }
    }
    // Return a JSON response with a 200 status code and a message and the savedPlan
    return NextResponse.json(
      { message: "Plan and account type set successfully", plan: savedPlan },
      { status: 200 }
    );
  } catch (err) {
    // Log the error
    console.error("[PLAN_SELECT_ERROR]", err);
    // Return a JSON response with a 500 status code and a message and the error
    return NextResponse.json(
      { message: "Something went wrong", error: err },
      { status: 500 }
    );
  }
}
