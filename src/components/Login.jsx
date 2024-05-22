import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { Button, Input, Loader } from "./index";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";

function Login() {
   const [loader, setLoader] = useState(false);
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const { register, handleSubmit } = useForm();
   const [errorMessage, setErrorMessage] = useState(false);

   const login = async (data) => {
      setErrorMessage(false);
      setLoader(true);
      try {
         const session = await authService.login(data);
         if (session) {
            const userData = await authService.getCurrentUser();
            if (userData) {
               dispatch(authLogin(userData));
               navigate("/");
               setLoader(false);
            }
         } else {
            setErrorMessage(true);
         }
      } catch (error) {
         setErrorMessage(true);
      }
   };

   return loader ? (
      <Loader />
   ) : (
      <div
         className={`flex flex-col items-center justify-center bg-white p-5 max-w-xl m-auto rounded-xl shadow-md`}
      >
         <h2 className="text-center text-2xl font-bold leading-tight">
            Login to your account
         </h2>
         <p className="text-lg text-center font-medium ">
            Don&apos;t have any account?&nbsp;
            <Link
               to="/signup"
               className="font-medium transition-all duration-200 hover:underline text-gray-500"
            >
               Sign Up
            </Link>
         </p>

         <form onSubmit={handleSubmit(login)} className="mt-6 space-y-4">
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
         </form>
         <p className="text-lg font-medium text-center">
            Forgot password?&nbsp;
            <Link
               to="/password-recovery-step-one"
               className="font-semibold transition-all duration-200 hover:underline text-gray-500"
            >
               Click here to recover.
            </Link>
         </p>
         {errorMessage && (
            <p className="text-red-600 mt-2 text-lg font-medium text-center">
               Please check your credentials and try again.
            </p>
         )}
      </div>
   );
}

export default Login;
