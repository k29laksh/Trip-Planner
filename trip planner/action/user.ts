"use server";

import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";

const login = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      email,
      password,
    });
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Login failed. Please check your credentials.");
  }
  redirect("/");
};

const googleLogin = async () => {
  await signIn("google");
};

const signup = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    throw new Error("Please fill all fields");
  }

  await connectDB();

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await hash(password, 12);

  await User.create({ name, email, password: hashedPassword });
  console.log("User created successfully 🥂");
};

const fetchAllUsers = async () => {
  await connectDB();
  const users = await User.find({});
  return users;
};

export { signup, login, fetchAllUsers, googleLogin };
