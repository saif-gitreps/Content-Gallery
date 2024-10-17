import { useSearchParams } from "react-router-dom";
import { Button, Input, Container, LoaderMini, ErrorMessage } from "../../components";
import authService from "../../appwrite/auth";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

function PasswordRecoveryStepTwo() {
   const [searchParams] = useSearchParams();
   const userId = searchParams.get("userId");
   const secret = searchParams.get("secret");
   const { register, handleSubmit } = useForm();

   const confirmPasswordRecoveryMutation = useMutation({
      mutationFn: async (data) =>
         await authService.confirmPasswordRecovery(
            userId,
            secret,
            data.password,
            data.confirmPassword
         ),
      onError: () =>
         toast.error(
            "Something went wrong while confirming password recovery, please try again"
         ),
   });

   const confirmRecovery = (data) => {
      confirmPasswordRecoveryMutation.mutate(data);
   };

   return (
      <Container className="flex flex-col items-center justify-center bg-white dark:bg-background-darkBlack dark:text-text-dark p-4 max-w-lg m-auto rounded-xl shadow-md space-y-3">
         {!confirmPasswordRecoveryMutation?.isSuccess && (
            <form onSubmit={handleSubmit(confirmRecovery)} className="space-y-4">
               <Input
                  className="text-sm md:text-base font-normal"
                  type="password"
                  label="New Password:"
                  {...register("password", {
                     required: true,
                  })}
               />
               <Input
                  className="text-sm md:text-base font-normal"
                  type="password"
                  label="Confirm new password:"
                  {...register("confirmPassword", {
                     required: true,
                  })}
               />
               {confirmPasswordRecoveryMutation?.isPending ? (
                  <div className="flex justify-center items-center mt-2">
                     <LoaderMini />
                  </div>
               ) : (
                  <Button type="submit" className="w-full" bgNumber={1} text="Confirm" />
               )}
            </form>
         )}

         {confirmPasswordRecoveryMutation?.isSuccess && (
            <div className="flex">
               <h2 className="text-base font-medium mt-2">
                  Your password has been recoverd
               </h2>
               <Link to="/login">
                  <Button
                     type="button"
                     className="bg-blue-700 hover:bg-blue-900"
                     text="Login"
                     bgNumber={1}
                  />
               </Link>
            </div>
         )}
      </Container>
   );
}

export default PasswordRecoveryStepTwo;
