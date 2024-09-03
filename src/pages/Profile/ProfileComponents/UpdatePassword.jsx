import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { Input, SaveAndCancelDiv, LoaderMini } from "../../../components";
import authService from "../../../appwrite/auth";
import { ErrorContext } from "../../../context/ErrorContext";
import Pencil from "./Pencil";

function UpdatePassword() {
   const [editPassword, setEditPassword] = useState(false);
   const [loading, setLoading] = useState(false);
   const { setError } = useContext(ErrorContext);

   const { register, handleSubmit, reset } = useForm({
      defaultValues: {
         oldPassword: "",
         newPassword: "",
      },
   });

   const onPasswordUpdate = async (data) => {
      setError("");
      setLoading(true);
      try {
         const result = await authService.updatePassword(
            data.oldPassword,
            data.newPassword
         );

         if (!result) {
            throw new Error();
         }
         setEditPassword(false);
      } catch (error) {
         setError("Password update error.");
      } finally {
         setLoading(false);
         reset({ oldPassword: "", newPassword: "" });
      }
   };
   return (
      <form
         onSubmit={handleSubmit(onPasswordUpdate)}
         className="p-4 dark:bg-gray-800 rounded-lg"
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
            className={`text-base font-normal w-full ${
               editPassword ? "bg-white dark:bg-gray-700" : "bg-transparent"
            } border rounded-md p-2 focus:ring-2 focus:ring-blue-500`}
            type="password"
            readOnly={!editPassword}
            {...register("oldPassword", { required: true })}
         />

         {editPassword && (
            <div className="">
               <h2 className="text-lg font-medium">New Password:</h2>
               <Input
                  className="text-base font-normal w-full bg-white dark:bg-gray-700 border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  type="password"
                  {...register("newPassword", { required: true })}
               />
               {loading ? (
                  <div className="flex justify-center items-center mt-2">
                     <LoaderMini />
                  </div>
               ) : (
                  <div className="flex justify-end space-x-4">
                     <SaveAndCancelDiv
                        cancel={() => {
                           setEditPassword(false);
                           setError("");
                           reset({ oldPassword: "", newPassword: "" });
                        }}
                     />
                  </div>
               )}
            </div>
         )}
      </form>
   );
}

export default UpdatePassword;
