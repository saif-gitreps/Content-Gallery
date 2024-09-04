import { Button, Input, Container, LoaderMini, ErrorMessage } from "../../components";
import authService from "../../appwrite/auth";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

function PasswordRecoveryStepOne() {
   const { register, handleSubmit } = useForm();

   const createRecoveryMutation = useMutation({
      mutationFn: async (email) => await authService.createPasswordRecovery(email),
   });

   const createRecovery = (data) => {
      createRecoveryMutation.mutate(data.email);
   };

   return (
      <Container className="flex flex-col items-center justify-center bg-white dark:bg-background-darkBlack dark:text-text-dark p-4 max-w-lg m-auto rounded-xl shadow-md space-y-3">
         <form onSubmit={handleSubmit(createRecovery)} className="space-y-4">
            <Input
               className="text-sm md:text-base font-normal w-64"
               type="email"
               label="Enter your account email:"
               {...register("email", {
                  required: true,
               })}
            />
            {createRecoveryMutation?.isPending ? (
               <div className="flex justify-center items-center mt-2">
                  <LoaderMini />
               </div>
            ) : (
               <Button type="submit" className="w-full" bgNumber={1} text="Next" />
            )}
         </form>
         <Link
            to="/login"
            className="text-sm font-semibold transition-all duration-300 hover:underline text-blue-700 hover:text-blue-900"
         >
            Back
         </Link>
         {createRecoveryMutation?.isSuccess && (
            <h2 className="text-base text-red-700 font-medium mt-2">
               Please check your email and click the link.
            </h2>
         )}
         {createRecoveryMutation?.isError && (
            <ErrorMessage error="Something went wrong. Please try again." />
         )}
      </Container>
   );
}

export default PasswordRecoveryStepOne;
