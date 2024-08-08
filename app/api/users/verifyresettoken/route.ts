import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs"


connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    const { token } = reqBody;

    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "token Invalid or expired",
        },
        {
          status: 400,
        }
      );
    }
    console.log(user);

    // const salt = await bcryptjs.genSalt(10);

    // const hashResetPassword= await bcryptjs.hash(resetPassword,salt)

  

    // user.password=hashResetPassword;
    // user.forgotPasswordToken = undefined;
    // user.forgotPasswordTokenExpiry = undefined;

    // await user.save();

    return NextResponse.json(
      {
        message: "Token verified successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
