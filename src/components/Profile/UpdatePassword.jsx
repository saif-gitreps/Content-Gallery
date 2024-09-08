import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input, SaveAndCancelDiv, LoaderMini, ErrorMessage } from "..";
import authService from "../../appwrite/auth";
import { useMutation } from "@tanstack/react-query";
import Pencil from "./Pencil";

function UpdatePassword() {
   const [editPassword, setEditPassword] = useState(false);

   const {
      register,
      handleSubmit,
      reset,
      setError,
      formState: { errors },
   } = useForm({
      defaultValues: {
         oldPassword: "",
         newPassword: "",
      },
   });

   const updatePasswordMutation = useMutation({
      mutationFn: async (data) =>
         await authService.updatePassword(data.oldPassword, data.newPassword),
      onSuccess: () => {
         setEditPassword(false);
         reset({ oldPassword: "", newPassword: "" });
      },
      onError: (error) => {
         setError("oldPassword", {
            type: "manual",
            message: error.message || "Incorrect old password. Please try again.",
         });
      },
   });

   const updatePassword = (data) => {
      setError("");
      updatePasswordMutation.mutate(data);
   };

   return (
      <form
         onSubmit={handleSubmit(updatePassword)}
         className="p-2 dark:bg-gray-800 rounded-lg"
      >
         <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">
               {editPassword ? "Old Password :" : "Password :"}
            </h2>
            {!editPassword && (
               <Pencil
                  onClickAction={() => {
                     setEditPassword(true);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer"
               />
            )}
         </div>

         <Input
            type="password"
            readOnly={!editPassword}
            {...register("oldPassword", { required: "Old password is required." })}
         />
         {errors.oldPassword && <ErrorMessage error={errors.oldPassword.message} />}

         {editPassword && (
            <div className="">
               <h2 className="text-lg font-medium">New Password:</h2>
               <Input
                  type="password"
                  {...register("newPassword", { required: "New password is required." })}
               />
               {errors.newPassword && <ErrorMessage error={errors.newPassword.message} />}

               {updatePasswordMutation?.isPending ? (
                  <div className="flex justify-center items-center mt-2">
                     <LoaderMini />
                  </div>
               ) : (
                  <SaveAndCancelDiv
                     cancel={() => {
                        setEditPassword(false);
                        reset({ oldPassword: "", newPassword: "" });
                     }}
                  />
               )}
            </div>
         )}

         {updatePasswordMutation?.isError && (
            <ErrorMessage error="Error updating password, please try again." />
         )}
      </form>
   );
}

export default UpdatePassword;
