// app/api/plan/update/route.ts


import { NextResponse } from "next/server";
import { dbConnect } from "@/app/config/dbConfig";
import SubscriptionPlan from "@/models/SubscriptionPlan";
import User from "@/models/User";
import Company from "@/models/Company";

// Export an asynchronous function named POST that takes a Request object as a parameter
export async function POST(req: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Destructure the userId, type, accountType, and companyData from the request body
    const { userId, type, accountType, companyData } = await req.json();

    // Check if userId, type, and accountType are present
    if (!userId || !type || !accountType) {
      // Return a 400 status code with a message if any of them are missing
      return NextResponse.json(
        { message: "userId, type, and accountType are required" },
        { status: 400 }
      );
    }

    // Check if the type is one of the allowed types
    if (!["free", "pro", "enterprise"].includes(type)) {
      // Return a 400 status code with a message if the type is not allowed
      return NextResponse.json(
        { message: "Invalid plan type" },
        { status: 400 }
      );
    }

    // Check if the accountType is one of the allowed types
    if (!["individual", "organization"].includes(accountType)) {
      // Return a 400 status code with a message if the accountType is not allowed
      return NextResponse.json(
        { message: "Invalid accountType" },
        { status: 400 }
      );
    }

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      // Return a 404 status code with a message if the user is not found
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Restrict organization users from changing plans
    if (user.accountType === "organization") {
      // Return a 403 status code with a message if the user is an organization user
      return NextResponse.json(
        { message: "Organization users are not allowed to change plans" },
        { status: 403 }
      );
    }

    let companyId = null;

    // If upgrading to pro or enterprise, create company
    if (["enterprise"].includes(type)) {
      // Check if companyData and name are present
      if (!companyData || !companyData.name) {
        // Return a 400 status code with a message if companyData or name is missing
        return NextResponse.json(
          {
            message: "Company data (with name) is required to upgrade from individual",
          },
          { status: 400 }
        );
      }

      // Set the createdBy to the userId
      companyData.createdBy = userId;
      // Create a new company
      const company = await Company.create(companyData);
      // Set the companyId to the new company's id
      companyId = company._id;

      // Set the user's accountType to organization
      user.accountType = "organization";
      // Set the user's companyId to the new company's id
      user.companyId = companyId;
      // Set the user's role to admin
      user.role = "admin";
    } 
     else {
      // Downgrade to free, no company
      // Set the user's accountType to individual
      user.accountType = "individual";
      // Set the user's companyId to null
      user.companyId = null;
    }

    // Define limits
    const planData = {
      userId,
      companyId,
      type,
      projectLimit: type === "enterprise" ? 15 : type === "pro" ? 10 : 3,
      userLimit: type === "enterprise" ? 500 : type === "pro" ? 50 : 5,
      isActive: true,
    };

    // Upsert subscription plan
    const savedPlan = await SubscriptionPlan.findOneAndUpdate(
      { userId },
      planData,
      { upsert: true, new: true }
    );

    // Set the user's subscriptionPlan to the saved plan's id
    user.subscriptionPlan = savedPlan._id;
    // Save the user
    await user.save();

    // If company created, attach subscription to company
    if (companyId) {
      // Update the company's subscriptionPlan to the saved plan's id
      await Company.findByIdAndUpdate(
        companyId,
        { subscriptionPlan: savedPlan._id },
        { new: true }
      );
    }

    // Return a 200 status code with a message and the saved plan
    return NextResponse.json(
      { message: "Plan updated successfully", plan: savedPlan },
      { status: 200 }
    );
  } catch (err) {
    // Log the error
    console.error("[PLAN_UPDATE_ERROR]", err);
    // Return a 500 status code with a message
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
