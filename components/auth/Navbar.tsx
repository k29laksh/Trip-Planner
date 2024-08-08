import Link from "next/link";
import { Button } from "../ui/button";
import { getSession } from "@/lib/getSession";
import { signOut } from "@/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import FormComponent from "./FormComponent";

const Navbar = async () => {
  const session = await getSession();
  const user = session?.user;

  return (
    <nav className="flex justify-between px-6 items-center py-4 bg-[#ffffff] shadow text-black">
    <div  className="flex gap-8 items-center">
    <Link href="/" className="text-2xl font-semibold flex items-center">
        RouteSnap
      </Link>

    <ul className="flex items-center font-base space-x-4">
      <Link href="/"> Home</Link>
      <Link href="/"> Explore</Link>
      <Link href="/"> About Us</Link>
      <Link href="/"> Contact Us</Link>
    </ul>
    </div>


      <ul className="hidden md:flex space-x-4 list-none">
        {!user ? (
          <>
            <Dialog>
              <DialogTrigger><Button type="submit" className="bg-black text-white">
                Login
              </Button></DialogTrigger>
              <DialogContent className=" w-full sm:w-[400px] ">
                <DialogHeader>
                  <DialogDescription>
                    <FormComponent />
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            
          </>
        ) : (
          <>
            <li className="mt-2">
              <Link href="/private/dashboard" className="hover:text-gray-400">
                Dashboard
              </Link>
            </li>

            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button type="submit" className="bg-white text-black">
                Logout
              </Button>
            </form>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
