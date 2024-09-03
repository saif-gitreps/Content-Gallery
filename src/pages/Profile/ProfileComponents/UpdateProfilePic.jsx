import { useSelector, useDispatch } from "react-redux";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import appwriteService from "../../../appwrite/config-appwrite";
import { useMutation } from "@tanstack/react-query";
import appwriteUserService from "../../../appwrite/config-user";
import { update } from "../../../store/authSlice";
import { Input, SaveAndCancelDiv, LoaderMini } from "../../../components";
import Pencil from "./Pencil";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { ErrorContext } from "../../../context/ErrorContext";

function UpdateProfilePic() {
   const [editProfilePic, setEditProfilePic] = useState(false);
   const userData = useSelector((state) => state.auth.userData);
   const [loading, setLoading] = useState(false);
   const { setError } = useContext(ErrorContext);

   const [profilePicture, setProfilePicture] = useState(
      userData?.profilePicture || "/blank-dp.png"
   );
   const dispatch = useDispatch();

   const { register, handleSubmit } = useForm();

   const updateProfilePictureMutation = useMutation({
      mutationFn: async (data) => {
         const file = await appwriteService.uploadFile(data.profilePicture[0]);

         if (!file) {
            throw new Error();
         }

         const filePreview = await appwriteService.getFilePrev(file.$id);
         if (!filePreview) {
            throw new Error();
         }

         await appwriteUserService.updateProfileDetail(
            userData?.$id,
            userData?.name,
            filePreview?.href,
            userData?.bio
         );

         return filePreview;
      },
      onError: () => {
         setError("Failed to update profile picture. Try again later.");
         setLoading(false);
      },
      onSuccess: (filePreview) => {
         dispatch(update({ ...userData, profilePicture: filePreview.href }));
         setEditProfilePic(false);
         setLoading(false);
         setProfilePicture(filePreview);
      },
   });

   const updateProfilePicture = (data) => {
      setError("");
      setLoading(true);
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
      setError("");
   };

   return (
      <form
         onSubmit={handleSubmit(updateProfilePicture)}
         className="flex justify-center items-center flex-col space-y-4 p-4dark:bg-gray-800 rounded-lg"
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
                  {...register("profilePicture")}
                  onChange={handleProfilePicPreview}
                  className="text-base font-normal w-full bg-white dark:bg-gray-700 border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
               />
               {loading ? (
                  <LoaderMini />
               ) : (
                  <SaveAndCancelDiv
                     type="submit"
                     saveText="Upload"
                     cancelText="Close"
                     cancel={onCancel}
                     className="flex justify-end space-x-4"
                  />
               )}
            </div>
         )}
      </form>
   );
}

export default UpdateProfilePic;
