import authService from "../appwrite/auth";
import { Container, ErrorMessage } from "../components";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function EmailConfirmation() {
   const [error, setError] = useState("");
   const url = new URL(window.location.href);
   const userId = url.searchParams.get("userId");
   const secret = url.searchParams.get("secret");
   const navigate = useNavigate();
   const handleConfirm = async () => {
      try {
         const confirm = await authService.confirmEmailVerification(userId, secret);
         if (confirm) {
            alert(
               "Email confirmed successfully, you will be redirected to the home page."
            );
            setTimeout(() => {
               navigate("/");
            }, 5000);
         }
      } catch (error) {
         setError("Error confirming email. Please try again.");
      }
   };
   return (
      <div className="py-8">
         <Container>
            <div className="flex flex-col items-center justify-center bg-white max-w-xl m-auto rounded-xl shadow-md h-40 ">
               <h1
                  className="text-base xl:text-2xl text-red-700 font-medium duration-200 hover:underline hover:cursor-pointer"
                  onClick={handleConfirm}
               >
                  Please Click here to confirm your email.
               </h1>

               <ErrorMessage error={error} />
            </div>
         </Container>
      </div>
   );
}

export default EmailConfirmation;
