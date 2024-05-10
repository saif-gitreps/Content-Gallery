import { Input, Pencil, SaveAndCancelDiv } from "../index";
import { useState } from "react";
import authService from "../../appwrite/auth";
import { useForm } from "react-hook-form";

function UpdatePassword({ setErrorMessage }) {
   const [editPassword, setEditPassword] = useState(false);

   const { register: registerPassword, handleSubmit: handleSubmitPassword } = useForm({
      defaultValues: {
         oldPassword: "",
         newPassword: "",
      },
   });

   const onPasswordUpdate = async (data) => {
      try {
         setErrorMessage(false);
         const result = await authService.updatePassword(
            data.OldPassword,
            data.newPassword
         );

         if (result) {
            setEditPassword(false);
         } else {
            setErrorMessage(true);
         }
      } catch (error) {
         console.log("Password Update Error", error);
      }
   };
   return (
      <form
         onSubmit={handleSubmitPassword(onPasswordUpdate)}
         className={`p-2 my-1 ${editPassword && "shadow-lg rounded-lg"}`}
      >
         <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold ml-2">
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
            className="text-xl font-normal"
            readOnly={!editPassword}
            value={editPassword ? "" : "********"}
            {...registerPassword("OldPassword", { required: true })}
         />
         {editPassword && (
            <div>
               <h2 className="text-lg font-semibold ml-2">Password:</h2>
               <Input
                  className="text-xl font-normal"
                  type="password"
                  value=""
                  {...registerPassword("newPassword", { required: true })}
               />
               <SaveAndCancelDiv
                  cancel={() => {
                     setEditPassword(false);
                     setEditPassword(false);
                  }}
               />
            </div>
         )}
      </form>
   );
}

export default UpdatePassword;
