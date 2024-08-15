import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import authService from "../appwrite/auth";
import appwriteUserService from "../appwrite/config-user";
import { login } from "../store/authSlice";
import { Button, Input, LoaderMini, Container, ErrorMessage } from "./index";

function Signup() {
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();

   const signupMutation = useMutation({
      mutationFn: async (data) => {
         const userData = await authService.createAccount(data);
         if (!userData) throw new Error("Error signing up. Please try again.");

         const profileData = await appwriteUserService.createUserProfile(
            userData.$id,
            data.name
         );
         if (!profileData)
            throw new Error("Error creating user profile. Please try again.");

         const session = await authService.login({
            email: data.email,
            password: data.password,
         });
         if (!session) throw new Error("Error logging in. Please try again.");

         const currentUserData = await authService.getCurrentUser();
         if (!currentUserData)
            throw new Error("Error getting user data. Please try again.");

         return {
            ...currentUserData,
            profilePicture: profileData.profilePicture,
            bio: profileData.bio,
         };
      },
      onError: (error) => {
         console.error("Signup error:", error);
      },
      onSuccess: (userData) => {
         dispatch(login(userData));
         navigate("/");
      },
   });

   const onSubmit = (data) => {
      signupMutation.mutate(data);
   };

   return (
      <Container className="flex flex-col items-center justify-center bg-white dark:bg-background-darkBlack dark:text-text-dark p-4 max-w-lg m-auto rounded-xl shadow-md space-y-3">
         <h2 className="text-center text-lg font-bold leading-tight">
            Sign up to create an account
         </h2>
         <p className="text-base text-center font-medium">
            Already have an account?&nbsp;
            <Link
               to="/login"
               className="font-medium text-primary transition-all duration-200 hover:underline text-blue-600"
            >
               Login
            </Link>
         </p>

         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:w-96 w-72">
            <div>
               <Input
                  className="text-sm md:text-base font-normal"
                  label="Full Name:"
                  placeholder="Enter your full name"
                  {...register("name", {
                     required: "Full Name is required",
                     minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters long",
                     },
                  })}
               />
               <ErrorMessage error={errors.name?.message} />
            </div>

            <div>
               <Input
                  className="text-sm md:text-base font-normal"
                  label="Email: "
                  placeholder="Enter your email"
                  type="email"
                  {...register("email", {
                     required: "Email is required",
                     pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Invalid email address",
                     },
                  })}
               />
               <ErrorMessage error={errors.email?.message} />
            </div>

            <div>
               <Input
                  className="text-sm md:text-base font-normal"
                  label="Password:"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", {
                     required: "Password is required",
                     minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters long",
                     },
                  })}
               />
               <ErrorMessage error={errors.password?.message} />
            </div>
            {signupMutation.isPending ? (
               <div className="flex justify-center">
                  <LoaderMini />
               </div>
            ) : (
               <Button
                  type="submit"
                  className="w-full"
                  bgNumber={1}
                  disabled={signupMutation.isPending}
                  text={"Sign Up"}
               />
            )}
         </form>

         {signupMutation.isError && (
            <ErrorMessage error="Signup failed. Please check your information and try again." />
         )}
      </Container>
   );
}

export default Signup;
