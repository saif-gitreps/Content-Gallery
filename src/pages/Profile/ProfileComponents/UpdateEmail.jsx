import { useSelector } from "react-redux";
import { useState, useRef, useContext } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Input, SaveAndCancelDiv, LoaderMini } from "../../../components";
import authService from "../../../appwrite/auth";
import { ErrorContext } from "../../../context/ErrorContext";
import Pencil from "./Pencil";

function UpdateEmail() {
   const [editEmail, setEditEmail] = useState(false);
   const userData = useSelector((state) => state.auth.userData);
   const [loading, setLoading] = useState(false);
   const { setError } = useContext(ErrorContext);

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors: emailErrors },
   } = useForm({
      defaultValues: {
         email: userData?.email || "",
         password: "",
      },
   });

   if (emailErrors.email) {
      setError(emailErrors.email.message);
   }

   const emailVerificationMessage = useRef(null);

   const updateEmailMutation = useMutation({
      mutationFn: async (data) =>
         await authService.updateEmail(data.email, data.password),
      onError: () => {
         setError("Failed to update email. Try again later.");
         setLoading(false);
      },
      onSuccess: () => {
         setEditEmail(false);
         setLoading(false);
         reset({ password: "" });
      },
   });

   const updateEmail = (data) => {
      setError("");
      setLoading(true);
      updateEmailMutation.mutate(data);
   };

   const verifyEmailMutation = useMutation({
      mutationFn: async () => await authService.createEmailVerification(),
      onError: () => {
         emailVerificationMessage.current.textContent =
            "Failed to send email verification. Try again later.";
      },
      onSuccess: () => {
         emailVerificationMessage.current.classList.remove("hidden");
      },
   });

   const verifyEmail = async () => {
      setError("");
      verifyEmailMutation.mutate();
   };

   return (
      <form
         onSubmit={handleSubmit(updateEmail)}
         className={`p-4 dark:bg-gray-800 rounded-lg `}
      >
         <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium flex items-center">
               Email:{" "}
               {!userData?.emailVerification && (
                  <Link
                     onClick={verifyEmail}
                     className="ml-2 text-green-600 hover:underline"
                  >
                     Verify
                  </Link>
               )}
            </h2>
            {!editEmail && (
               <Pencil
                  onClickAction={() => {
                     setEditEmail(true);
                     emailVerificationMessage.current.classList.add("hidden");
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer"
               />
            )}
         </div>

         <Input
            className={`text-base font-normal w-full ${
               editEmail ? "bg-white dark:bg-gray-700" : "bg-transparent"
            } border rounded-md p-2 focus:ring-2 focus:ring-blue-500`}
            readOnly={!editEmail}
            {...register("email", {
               required: true,
               validate: {
                  matchPattern: (value) =>
                     /^\w+([.-]?\w+)*@\w+([.-]?\w{2,3})+$/.test(value) ||
                     "Email address must be a valid address",
               },
            })}
         />

         <h2
            className="text-base text-center text-red-600 font-medium hidden"
            ref={emailVerificationMessage}
         >
            Check your email for verification.
         </h2>

         {editEmail && (
            <div className="space-y-4">
               <div>
                  <h2 className="text-lg font-medium">Password:</h2>
                  <Input
                     className="text-base font-normal w-full bg-white dark:bg-gray-700 border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                     type="password"
                     {...register("password", { required: true })}
                  />
               </div>
               {loading ? (
                  <div className="flex justify-center items-center">
                     <LoaderMini />
                  </div>
               ) : (
                  <div className="flex justify-end space-x-4">
                     <SaveAndCancelDiv
                        cancel={() => {
                           setEditEmail(false);
                           setError("");
                        }}
                        className="flex justify-end space-x-2"
                     />
                  </div>
               )}
            </div>
         )}
      </form>
   );
}

export default UpdateEmail;
