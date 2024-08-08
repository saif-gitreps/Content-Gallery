import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { update } from "../store/authSlice";

const useUpdateProfilePicture = (onSuccess) => {
   const dispatch = useDispatch();

   return useMutation(
      async (data) => {
         const file = await appwriteService.uploadFile(data.profilePicture[0]);
         if (!file) {
            throw new Error("Profile picture upload error");
         }

         const filePreview = await appwriteService.getFilePrev(file.$id);

         if (!filePreview) {
            throw new Error("Profile picture upload error");
         }

         if (data.currentProfilePictureId) {
            await appwriteService.deleteFile(data.currentProfilePictureId);
         }

         await authService.updateProfilePicture(filePreview.href, file.$id);

         return { filePreview, file };
      },
      {
         onSuccess: ({ filePreview, file }, variables) => {
            const updatedUserData = {
               ...variables.userData,
               prefs: {
                  profilePicture: filePreview.href,
                  profilePictureId: file.$id,
               },
            };

            dispatch(update(updatedUserData));
            onSuccess(filePreview);
         },
         onError: (error) => {
            console.error("Profile picture update failed:", error);
         },
      }
   );
};

export default useUpdateProfilePicture;
