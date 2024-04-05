import { useState } from "react";
import authService from "../appwrite/auth";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Logo } from "./index";
import { login } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

function Signup() {
   const navigate = useNavigate();
   const [error, setError] = useState("");
   const dispatch = useDispatch();
   const { register, handleSubmit } = useForm();

   const signup = async (data) => {
      setError("");

      try {
         const userData = await authService.createAccount(data);
         if (userData) {
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
               dispatch(login(currentUser));
               navigate("/");
            }
         }
      } catch (error) {
         setError(error);
      }
   };

   return (
      <div className="flex items-center justify-center">
         <div
            className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
         >
            <div className="mb-2 flex justify-center">
               <span className="inline-block w-full max-w-[100px]">
                  <Logo width="100%" />
               </span>
            </div>
            <h2 className="text-center text-2xl font-bold leading-tight">
               Sign up to create account
            </h2>
            <p className="mt-2 text-center text-base text-black/60">
               Already have an account?&nbsp;
               <Link
                  to="/login"
                  className="font-medium text-primary transition-all duration-200 hover:underline"
               >
                  Sign In
               </Link>
            </p>
            {error ? <p className="text-red-800 mt-8"> {error} </p> : null}

            <form onSubmit={handleSubmit(signup)}>
               <div className="space-y-5">
                  <Input
                     label="Full name:"
                     placeholder="Enter your full name"
                     {...register("name", {
                        require: true,
                     })}
                  />
                  <Input
                     label="Email: "
                     placeholder="Enter your email"
                     type="email"
                     {...register("email", {
                        required: true,
                        validate: {
                           matchPattern: (value) =>
                              /^([\w.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/.test(value) ||
                              "Please enter a valid email",
                        },
                     })}
                  />
                  <Input
                     label="Password: "
                     placeholder="Enter your password"
                     type="password"
                     {...register("password", { required: true })}
                  />
                  <Button type="submit" className="w-full">
                     Sign up
                  </Button>
               </div>
            </form>
         </div>
      </div>
   );
}

export default Signup;
