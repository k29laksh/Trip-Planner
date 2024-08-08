"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function VerifyResetToken() {
  const [token, setToken] = useState<string>("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [resetPassword, setResetPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const router = useRouter();

  const verifyToken = async () => {
    try {
      setLoading(true);

      await axios.post("/api/users/verifyresettoken", { token });
      setVerified(true);
    } catch (error: any) {
      setError(true);
      console.log(error.reponse.data);
    } finally {
      setLoading(false);
    }
  };
  const sendResetPassword = async (e: any) => {
    try {
      e.preventDefault();
      await axios.post("/api/users/saveresetpassword", {
        token,
        resetPassword,

      }
    );
    router.push("/login")

    } catch (error: any) {
      setError(true);
      console.log(error.reponse.data);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  //   useEffect(() => {
  //     if (router.isReady) {
  //         const urlToken = router.query.token as string ; // Assuming the query parameter name is 'token'
  //         setToken(urlToken|| '');
  //     }
  // }, [router.isReady, router.query]);

  useEffect(() => {
    if (token.length > 0) {
      verifyToken();
    }
  }, [token]);

  useEffect(() => {
    if (resetPassword.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [resetPassword]);

  return (
    <form
      onSubmit={sendResetPassword}
      className="flex flex-col items-center justify-center min-h-screen py-2"
    >
      {verified ? (
        <>
          <h1 className="text-4xl m-4">Enter new Password</h1>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Password"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
            />
          </div>
        </>
      ) : (
        ""
      )}

      {verified && (
        <button
          type="submit"
          className={` px-4 py-3 m-4 font-semibold text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            buttonDisabled ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
          disabled={buttonDisabled}
        >
          {loading ? "Processing" : "Reset password"}
        </button>
      )}
      {error && (
        <div>
          <h2 className="text-2xl bg-red-500 text-black">
            Somthing went wrong
          </h2>
        </div>
      )}
    </form>
  );
}
