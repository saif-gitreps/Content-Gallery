import { useSelector } from "react-redux";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Input, SaveAndCancelDiv, LoaderMini, ErrorMessage } from "..";
import authService from "../../appwrite/auth";
import Pencil from "./Pencil";
import { toast } from "react-toastify";

function UpdateEmail() {
   const [editEmail, setEditEmail] = useState(false);
   const userData = useSelector((state) => state.auth.userData);

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm({
      defaultValues: {
         email: userData?.email || "",
         password: "",
      },
   });

   const updateEmailMutation = useMutation({
      mutationFn: async (data) =>
         await authService.updateEmail(data.email, data.password),
      onError: (error) => toast.error("Something went wrong while updating email"),
      onSuccess: () => {
         toast.success("Email updated successfully");
         setEditEmail(false);
         reset({ password: "" });
      },
   });

   const updateEmail = (data) => {
      updateEmailMutation.mutate(data);
   };

   const verifyEmailMutation = useMutation({
      mutationFn: async () => await authService.createEmailVerification(),
      onError: () => toast.error("Something went wrong while sending email verification"),
      onSuccess: () =>
         toast.success("Email verfication link sent to your email successfully"),
   });

   const verifyEmail = async () => {
      verifyEmailMutation.mutate();
   };

   return (
      <form
         onSubmit={handleSubmit(updateEmail)}
         className="p-2 dark:bg-gray-800 rounded-lg"
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
                  onClickAction={() => setEditEmail(true)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer"
               />
            )}
         </div>

         <Input
            readOnly={!editEmail}
            {...register("email", {
               required: "Email is required.",
               validate: {
                  matchPattern: (value) =>
                     /^\w+([.-]?\w+)*@\w+([.-]?\w{2,3})+$/.test(value) ||
                     "Email address must be a valid address",
               },
            })}
         />
         {errors.email && <ErrorMessage error={errors.email.message} />}

         {editEmail && (
            <div>
               <div>
                  <h2 className="text-lg font-medium">Password:</h2>
                  <Input
                     type="password"
                     {...register("password", { required: "Password is required." })}
                  />
                  {errors.password && <ErrorMessage error={errors.password.message} />}
               </div>
               {updateEmailMutation?.isPending ? (
                  <div className="flex justify-center items-center mt-2">
                     <LoaderMini />
                  </div>
               ) : (
                  <SaveAndCancelDiv
                     cancel={() => {
                        setEditEmail(false);
                        reset({ password: "" });
                     }}
                     className="flex justify-end space-x-2"
                  />
               )}
            </div>
         )}
      </form>
   );
}

export default UpdateEmail;
