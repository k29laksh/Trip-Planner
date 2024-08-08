"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { signIn, getSession } from "next-auth/react"; // Importing signIn from next-auth/react
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { login, signup } from "@/action/user";
import { useFormStatus } from "react-dom";

const FormComponent = () => {
    const { pending } = useFormStatus();

  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getSession();
        setUser(session?.user );
        if (session?.user) {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchSession();
  }, [router]);

  const [register, setRegister] = useState(false);

  const handleSubmit = async (event:any) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const action = register ? signup : login;

    try {
      await action(formData);
      if (register) {
        setRegister(false);
        toast.success("Account created successfully! Please log in.");
      } else {
        toast.success("Logged in successfully!");
      }
      router.refresh();
    } catch (error:any) {
      toast.error(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn("google");
      router.refresh();
    } catch (error) {
      toast.error("Google login failed!");
      console.log(error)
    }
  };

  return (
    <div className="mt-6 w-full mx-auto rounded-none md:rounded px-2 md:px-4 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-center text-3xl text-neutral-800 dark:text-neutral-200">
        {register ? "Sign Up" : "Sign In"}
      </h2>
      <form className="mt-6 mb-4 flex flex-col gap-3" onSubmit={handleSubmit}>
        {register && (
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Name"
              type="text"
              name="name"
              className="mt-1"
            />
          </div>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="Email"
            type="email"
            name="email"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="Password"
            type="password"
            name="password"
            className="mt-1 mb-6"
          />
          {!register && (
            <p className="text-right text-neutral-600 text-sm max-w-sm dark:text-neutral-300">
              <Link href="/forgotpassword">Forgot Password</Link>
            </p>
          )}
        </div>
        <button disabled={pending} className="bg-gradient-to-br from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
          {register ? (pending ? "Signing up..." : "Sign up")
 : "Sign In"}
        </button>
      </form>
      <button
        onClick={handleGoogleLogin}
        className="flex justify-center items-center bg-gradient-to-br from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
        <FcGoogle className="mr-2 h-5 w-5" />
        {register ? "Sign Up with Google" : "Login with Google"}
      </button>
      <p className="text-right text-neutral-600 text-sm max-w-sm mt-8 dark:text-neutral-300">
        {register ? "Already have an account?" : "Don't have an account?"}
        <button onClick={() => setRegister(!register)} className="font-semibold">
          {register ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
};

export default FormComponent;
