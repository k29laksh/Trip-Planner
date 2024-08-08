

import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import { User } from "@/models/User";


export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    // console.log("hashedToken: ", hashedToken)
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000,
        },
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        },
      });
    }

    const transport = nodemailer.createTransport({
     service:"gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "zdead0505@gmail.com",
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: emailType === "VERIFY" ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="text-align: center;">Verify Your Email</h2>
          <p style="font-size: 16px;">Please click the button below to verify your email address. If you did not create an account, no further action is required.</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}" style="background-color: #4CAF50; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Verify Email</a>
          </div>
          <p style="font-size: 16px;">Or copy and paste the link below into your browser:</p>
          <p style="font-size: 14px; color: #555;">${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>
          <p style="text-align: center; font-size: 12px; color: #777;">If you did not request this email, you can safely ignore it.</p>
        </div>
      ` : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="text-align: center;">Reset Your Password</h2>
          <p style="font-size: 16px;">Please click the button below to reset your password. If you did not request a password reset, no further action is required.</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.DOMAIN}/verifytokenandresetpassword?token=${hashedToken}" style="background-color: #FF5733; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Reset Password</a>
          </div>
          <p style="font-size: 16px;">Or copy and paste the link below into your browser:</p>
          <p style="font-size: 14px; color: #555;">${process.env.DOMAIN}/verifytokenandresetpassword?token=${hashedToken}</p>
          <p style="text-align: center; font-size: 12px; color: #777;">If you did not request this email, you can safely ignore it.</p>
        </div>
      `,
    };
    

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
