import { useSelector, useDispatch } from "react-redux";
import { update } from "../../store/authSlice";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import appwriteService from "../../appwrite/config-appwrite";
import appwriteUserService from "../../appwrite/config-user";
import { useMutation } from "@tanstack/react-query";
import { Input, Pencil, SaveAndCancelDiv, LoaderMini } from "../index";
import { ErrorContext } from "../../context/ErrorContext";

function UpdateProfilePic() {
   const [editProfilePic, setEditProfilePic] = useState(false);
   const userData = useSelector((state) => state.auth.userData);
   const [loading, setLoading] = useState(false);
   const { setError } = useContext(ErrorContext);

   const [profilePicture, setProfilePicture] = useState(
      userData.profilePicture || "/blank-dp.png"
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
            userData.$id,
            userData.name,
            filePreview.href,
            userData.bio
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
      setProfilePicture(userData.profilePicture);
      setEditProfilePic(false);
      setError("");
   };

   return (
      <form
         onSubmit={handleSubmit(updateProfilePicture)}
         className="flex justify-center items-center flex-col"
      >
         <img src={profilePicture} alt="Profile" className="w-52 h-52 rounded-full" />
         {!editProfilePic && (
            <Pencil
               onClickAction={() => {
                  setEditProfilePic(true);
               }}
               className="relative bottom-56 left-20"
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
      </form>
   );
}

export default UpdateProfilePic;
