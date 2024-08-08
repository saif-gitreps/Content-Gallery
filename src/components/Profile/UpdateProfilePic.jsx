import { useSelector, useDispatch } from "react-redux";
import { update } from "../../store/authSlice";
import { useState } from "react";
import authService from "../../appwrite/auth";
import { useForm } from "react-hook-form";
import appwriteService from "../../appwrite/config-appwrite";
import { useMutation } from "@tanstack/react-query";
import { Input, Pencil, SaveAndCancelDiv, LoaderMini, ErrorMessage } from "../index";

function UpdateProfilePic() {
   const [editProfilePic, setEditProfilePic] = useState(false);
   const userData = useSelector((state) => state.auth.userData);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   const [profilePicture, setProfilePicture] = useState(
      userData?.prefs?.profilePicture || "/blank-dp.png"
   );
   const dispatch = useDispatch();

   const { register, handleSubmit } = useForm();

   const updateProfilePictureMutation = useMutation({
      mutationFn: async (data) => {
         const file = await appwriteService.uploadFile(data.profilePicture[0]);

         if (!file) {
            throw new Error("Profile picture upload error");
         }

         const filePreview = await appwriteService.getFilePrev(file.$id);
         if (!filePreview) {
            throw new Error("Failed to get file preview.");
         }

         if (userData.prefs.profilePictureId) {
            await appwriteService.deleteFile(userData.prefs.profilePictureId);
         }

         await authService.updateProfilePicture(filePreview.href, file.$id);

         return { filePreview, file };
      },
      onError: (error) => {
         setError(error);
         setLoading(false);
      },
      onSuccess: ({ filePreview, file }) => {
         const updatedUserData = {
            ...userData,
            prefs: {
               profilePicture: filePreview.href,
               profilePictureId: file.$id,
            },
         };

         dispatch(update(updatedUserData));
         setEditProfilePic(false);
         setLoading(false);
         setProfilePicture(filePreview);
      },
   });

   const updateProfilePicture = async (data) => {
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
      setProfilePicture(userData?.prefs.profilePicture || "/blank-dp.png");
      setEditProfilePic(false);
      setError("");
   };

   return (
      <form
         onSubmit={handleSubmit(updateProfilePicture)}
         className="flex items-center flex-col"
      >
         <img src={profilePicture} alt="Profile" className="w-28 h-28 rounded-full" />
         {!editProfilePic && (
            <Pencil
               onClickAction={() => {
                  setEditProfilePic(true);
               }}
               className="relative bottom-28 left-12"
            />
         )}
         {editProfilePic && (
            <div className="flex flex-col items-center">
               <Input
                  type="file"
                  {...register("profilePicture")}
                  onChange={handleProfilePicPreview}
               />
               {loading ? (
                  <LoaderMini />
               ) : (
                  <SaveAndCancelDiv
                     type="submit"
                     saveText="Upload"
                     cancelText="Close"
                     cancel={onCancel}
                  />
               )}
            </div>
         )}
         <ErrorMessage error={error} />
      </form>
   );
}

export default UpdateProfilePic;
