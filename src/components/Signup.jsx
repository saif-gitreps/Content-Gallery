import { useState } from "react";
import authService from "../appwrite/auth";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { Button, Input, Loader, Container } from "./index.js";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

function Signup() {
   const [loader, setLoader] = useState(false);
   const navigate = useNavigate();
   const [errorMessage, setErrorMessage] = useState(false);
   const dispatch = useDispatch();
   const { register, handleSubmit } = useForm();

   const create = async (data) => {
      setErrorMessage(false);
      setLoader(true);
      try {
         const userData = await authService.createAccount(data);
         if (userData) {
            const userData = await authService.getCurrentUser();
            if (userData) {
               await authService.updateProfilePicture("/blank-dp.png", "");
               dispatch(login(userData));
            }
            navigate("/");
            setLoader(false);
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
      <Container className="flex flex-col items-center justify-center bg-white p-4 max-w-lg m-auto rounded-xl shadow-md space-y-3">
         <h2 className="text-center text-lg font-bold leading-tight">
            Sign up to create account
         </h2>
         <p className="text-base text-center font-medium ">
            Already have an account?&nbsp;
            <Link
               to="/login"
               className="font-medium text-primary transition-all duration-200 hover:underline text-blue-600"
            >
               Login
            </Link>
         </p>

         <form onSubmit={handleSubmit(create)} className="space-y-4">
            <div className="space-y-4">
               <Input
                  className="text-sm md:text-base font-normal"
                  label="Full Name: "
                  placeholder="Enter your full name"
                  {...register("name", {
                     required: true,
                  })}
               />
               <Input
                  className="text-sm md:text-base font-normal"
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
                  className="text-sm md:text-base font-normal"
                  label="Password: "
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", {
                     required: true,
                  })}
               />
               <Button type="submit" className="w-full" text="Sign up" bgNumber={1}>
                  Create Account
               </Button>
            </div>
         </form>
         {errorMessage && (
            <p className="text-red-600 mt-2 text-base font-medium text-center">
               Error signing up, please try again with different credentials.
            </p>
         )}
      </Container>
   );
}

export default Signup;
