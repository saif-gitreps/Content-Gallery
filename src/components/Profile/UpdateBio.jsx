import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Input, SaveAndCancelDiv, LoaderMini, ErrorMessage } from "..";
import appwriteUserService from "../../appwrite/config-user";
import { update } from "../../store/authSlice";
import Pencil from "./Pencil";
import { toast } from "react-toastify";

function UpdateBio() {
   const [editBio, setEditBio] = useState(false);
   const userData = useSelector((state) => state.auth.userData);
   const dispatch = useDispatch();
   const [charCount, setCharCount] = useState(userData?.bio?.length || 0);

   const {
      register: registerBio,
      handleSubmit: handleSubmitBio,
      formState: { errors: bioErrors },
   } = useForm({
      defaultValues: {
         bio: userData?.bio || "",
      },
   });

   const updateBioMutation = useMutation({
      mutationFn: async (bio) =>
         await appwriteUserService.updateProfileDetail(
            userData?.$id,
            userData?.name,
            userData?.profilePicture,
            bio
         ),
      onError: (error) => {
         toast.error("Something went wrong while updating Bio");
      },
      onSuccess: (data) => {
         setEditBio(false);
         dispatch(update({ ...userData, bio: data.bio }));
         toast.success("Bio updated successfully");
      },
   });

   const updateBio = (data) => {
      updateBioMutation.mutate(data.bio);
   };

   return (
      <form
         onSubmit={handleSubmitBio(updateBio)}
         className="p-2 dark:bg-gray-800 rounded-lg"
      >
         <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Bio:</h2>
            {!editBio && (
               <Pencil
                  onClickAction={() => setEditBio(true)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer"
               />
            )}
            {editBio && (
               <h2 className="text-base font-normal text-gray-600 dark:text-gray-300">
                  {charCount}/248
               </h2>
            )}
         </div>

         <Input
            type="textarea"
            readOnly={!editBio}
            {...registerBio("bio", {
               required: "Bio is required.",
               maxLength: {
                  value: 248,
                  message: "Please keep it under 248 characters.",
               },
            })}
            onChange={(e) => setCharCount(e.target.value.length)}
         />
         {bioErrors.bio && <ErrorMessage error={bioErrors.bio.message} />}

         {editBio &&
            (updateBioMutation?.isPending ? (
               <div className="flex justify-center items-center mt-2">
                  <LoaderMini />
               </div>
            ) : (
               <SaveAndCancelDiv
                  type="submit"
                  cancel={() => setEditBio(false)}
                  className="flex space-x-2"
               />
            ))}
      </form>
   );
}

export default UpdateBio;
