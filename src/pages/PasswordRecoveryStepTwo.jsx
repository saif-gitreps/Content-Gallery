import authService from "../appwrite/auth";
import { useRef } from "react";
import { Button, Input } from "../components";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

function PasswordRecoveryStepTwo() {
   const url = new URL(window.location.href);
   const userId = url.searchParams.get("userId");
   const secret = url.searchParams.get("secret");

   const { register, handleSubmit } = useForm();
   const passwordRecoveryVerificationMessage = useRef(null);

   const confirmRecovery = async (data) => {
      try {
         const response = await authService.confirmPasswordRecovery(
            userId,
            secret,
            data.password
         );
         if (response) {
            passwordRecoveryVerificationMessage.current.classList.remove("hidden");
         } else {
            passwordRecoveryVerificationMessage.current.classList.add("text-red-700");
            passwordRecoveryVerificationMessage.current.textContent =
               "Something went wrong. Please click back and enter email again.";
         }
      } catch (error) {
         console.log("Appwrite service :: confirm password recovery :: error", error);
      }
   };
   return (
      <div className="p-8">
         <div
            className={`flex flex-col items-center justify-center bg-white p-5 max-w-xl m-auto rounded-xl shadow-md`}
         >
            <h2 className="text-center text-xl font-bold leading-tight">
               Enter your new password:
            </h2>

            <form onSubmit={handleSubmit(confirmRecovery)} className="mt-6 space-y-2">
               <Input
                  className="text-xl font-normal"
                  type="password"
                  label="Password:"
                  {...register("password", {
                     required: true,
                  })}
               />
               <Input
                  className="text-xl font-normal"
                  type="password"
                  label="Confirm password:"
                  {...register("password", {
                     required: true,
                  })}
               />
               <Button type="submit" className="w-full" bgNumber={1} text="Confirm" />
            </form>
            <Link
               to="/password-recovery-step-one"
               className="font-semibold mt-2 text-lg hover:underline text-blue-600"
            >
               Back
            </Link>
            <h2
               className="text-lg font-medium mt-2 hidden"
               ref={passwordRecoveryVerificationMessage}
            >
               Your password has been recoverd.{" "}
               <Link className="hover:underline text-gray-500" to="/login">
                  <Button
                     type="button"
                     className="bg-blue-700 hover:bg-blue-900"
                     text="Login"
                  />
               </Link>
            </h2>
         </div>
      </div>
   );
}

export default PasswordRecoveryStepTwo;
