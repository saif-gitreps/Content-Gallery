import authService from "../appwrite/auth";
import { Container } from "../components";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

function EmailConfirmation() {
   const url = new URL(window.location.href);
   const userId = url.searchParams.get("userId");
   const secret = url.searchParams.get("secret");
   const navigate = useNavigate();

   const confirmEmailMutation = useMutation({
      mutationFn: async ({ userId, secret }) =>
         await authService.confirmEmailVerification(userId, secret),
      onSuccess: () => {
         toast.success(
            "Email confirmed successfully, you will be redirected to the home page"
         );
         setTimeout(() => {
            navigate("/");
         }, 2000);
      },
      onError: () =>
         toast.error("Something went wrong while confirming email, Please try again", {
            autoClose: 5000,
         }),
   });

   const handleConfirm = () => {
      confirmEmailMutation.mutate({ userId, secret });
   };

   return (
      <Container>
         <div className="flex flex-col items-center justify-center bg-white dark:bg-background-darkBlack dark:text-text-dark max-w-xl m-auto rounded-xl shadow-md h-40 ">
            <h1
               className="text-base xl:text-2xl text-red-700 font-medium duration-300 hover:text-red-500 hover:cursor-pointer"
               onClick={handleConfirm}
            >
               Please Click here to confirm your email.
            </h1>
         </div>
      </Container>
   );
}

export default EmailConfirmation;
