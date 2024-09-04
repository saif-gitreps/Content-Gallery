import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import appwriteUserService from "../../appwrite/config-user";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../../store/authSlice";
import { Button, Input, LoaderMini, Container, ErrorMessage } from "..";
import { useMutation } from "@tanstack/react-query";

function Login() {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();

   const loginMutation = useMutation({
      mutationFn: async (data) => {
         const loginResult = await authService.login(data);
         if (!loginResult) throw new Error("Login failed");

         const userData = await authService.getCurrentUser();
         if (!userData) throw new Error("Failed to get user data");

         const profileData = await appwriteUserService.getUserProfile(userData.$id);
         if (!profileData) throw new Error("Failed to get user profile");

         return {
            ...userData,
            profilePicture: profileData.profilePicture,
            bio: profileData.bio,
         };
      },
      onError: (error) => {
         console.error("Login error:", error);
      },
      onSuccess: (userData) => {
         dispatch(authLogin(userData));
         navigate("/");
      },
   });

   const onSubmit = (data) => {
      loginMutation.mutate(data);
   };

   return (
      <Container className="flex flex-col items-center justify-center bg-white dark:bg-background-darkBlack dark:text-text-dark p-4 max-w-lg m-auto rounded-xl shadow-md space-y-3">
         <h2 className="text-center text-lg font-bold leading-tight">
            Login to your account
         </h2>
         <p className="text-base text-center font-medium">
            Don't have an account?&nbsp;
            <Link
               to="/signup"
               className="font-medium hover:underline text-blue-600 hover:text-blue-800"
            >
               Sign Up
            </Link>
         </p>

         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:w-96 w-72">
            <div>
               <Input
                  className="text-base font-normal"
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
                  className="text-base font-normal"
                  label="Password: "
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", {
                     required: "Password is required",
                     minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                     },
                  })}
               />
               <ErrorMessage error={errors.password?.message} />
            </div>

            {loginMutation.isPending ? (
               <div className="flex justify-center">
                  <LoaderMini />
               </div>
            ) : (
               <Button
                  type="submit"
                  className="w-full"
                  bgNumber={1}
                  disabled={loginMutation.isPending}
                  text="Login"
               />
            )}
         </form>

         <p className="text-base font-medium text-center">
            Forgot password?&nbsp;
            <Link
               to="/password-recovery-step-one"
               className="font-semibold  hover:underline text-blue-700 hover:text-blue-900"
            >
               Click here to recover.
            </Link>
         </p>

         {loginMutation.isError && (
            <ErrorMessage error="Login failed. Please check your credentials and try again." />
         )}
      </Container>
   );
}

export default Login;
