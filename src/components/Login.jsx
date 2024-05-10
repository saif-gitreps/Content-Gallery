import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { Button, Input } from "./index";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";

function Login() {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const { register, handleSubmit } = useForm();
   const [errorMessage, setErrorMessage] = useState("");

   const login = async (data) => {
      setErrorMessage("");
      try {
         const session = await authService.login(data);
         if (session) {
            const userData = await authService.getCurrentUser();
            if (userData) {
               dispatch(authLogin(userData));
               navigate("/");
            }
         }
      } catch (error) {
         setErrorMessage(error.message);
      }
   };

   /* To clear confusion, register is a function that returns an object, so we are basically taking all the objects this register function returns */
   return (
      <div className="p-8">
         <div
            className={`flex flex-col items-center justify-center bg-white min-h-96 max-w-xl m-auto rounded-xl shadow-md`}
         >
            <h2 className="text-center text-2xl font-bold leading-tight">
               Sign in to your account
            </h2>
            <p className="text-lg text-center  text-black/60">
               Don&apos;t have any account?&nbsp;
               <Link
                  to="/signup"
                  className="font-medium transition-all duration-200 hover:underline"
               >
                  Sign Up
               </Link>
            </p>
            {errorMessage && (
               <p className="text-red-600 text-lg font-medium text-center">
                  {errorMessage}
               </p>
            )}
            <form onSubmit={handleSubmit(login)} className="mt-6">
               <div className="space-y-4">
                  <Input
                     className="text-xl font-normal"
                     label="Email: "
                     placeholder="Enter your email"
                     type="email"
                     {...register("email", {
                        required: true,
                        validate: {
                           matchPatern: (value) =>
                              /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                              "Email address must be a valid address",
                        },
                     })}
                  />
                  <Input
                     className="text-xl font-normal"
                     label="Password: "
                     type="password"
                     placeholder="Enter your password"
                     {...register("password", {
                        required: true,
                     })}
                  />
                  <Button type="submit" className="w-full">
                     Sign in
                  </Button>
               </div>
            </form>
         </div>
      </div>
   );
}

export default Login;
