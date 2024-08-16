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
            {editBio && <h2 className="text-base font-normal">{charCount}/248</h2>}
         </div>
         <Input
            className="text-base font-normal sm:w-96 w-64"
            readOnly={!editBio}
            {...registerBio("bio", {
               required: true,
               maxLength: {
                  value: 248,
                  message: "Please keep it under 150 Chars.",
               },
            })}
            onChange={(e) => setCharCount(e.target.value.length)}
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
