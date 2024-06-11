import { useSelector, useDispatch } from "react-redux";
import { update } from "../../store/authSlice";
import { useState } from "react";
import authService from "../../appwrite/auth";
import { useForm } from "react-hook-form";
import appwriteService from "../../appwrite/config-appwrite";
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

   const onProfilePicUpload = async (data) => {
      setError("");
      setLoading(true);
      try {
         const file = await appwriteService.uploadFile(data.profilePicture[0]);
         if (!file) {
            setError("Profile picture upload error");
            return;
         }
         if (userData.prefs.profilePictureId) {
            await appwriteService.deleteFile(userData.prefs.profilePictureId);
         }
         const filePreviw = await appwriteService.getFilePrev(file.$id);

         const updatedUserData = { ...userData };
         updatedUserData.prefs = {
            profilePicture: filePreviw.href,
            profilePictureId: file.$id,
         };

         await authService.updateProfilePicture(filePreviw.href, file.$id);

         dispatch(update(updatedUserData));
         setEditProfilePic(false);

         if (!filePreviw) {
            setError("Profile picture upload error");
            return;
         }

         setProfilePicture(filePreviw);
      } catch (error) {
         setError("Profile picture upload error");
      } finally {
         setLoading(false);
      }
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
         onSubmit={handleSubmit(onProfilePicUpload)}
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
