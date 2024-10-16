import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input, SaveAndCancelDiv, LoaderMini, ErrorMessage } from "..";
import authService from "../../appwrite/auth";
import { useMutation } from "@tanstack/react-query";
import Pencil from "./Pencil";
import { toast } from "react-toastify";

function UpdatePassword() {
   const [editPassword, setEditPassword] = useState(false);

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm({
      defaultValues: {
         oldPassword: "",
         newPassword: "",
      },
   });

   const updatePasswordMutation = useMutation({
      mutationFn: async (data) => {
         console.log(data);
         return await authService.updatePassword(data.newPassword, data.oldPassword);
      },
      onError: (error) => {
         // Log the full error to see its structure
         console.error("Error in mutation:", error);

         // Check for a meaningful message or provide a fallback
         const errorMessage =
            error.response?.data?.message || error.message || "An error occurred";

         // Show the error message
         toast.error(errorMessage);
      },
      onSuccess: () => {
         toast.success("password updated successfully");
         setEditPassword(false);
         reset({ oldPassword: "", newPassword: "" });
      },
   });

   const updatePassword = (data) => {
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

         {updatePasswordMutation.isError && <h1>error</h1>}
      </form>
   );
}

export default UpdatePassword;
