import { Button, Input, Container } from "../components";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import { Link } from "react-router-dom";

function PasswordRecoveryStepOne() {
   const { register, handleSubmit } = useForm();
   const passwordRecoveryVerificationMessage = useRef(null);

   const createRecovery = async (data) => {
      try {
         const response = await authService.createPasswordRecovery(data.email);
         if (response) {
            passwordRecoveryVerificationMessage.current.classList.remove("hidden");
         } else {
            passwordRecoveryVerificationMessage.current.textContent =
               "Something went wrong. Please try again.";
         }
      } catch (error) {
         console.log("Appwrite service :: create password recovery :: error", error);
      }
   };
   return (
      <div className="p-8">
         <Container className="flex flex-col items-center justify-center bg-white p-4 max-w-lg m-auto rounded-xl shadow-md space-y-3">
            <h2 className="text-center text-base font-bold leading-tight">
               Enter your account email to recover your password:
            </h2>

            <form onSubmit={handleSubmit(createRecovery)} className="space-y-4">
               <Input
                  className="text-sm md:text-base font-normal w-64"
                  type="email"
                  {...register("email", {
                     required: true,
                  })}
               />
               <Button type="submit" text="Next" className="w-full" bgNumber={1} />
            </form>
            <Link
               to="/login"
               className="text-sm font-semibold transition-all duration-300 hover:underline text-blue-700 hover:text-blue-900"
            >
               Back
            </Link>
            <h2
               className="text-base text-red-700 font-medium mt-2 hidden "
               ref={passwordRecoveryVerificationMessage}
            >
               Please check your email and click the link.
            </h2>
         </Container>
      </div>
   );
}

export default PasswordRecoveryStepOne;
