import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useForm } from "react-hook-form";
import appwriteService from "../../appwrite/config-appwrite";
import { useMutation } from "@tanstack/react-query";
import appwriteUserService from "../../appwrite/config-user";
import { update } from "../../store/authSlice";
import { Input, SaveAndCancelDiv, LoaderMini, ErrorMessage } from "..";
import Pencil from "./Pencil";
import { LazyLoadImage } from "react-lazy-load-image-component";

function UpdateProfilePic() {
   const [editProfilePic, setEditProfilePic] = useState(false);
   const userData = useSelector((state) => state.auth.userData);

   const [profilePicture, setProfilePicture] = useState(
      userData?.profilePicture || "/blank-dp.png"
   );
   const dispatch = useDispatch();

   const {
      register,
      handleSubmit,
      setError,
      formState: { errors },
   } = useForm();

   const updateProfilePictureMutation = useMutation({
      mutationFn: async (data) => {
         const file = await appwriteService.uploadFile(data.profilePicture[0]);

         if (!file) {
            throw new Error("Failed to upload file");
         }

         const filePreview = await appwriteService.getFilePrev(file.$id);
         if (!filePreview) {
            throw new Error("Failed to get file preview");
         }

         await appwriteUserService.updateProfileDetail(
            userData?.$id,
            userData?.name,
            filePreview?.href,
            userData?.bio
         );

         return filePreview;
      },
      onSuccess: (filePreview) => {
         dispatch(update({ ...userData, profilePicture: filePreview.href }));
         setEditProfilePic(false);
         setProfilePicture(filePreview.href);
      },
      onError: (error) => {
         setError("profilePicture", {
            type: "manual",
            message:
               error.message || "Failed to update profile picture. Please try again.",
         });
      },
   });

   const updateProfilePicture = (data) => {
      updateProfilePictureMutation.mutate(data);
   };

   const handleProfilePicPreview = (event) => {
      const file = event.target.files[0];
      if (file) {
         const reader = new FileReader();
         reader.onload = () => {
            setProfilePicture(reader.result);
         };
         reader.readAsDataURL(file);
      }
   };

   const onCancel = () => {
      setProfilePicture(userData?.profilePicture);
      setEditProfilePic(false);
   };

   return (
      <form
         onSubmit={handleSubmit(updateProfilePicture)}
         className="flex justify-center items-center flex-col space-y-4 p-2 dark:bg-gray-800 rounded-lg"
      >
         <div className="relative">
            <LazyLoadImage
               src={profilePicture}
               alt="Profile Picture"
               className="w-56 h-56 rounded-full object-cover shadow-2xl"
               effect="blur"
               onError={(e) => (e.target.src = "/blank-dp.png.jpg")}
            />
            {!editProfilePic && (
               <Pencil
                  onClickAction={() => setEditProfilePic(true)}
                  className="absolute bottom-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer"
               />
            )}
         </div>

         {editProfilePic && (
            <div className="flex flex-col items-center space-y-3">
               <Input
                  type="file"
                  {...register("profilePicture", {
                     required: "Please select a file to upload.",
                  })}
                  onChange={handleProfilePicPreview}
                  className="text-base font-normal w-full bg-white dark:bg-gray-700 border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
               />

               {updateProfilePictureMutation?.isPending ? (
                  <div className="flex justify-center items-center mt-2">
                     <LoaderMini />
                  </div>
               ) : (
                  <SaveAndCancelDiv
                     type="submit"
                     saveText="Upload"
                     cancel={onCancel}
                     className="flex justify-end space-x-4"
                  />
               )}
            </div>
         )}

         {updateProfilePictureMutation?.isError && (
            <ErrorMessage error="Error updating profile picture, please try again." />
         )}
      </form>
   );
}

export default UpdateProfilePic;
