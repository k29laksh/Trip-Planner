"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";

const ForgotPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendToken, setSendToken] = useState(false);

  const sendResetToken = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/users/forgotpassword", user);
      console.log("token sent successfully", response.data);
      setSendToken(true)
      setUser({email:""})
      toast.success("we sent a reset password token on your registered email");
     
    } catch (error: any) {
      console.log("email not veified", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white rounded-lg shadow-lg">
         {sendToken? <h2 className="text-center text-xl font-bold text-gray-900">
         we sent a reset password token on your registered email!!! Check your email 
        </h2>   :<h2 className="text-center text-xl font-bold text-gray-900">
          Enter your registered Email
        </h2>   }
         <form className="mt-8 space-y-8" onSubmit={sendResetToken}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
         
        </div>
        <button
          type="submit"
          className={`w-full py-2 font-semibold text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${buttonDisabled ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          disabled={buttonDisabled}
        >
          {loading ? "Processing" : "Send Email"}
        </button>
      </form>
     
    
    </div>
    </div>
  );
};

export default ForgotPage;
