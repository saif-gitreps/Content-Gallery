import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import appwriteUserService from "../../appwrite/config-user";
import { update } from "../../store/authSlice";
import { Input, SaveAndCancelDiv, LoaderMini, ErrorMessage } from "..";
import authService from "../../appwrite/auth";
import Pencil from "./Pencil";

function UpdateName() {
   const [editName, setEditName] = useState(false);
   const userData = useSelector((state) => state.auth.userData);
   const dispatch = useDispatch();

   const {
      register: registerName,
      handleSubmit: handleSubmitName,
      formState: { errors },
      setError,
   } = useForm({
      defaultValues: {
         name: userData?.name || "",
      },
   });

   const updateNameMutation = useMutation({
      mutationFn: async (name) => {
         await appwriteUserService.updateProfileDetail(
            userData?.$id,
            name,
            userData?.profilePicture,
            userData?.bio
         );
         return await authService.updateName(name);
      },
      onError: (error) => {
         setError("name", {
            type: "manual",
            message: error.message || "Failed to update name. Try again later.",
         });
      },
      onSuccess: (data) => {
         setEditName(false);
         dispatch(update({ ...userData, name: data.name }));
      },
   });

   const updateName = (data) => {
      updateNameMutation.mutate(data.name);
   };

   return (
      <form
         onSubmit={handleSubmitName(updateName)}
         className="p-2 dark:bg-gray-800 rounded-lg"
      >
         <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Name:</h2>
            {!editName && (
               <Pencil
                  onClickAction={() => setEditName(true)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer"
               />
            )}
         </div>
         <Input
            readOnly={!editName}
            {...registerName("name", {
               required: "Name is required.",
            })}
         />
         {errors.name && <ErrorMessage error={errors.name.message} />}

         {editName &&
            (updateNameMutation?.isPending ? (
               <div className="flex justify-center items-center mt-2">
                  <LoaderMini />
               </div>
            ) : (
               <SaveAndCancelDiv
                  type="submit"
                  cancel={() => setEditName(false)}
                  className="flex space-x-2"
               />
            ))}

         {updateNameMutation?.isError && (
            <ErrorMessage error="Error updating name, please try again." />
         )}
      </form>
   );
}

export default UpdateName;
