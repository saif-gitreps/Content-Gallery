import { useSelector } from "react-redux";
import { useState, useRef } from "react";
import authService from "../../appwrite/auth";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ErrorMessage, Input, Pencil, SaveAndCancelDiv, LoaderMini } from "../index";

function UpdateEmail() {
   const [editEmail, setEditEmail] = useState(false);
   const userData = useSelector((state) => state.auth.userData);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   const { register, handleSubmit, reset } = useForm({
      defaultValues: {
         email: userData?.email || "",
         password: "",
      },
   });

   const emailVerificationMessage = useRef(null);

   const onEmailUpdate = async (data) => {
      setError(false);
      setLoading(true);
      try {
         const result = await authService.updateEmail(data.email, data.password);
         if (!result) {
            throw new Error();
         }

         setEditEmail(false);
      } catch (error) {
         console.log("Email Update Error", error);
      } finally {
         setLoading(false);
         reset({ password: "" });
      }
   };

   const verifyEmail = async () => {
      setError("");
      try {
         if (userData.email) {
            const result = await authService.createEmailVerification();
            if (!result) {
               throw new Error();
            }

            emailVerificationMessage.current.classList.remove("hidden");
         }
      } catch (error) {
         emailVerificationMessage.current.textContent =
            "Email verification error, please try again.";
      }
   };

   return (
      <form
         onSubmit={handleSubmit(onEmailUpdate)}
         className={`p-1 ${editEmail && "shadow-lg rounded-lg"}`}
      >
         <div className="flex items-center justify-between">
            <h2 className="text-sm md:text-base font-semibold ml-2">
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
                  }}
               />
            )}
         </div>
         <Input
            className="text-sm md:text-base font-normal w-64"
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
            className="text-base text-red-600 font-medium hidden"
            ref={emailVerificationMessage}
         >
            Check your email for Email verification
         </h2>
         {editEmail && (
            <div>
               <h2 className="text-sm md:text-base font-semibold ml-2">Password:</h2>
               <Input
                  className="text-sm md:text-base font-normal w-64"
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
         <ErrorMessage error={error} />
      </form>
   );
}

export default UpdateEmail;
