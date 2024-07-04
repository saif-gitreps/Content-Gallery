import { useState } from "react";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { Button, Input, LoaderMini, Container, ErrorMessage } from "./index";

function Login() {
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();
   const [error, setError] = useState("");

   const login = async (data) => {
      setError("");
      setLoading(true);
      try {
         const session = await authService.login(data);
         if (!session) {
            setError("Error logging in. Please try again.");
            return;
         }

         const userData = await authService.getCurrentUser();
         if (!userData) {
            setError("Error fetching user data. Please try again.");
            return;
         }

         dispatch(authLogin(userData));
         navigate("/");
      } catch (error) {
         setError("Something went wrong. Please try again later.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <Container className="flex flex-col items-center justify-center bg-white dark:bg-background-darkBlack dark:text-text-dark p-4 max-w-lg m-auto rounded-xl shadow-md space-y-3">
         <h2 className="text-center text-lg font-bold leading-tight">
            Login to your account
         </h2>
         <p className="text-base text-center font-medium ">
            Don&apos;t have any account?&nbsp;
            <Link
               to="/signup"
               className="font-medium transition-all duration-300 hover:underline  text-blue-600 hover:text-blue-800"
            >
               Sign Up
            </Link>
         </p>

         <form onSubmit={handleSubmit(login)} className="space-y-4">
            <div>
               <Input
                  className="text-sm md:text-base font-normal"
                  label="Email: "
                  placeholder="Enter your email"
                  type="email"
                  {...register("email", {
                     required: "Email is required",
                     validate: {
                        matchPatern: (value) =>
                           /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                           "Email address must be a valid address",
                     },
                  })}
               />
               <ErrorMessage error={errors.email?.message} />
            </div>

            <div>
               <Input
                  className="text-sm md:text-base font-normal"
                  label="Password: "
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", {
                     required: "Password is required",
                  })}
               />
               <ErrorMessage error={errors.password?.message} />
            </div>

            {loading ? (
               <div className="flex justify-center items-center">
                  <LoaderMini />
               </div>
            ) : (
               <Button type="submit" className="w-full " bgNumber={1} text="Login">
                  Sign in
               </Button>
            )}
         </form>
         <p className="text-sm font-medium text-center">
            Forgot password?&nbsp;
            <Link
               to="/password-recovery-step-one"
               className="font-semibold transition-all duration-300 hover:underline text-blue-700 hover:text-blue-900"
            >
               Click here to recover.
            </Link>
         </p>
         <ErrorMessage error={error} />
      </Container>
   );
}

export default Login;
