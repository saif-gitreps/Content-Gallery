import { useState } from "react";
import authService from "../../appwrite/auth";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Input, Pencil, SaveAndCancelDiv, LoaderMini } from "../index";

function UpdatePassword() {
   const [editPassword, setEditPassword] = useState(false);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   const { register, handleSubmit, reset } = useForm({
      defaultValues: {
         oldPassword: "",
         newPassword: "",
      },
   });

   const onPasswordUpdateMutation = useMutation({
      mutationFn: async (data) => {
         const result = await authService.updatePassword(
            data.OldPassword,
            data.newPassword
         );
         if (!result) {
            throw new Error("Error updating password");
         }
         return result;
      },
      onError: (error) => {
         setError(error);
         setLoading(false);
      },
      onSuccess: () => {
         setEditPassword(false);
         setError("");
         setLoading(false);
      },
   });

   const onPasswordUpdate = async (data) => {
      setError("");
      setLoading(true);
      console.log(data);
      onPasswordUpdateMutation.mutate(data);
   };

   return (
      <form
         onSubmit={handleSubmit(onPasswordUpdate)}
         className={`p-2 ${editPassword && "shadow-lg rounded-lg"}`}
      >
         <div className="flex items-center justify-between">
            <h2 className="text-sm md:text-base font-semibold ml-2">
               {editPassword ? "Old Password :" : "Password :"}
            </h2>
            {!editPassword && (
               <Pencil
                  onClickAction={() => {
                     setEditPassword(true);
                  }}
               />
            )}
         </div>
         <Input
            className="text-sm md:text-base font-normal w-64"
            type="password"
            readOnly={!editPassword}
            {...register("OldPassword", { required: true })}
         />
         {editPassword && (
            <div>
               <h2 className="text-sm md:text-base font-semibold ml-2">New Password:</h2>
               <Input
                  className="text-sm md:text-base font-normal w-64"
                  type="password"
                  {...register("newPassword", { required: true })}
               />
               {loading ? (
                  <div className="flex justify-center items-center mt-2">
                     <LoaderMini />
                  </div>
               ) : (
                  <SaveAndCancelDiv
                     cancel={() => {
                        setEditPassword(false);
                        setError("");
                        reset({ OldPassword: "", newPassword: "" });
                     }}
                  />
               )}
            </div>
         )}
         <ErrorMessage error={error} />
      </form>
   );
}

export default UpdatePassword;
