import { Button, Input } from "../components";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";
import { useRef } from "react";

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
         <div
            className={`flex flex-col items-center justify-center bg-white p-5 max-w-xl m-auto rounded-xl shadow-md`}
         >
            <h2 className="text-center text-xl font-bold leading-tight">
               Enter your account email to recover your password:
            </h2>

            <form onSubmit={handleSubmit(createRecovery)} className="mt-6">
               <div className="space-y-4">
                  <Input
                     className="text-xl font-normal"
                     type="email"
                     {...register("email", {
                        required: true,
                     })}
                  />
                  <Button type="submit" className="w-full">
                     Next
                  </Button>
               </div>
               <h2
                  className="text-lg text-red-700 font-medium mt-2 hidden"
                  ref={passwordRecoveryVerificationMessage}
               >
                  Please check your email and click the link.
               </h2>
            </form>
         </div>
      </div>
   );
}

export default PasswordRecoveryStepOne;
