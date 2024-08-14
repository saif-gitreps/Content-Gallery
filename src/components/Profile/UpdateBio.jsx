import { useSelector, useDispatch } from "react-redux";
import { Input, Pencil, SaveAndCancelDiv, LoaderMini } from "../index";
import { useState, useContext } from "react";
import appwriteUserService from "../../appwrite/config-user";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { ErrorContext } from "../../context/ErrorContext";
import { update } from "../../store/authSlice";

function UpdateBio() {
   const [editBio, setEditBio] = useState(false);
   const userData = useSelector((state) => state.auth.userData);
   const [loading, setLoading] = useState(false);
   const dispatch = useDispatch();
   const { setError } = useContext(ErrorContext);

   const { register: registerBio, handleSubmit: handleSubmitBio } = useForm({
      defaultValues: {
         bio: userData?.bio || "",
      },
   });

   const updateBioMutation = useMutation({
      mutationFn: async (bio) =>
         await appwriteUserService.updateProfileDetail(
            userData.$id,
            userData.name,
            userData.profilePicture,
            bio
         ),
      onError: () => {
         setError("Failed to update bio. Try again later.");
         setLoading(false);
      },
      onSuccess: (data) => {
         setEditBio(false);
         setError("");
         setLoading(false);

         dispatch(update({ ...userData, bio: data.bio }));
      },
   });

   const updateBio = (data) => {
      setLoading(true);
      setError("");
      updateBioMutation.mutate(data.bio);
   };

   return (
      <form
         onSubmit={handleSubmitBio(updateBio)}
         className={`p-2 ${editBio && "shadow-lg rounded-lg"}`}
      >
         <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold ml-2">Bio:</h2>
            {!editBio && (
               <Pencil
                  onClickAction={() => {
                     setEditBio(true);
                  }}
               />
            )}
         </div>
         <Input
            className="text-base font-normal sm:w-96 w-64"
            readOnly={!editBio}
            {...registerBio("bio", { required: true, maxLength: 248 })}
         />
         {editBio &&
            (loading ? (
               <div className="flex justify-center items-center mt-2">
                  <LoaderMini />
               </div>
            ) : (
               <SaveAndCancelDiv
                  type="submit"
                  cancel={() => {
                     setEditBio(false);
                     setError("");
                  }}
               />
            ))}
      </form>
   );
}

export default UpdateBio;
