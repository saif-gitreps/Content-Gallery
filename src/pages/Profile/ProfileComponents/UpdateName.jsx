import { useSelector, useDispatch } from "react-redux";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import appwriteUserService from "../../../appwrite/config-user";
import { update } from "../../../store/authSlice";
import { Input, SaveAndCancelDiv, LoaderMini } from "../../../components";
import authService from "../../../appwrite/auth";
import { ErrorContext } from "../../../context/ErrorContext";
import Pencil from "./Pencil";

function UpdateName() {
   const [editName, setEditName] = useState(false);
   const userData = useSelector((state) => state.auth.userData);
   const dispatch = useDispatch();
   const [loading, setLoading] = useState(false);
   const { setError } = useContext(ErrorContext);

   const { register: registerName, handleSubmit: handleSubmitName } = useForm({
      defaultValues: {
         name: userData?.name || "",
      },
   });

   const updateNameMutation = useMutation({
      mutationFn: async (name) => {
         await appwriteUserService.updateProfileDetail(
            userData?.$id,
            name,
            userData?.profilePicture,
            userData?.bio
         );
         return await authService.updateName(name);
      },
      onError: (error) => {
         setError(error);
         setLoading(false);
      },
      onSuccess: (data) => {
         setEditName(false);
         setError("");
         setLoading(false);
         dispatch(update({ ...userData, name: data.name }));
      },
   });

   const updateName = async (data) => {
      setError("");
      setLoading(true);
      updateNameMutation.mutate(data.name);
   };

   return (
      <form
         onSubmit={handleSubmitName(updateName)}
         className={`p-2 ${editName && "shadow-lg rounded-lg"}`}
      >
         <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold ml-2">Name:</h2>
            {!editName && (
               <Pencil
                  onClickAction={() => {
                     setEditName(true);
                  }}
               />
            )}
         </div>
         <Input
            className="text-base font-normal w-64"
            readOnly={!editName}
            {...registerName("name", { required: true })}
         />
         {editName &&
            (loading ? (
               <div className="flex justify-center items-center mt-2">
                  <LoaderMini />
               </div>
            ) : (
               <SaveAndCancelDiv
                  type="submit"
                  cancel={() => {
                     setEditName(false);
                     setError("");
                  }}
               />
            ))}
      </form>
   );
}

export default UpdateName;
