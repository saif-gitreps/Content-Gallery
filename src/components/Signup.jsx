import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import authService from "../appwrite/auth";
import { login } from "../store/authSlice";
import { Button, Input, LoaderMini, Container, ErrorMessage } from "./index";

function Signup() {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();

   const create = async (data) => {
      setError("");
      setLoading(true);
      try {
         const userData = await authService.createAccount(data);
         if (!userData) {
            setError("Error signing up. Please try again.");
            return;
         }

         const session = await authService.login({
            email: data.email,
            password: data.password,
         });
         if (!session) {
            setError("Error logging in. Please try again.");
            return;
         }

         const currentUserData = await authService.getCurrentUser();
         if (!currentUserData) {
            setError("Error fetching user data. Please try again.");
            return;
         }

         await authService.updateProfilePicture("/blank-dp.png", "");
         currentUserData.prefs.profilePicture = "/blank-dp.png";
         currentUserData.prefs.profilePictureId = "";

         dispatch(login(currentUserData));
         navigate("/");
      } catch (error) {
         setError("Something went wrong. Please try again.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <Container className="flex flex-col items-center justify-center bg-white p-4 max-w-lg m-auto rounded-xl shadow-md space-y-3">
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

         <form onSubmit={handleSubmit(create)} className="space-y-4">
            <div className="space-y-4">
               <div>
                  <Input
                     className="text-sm md:text-base font-normal"
                     label="Full Name:"
                     placeholder="Enter your full name"
                     {...register("name", { required: "Full Name is required" })}
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
                     label="Password:"
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
                  <Button type="submit" className="w-full" text="Sign up" bgNumber={1}>
                     Create Account
                  </Button>
               )}
            </div>
         </form>
         <ErrorMessage error={error} />
      </Container>
   );
}

export default Signup;
