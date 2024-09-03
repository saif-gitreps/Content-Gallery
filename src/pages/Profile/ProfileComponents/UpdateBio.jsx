import { useSelector, useDispatch } from "react-redux";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Input, SaveAndCancelDiv, LoaderMini } from "../../../components";
import { ErrorContext } from "../../../context/ErrorContext";
import appwriteUserService from "../../../appwrite/config-user";
import { update } from "../../../store/authSlice";
import Pencil from "./Pencil";

function UpdateBio() {
   const [editBio, setEditBio] = useState(false);
   const userData = useSelector((state) => state.auth.userData);
   const [loading, setLoading] = useState(false);
   const dispatch = useDispatch();
   const { setError } = useContext(ErrorContext);
   const [charCount, setCharCount] = useState(0);

   const {
      register: registerBio,
      handleSubmit: handleSubmitBio,
      formState: { errors: bioErrors },
   } = useForm({
      defaultValues: {
         bio: userData?.bio || "",
      },
   });

   if (bioErrors.bio) {
      setError(bioErrors.bio.message);
   }

   const updateBioMutation = useMutation({
      mutationFn: async (bio) =>
         await appwriteUserService.updateProfileDetail(
            userData?.$id,
            userData?.name,
            userData?.profilePicture,
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
         className={`p-4 dark:bg-gray-800 rounded-lg`}
      >
         <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Bio:</h2>
            {!editBio && (
               <Pencil
                  onClickAction={() => {
                     setEditBio(true);
                  }}
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
            className={`text-base font-normal w-full ${
               editBio ? "bg-white dark:bg-gray-700" : "bg-transparent"
            } border rounded-md p-2 focus:ring-2 focus:ring-blue-500`}
            readOnly={!editBio}
            {...registerBio("bio", {
               required: true,
               maxLength: {
                  value: 248,
                  message: "Please keep it under 248 characters.",
               },
            })}
            onChange={(e) => setCharCount(e.target.value.length)}
         />

         {editBio && (
            <div className="flex justify-end space-x-4">
               {loading ? (
                  <div className="flex justify-center items-center">
                     <LoaderMini />
                  </div>
               ) : (
                  <div className="flex justify-end space-x-4">
                     <SaveAndCancelDiv
                        type="submit"
                        cancel={() => {
                           setEditBio(false);
                           setError("");
                        }}
                        className="flex space-x-2"
                     />
                  </div>
               )}
            </div>
         )}
      </form>
   );
}

export default UpdateBio;
