'use client'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import Register from '@/app/register/page';
import Login from '@/app/login/page';
interface ToggleFormProps {
    toggleForm: () => void;
  }
const AuthPopup = () => {
    const [isLogin, setIsLogin] = useState(true); 
  
    const toggleForm = () => setIsLogin(!isLogin);
  
    return (
      <Dialog>
        <DialogTrigger>{isLogin ? "Login" : "Register"}</DialogTrigger>
        <DialogContent className="w-full sm:w-[400px]">
          <DialogHeader>
            <DialogDescription>
              {isLogin ? <Login toggleForm={toggleForm} /> : <Register toggleForm={toggleForm} />}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  };

export default AuthPopup
