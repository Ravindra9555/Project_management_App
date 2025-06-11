// import { dbConnect } from "@/app/config/dbConfig";
// import { getTokenData } from "@/helpers/getTokenData";
// import Project from "../../../../models/Project";
// import User from "../../../../models/User";
// import { NextRequest, NextResponse } from 'next/server';
// import { Types } from 'mongoose';

// // interface BasicUser {
// //   _id: Types.ObjectId;
// //   name: string;
// //   email: string;
// //   role?: string;
// // }


// export async function GET(request: NextRequest,{params}:{params: { id: string }}) {
  
//   try {
//     await dbConnect();
//     const tokenData = await getTokenData(request);
//     if (!tokenData?.id) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const user = await User.findById(tokenData.id);
//     if (!user) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     const project = await Project.findById(params.id)
//       .populate("assignedUsers", "name email role")
//       .populate("createdBy", "name email");

//     if (!project) {
//       return NextResponse.json({ message: "Project not found" }, { status: 404 });
//     }

//     // const isInvolved = user.role === "admin" ||
//     //   project.createdBy._id.equals(user._id) ||
//     //   project.assignedUsers.some((u: BasicUser) => u._id.equals(user._id));

//     // if (!isInvolved) {
//     //   return NextResponse.json({ message: "Forbidden" }, { status: 403 });
//     // }

//     return NextResponse.json({ project }, { status: 200 });
//   } catch (err) {
//     console.error("[PROJECT_SINGLE_ERROR]", err);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// // export async function GET(req: Request, { params }: { params: { id: string } }) {
// //   try {
// //     await dbConnect();
// //     const tokenData = await getTokenData(req);
// //     if (!tokenData?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

// //     const user = await User.findById(tokenData.id);
// //     if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

// //     const project = await Project.findById(params.id)
// //       .populate("assignedUsers", "name email role")
// //       .populate("createdBy", "name email");

// //     if (!project) return NextResponse.json({ message: "Project not found" }, { status: 404 });

// //     const isInvolved = user.role === "admin"
// //       || project.createdBy._id.equals(user._id)
// //       || project.assignedUsers.some((u: BasicUser) => u._id.equals(user._id));

// //     if (!isInvolved) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

// //     return NextResponse.json({ project }, { status: 200 });

// //   } catch (err) {
// //     console.error("[PROJECT_SINGLE_ERROR]", err);
// //     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
// //   }
// // }

// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
//   try {
//     await dbConnect();
//     const tokenData = await getTokenData(req);
//     if (!tokenData?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

//     const user = await User.findById(tokenData.id);
//     if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

//     const project = await Project.findById(params.id);
//     if (!project) return NextResponse.json({ message: "Project not found" }, { status: 404 });

//     const isAdmin = user.role === "admin";
//     const isOwner = project.createdBy.equals(user._id);

//     if (!isAdmin && !isOwner) {
//       return NextResponse.json({ message: "Forbidden" }, { status: 403 });
//     }

//     await Project.findByIdAndDelete(params.id);
//     return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 });

//   } catch (err) {
//     console.error("[PROJECT_DELETE_ERROR]", err);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }

// interface ProjectUpdateData {
//   name?: string;
//   description?: string;
//   assignedUsers?: Types.ObjectId[];
//   deadline?: Date;
//   status?: string;
// }

// export async function PUT(req: Request, { params }: { params: { id: string } }) {
//   try {
//     await dbConnect();
//     const tokenData = await getTokenData(req);
//     if (!tokenData?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

//     const user = await User.findById(tokenData.id);
//     if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

//     const project = await Project.findById(params.id);
//     if (!project) return NextResponse.json({ message: "Project not found" }, { status: 404 });

//     const isAdmin = user.role === "admin";
//     const isOwner = project.createdBy.equals(user._id);
//     if (!isAdmin && !isOwner) {
//       return NextResponse.json({ message: "Forbidden" }, { status: 403 });
//     }

//     if (user.role === "worker" && !user.subscriptionPlan) {
//       return NextResponse.json({ message: "Worker cannot update projects" }, { status: 403 });
//     } else if (["admin"].includes(user.role) && !user.subscriptionPlan) {
//       return NextResponse.json({ message: "No active plan" }, { status: 403 });
//     } else if (user.accountType === "individual" && !user.subscriptionPlan) {
//       return NextResponse.json({ message: "No active plan" }, { status: 403 });
//     }

//     const { name, description, assignedUsers, deadline, status } = await req.json();

//     const updateData: ProjectUpdateData = {
//       name,
//       description,
//       assignedUsers: assignedUsers || [],
//       deadline,
//       status,
//     };

//     const updatedProject = await Project.findByIdAndUpdate(
//       params.id,
//       updateData,
//       { new: true }
//     )
//       .populate("assignedUsers", "name email role")
//       .populate("createdBy", "name email");

//     return NextResponse.json(
//       { message: "Project updated successfully", project: updatedProject },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("[PROJECT_UPDATE_ERROR]", error);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }

import { dbConnect } from "@/app/config/dbConfig";
import { getTokenData } from "@/helpers/getTokenData";
import Project from "../../../../models/Project";
import User from "../../../../models/User";
import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';

// This is the working GET handler you already had
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const tokenData = await getTokenData(request);
    if (!tokenData?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(tokenData.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const project = await Project.findById(params.id)
      .populate("assignedUsers", "name email role")
      .populate("createdBy", "name email");

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }
    
    // Authorization logic can be added back here if needed
    
    return NextResponse.json({ project }, { status: 200 });
  } catch (err) {
    console.error("[PROJECT_SINGLE_ERROR]", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}


// CORRECTED DELETE handler
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const tokenData = await getTokenData(request); // Changed from req
    if (!tokenData?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await User.findById(tokenData.id);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const project = await Project.findById(params.id);
    if (!project) return NextResponse.json({ message: "Project not found" }, { status: 404 });

    const isAdmin = user.role === "admin";
    const isOwner = project.createdBy.equals(user._id);

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await Project.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 });

  } catch (err) {
    console.error("[PROJECT_DELETE_ERROR]", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

interface ProjectUpdateData {
  name?: string;
  description?: string;
  assignedUsers?: Types.ObjectId[];
  deadline?: Date;
  status?: string;
}

// CORRECTED PUT handler
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const tokenData = await getTokenData(request); // Changed from req
    if (!tokenData?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await User.findById(tokenData.id);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const project = await Project.findById(params.id);
    if (!project) return NextResponse.json({ message: "Project not found" }, { status: 404 });

    const isAdmin = user.role === "admin";
    const isOwner = project.createdBy.equals(user._id);
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (user.role === "worker" && !user.subscriptionPlan) {
      return NextResponse.json({ message: "Worker cannot update projects" }, { status: 403 });
    } else if (["admin"].includes(user.role) && !user.subscriptionPlan) {
      return NextResponse.json({ message: "No active plan" }, { status: 403 });
    } else if (user.accountType === "individual" && !user.subscriptionPlan) {
      return NextResponse.json({ message: "No active plan" }, { status: 403 });
    }

    const { name, description, assignedUsers, deadline, status } = await request.json(); // Changed from req

    const updateData: ProjectUpdateData = {
      name,
      description,
      assignedUsers: assignedUsers || [],
      deadline,
      status,
    };

    const updatedProject = await Project.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    )
      .populate("assignedUsers", "name email role")
      .populate("createdBy", "name email");

    return NextResponse.json(
      { message: "Project updated successfully", project: updatedProject },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PROJECT_UPDATE_ERROR]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}