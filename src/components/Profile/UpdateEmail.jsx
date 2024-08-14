import { useSelector } from "react-redux";
import { useState, useRef, useContext } from "react";
import authService from "../../appwrite/auth";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ErrorContext } from "../../context/ErrorContext";
import { Input, Pencil, SaveAndCancelDiv, LoaderMini } from "../index";

function UpdateEmail() {
   const [editEmail, setEditEmail] = useState(false);
   const userData = useSelector((state) => state.auth.userData);
   const [loading, setLoading] = useState(false);
   const { setError } = useContext(ErrorContext);

   const { register, handleSubmit, reset } = useForm({
      defaultValues: {
         email: userData?.email || "",
         password: "",
      },
   });

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
         className={`p-2 ${editEmail && "shadow-lg rounded-lg"}`}
      >
         <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold ml-2">
               Email :{" "}
               {!userData?.emailVerification && (
                  <Link onClick={verifyEmail} className="text-green-600 hover:underline">
                     Verify
                  </Link>
               )}{" "}
            </h2>
            {!editEmail && (
               <Pencil
                  onClickAction={() => {
                     setEditEmail(true);
                     emailVerificationMessage.current.classList.add("hidden");
                  }}
               />
            )}
         </div>
         <Input
            className="text-base font-normal w-64"
            readOnly={!editEmail}
            {...register("email", {
               required: true,
               validate: {
                  matchPatern: (value) =>
                     /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                     "Email address must be a valid address",
               },
            })}
         />
         <h2
            className="text-base text-center hidden text-red-600 font-medium w-48"
            ref={emailVerificationMessage}
         >
            Check your email for Email verification.
         </h2>
         {editEmail && (
            <div>
               <h2 className="text-base font-semibold ml-2">Password:</h2>
               <Input
                  className="text-base font-normal w-64"
                  type="password"
                  {...register("password", { required: true })}
               />
               {loading ? (
                  <div className="flex justify-center items-center mt-2">
                     <LoaderMini />
                  </div>
               ) : (
                  <SaveAndCancelDiv
                     cancel={() => {
                        setEditEmail(false);
                        setError("");
                     }}
                  />
               )}
            </div>
         )}
      </form>
   );
}

export default UpdateEmail;
