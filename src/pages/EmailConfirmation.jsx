import { Container } from "../components";
import authService from "../appwrite/auth";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

function EmailConfirmation() {
   const url = new URL(window.location.href);
   const userId = url.searchParams.get("userId");
   const secret = url.searchParams.get("secret");
   const navigate = useNavigate();
   const handleConfirm = async () => {
      try {
         const confirm = await authService.confirmEmailVerification(userId, secret);
         if (confirm) {
            confirmRef.current.classList.remove("hidden");
         }
      } catch (error) {
         confirmRef.current.classList.remove("hidden");
         confirmRef.current.classList.add("text-red-700");
         confirmRef.current.textContent = "Email confirmation failed, Please try again.";
      }
   };
   const confirmRef = useRef();
   return (
      <div className="py-8">
         <Container>
            <div className="flex flex-col items-center justify-center bg-white max-w-xl m-auto rounded-xl shadow-md h-40 ">
               <h1
                  className="text-2xl text-red-700 font-semibold hover:underline hover:cursor-pointer"
                  onClick={handleConfirm}
               >
                  Please Click here to confirm your email.
               </h1>
               <h1
                  className="text-xl text-center text-green-700 font-semibold hover:underline hover:cursor-pointer"
                  ref={confirmRef}
                  onClick={() => {
                     navigate("/");
                  }}
               >
                  Your email has been confirmed. Click here to continue browsing.
               </h1>
            </div>
         </Container>
      </div>
   );
}

export default EmailConfirmation;
