import { useSelector, useDispatch } from "react-redux";
import { update } from "../../store/authSlice";
import { Input, Pencil, SaveAndCancelDiv } from "../index";
import { useState } from "react";
import authService from "../../appwrite/auth";
import appwriteService from "../../appwrite/config-appwrite";
import { useForm } from "react-hook-form";

function UpdateProfilePic({ setErrorMessage }) {
   const [editProfilePic, setEditProfilePic] = useState(false);
   const userData = useSelector((state) => state.auth.userData);

   const [profilePicture, setProfilePicture] = useState(
      userData?.prefs?.profilePicture || "/blank-dp.png"
   );
   const dispatch = useDispatch();

   const { register: registerProfilePicture, handleSubmit: handleSubmitProfilePicture } =
      useForm();

   const onProfilePicUpload = async (data) => {
      try {
         setErrorMessage(false);
         const file = await appwriteService.uploadFile(data.profilePicture[0]);
         if (file) {
            if (userData.prefs.profilePictureId) {
               await appwriteService.deleteFile(userData.prefs.profilePictureId);
            }
            const filePreviw = await appwriteService.getFilePrev(file.$id);

            const updatedUserData = { ...userData };

            updatedUserData.prefs = {
               ...userData.prefs,
               profilePicture: filePreviw.href,
               profilePictureId: file.$id,
            };

            await authService.updateProfilePicture(filePreviw.href, file.$id);

            dispatch(update({ updatedUserData }));
            setEditProfilePic(false);

            if (filePreviw) {
               setProfilePicture(filePreviw);
            } else {
               setErrorMessage(true);
            }
         } else {
            setErrorMessage(true);
         }
      } catch (error) {
         console.log("Profile Picture Upload Error", error);
      }
   };
   /// i am taking the ref of the hidden input field
   // and putting an event listener as to when there exist a file
   // that was uploaded. the preview will be shown in the profile picture.
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
      setErrorMessage(false);
   };

   return (
      <form
         onSubmit={handleSubmitProfilePicture(onProfilePicUpload)}
         className="flex items-center flex-col"
      >
         <img src={profilePicture} alt="Profile" className="w-32 h-32 rounded-full" />
         {!editProfilePic && (
            <Pencil
               onClickAction={() => {
                  setEditProfilePic(true);
               }}
               className="relative bottom-32 left-14"
            />
         )}
         {editProfilePic && (
            <div className="flex flex-col items-center">
               <Input
                  type="file"
                  {...registerProfilePicture("profilePicture")}
                  onChange={handleProfilePicPreview}
               />
               <SaveAndCancelDiv
                  type="submit"
                  saveText="Upload"
                  cancelText="Close"
                  cancel={onCancel}
               />
            </div>
         )}
      </form>
   );
}

export default UpdateProfilePic;
