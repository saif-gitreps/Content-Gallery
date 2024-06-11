import { useSelector, useDispatch } from "react-redux";
import { update } from "../../store/authSlice";
import { ErrorMessage, Input, Pencil, SaveAndCancelDiv, LoaderMini } from "../index";
import { useState } from "react";
import authService from "../../appwrite/auth";
import { useForm } from "react-hook-form";

function UpdateName() {
   const [editName, setEditName] = useState(false);
   const userData = useSelector((state) => state.auth.userData);
   const dispatch = useDispatch();
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   const { register: registerName, handleSubmit: handleSubmitName } = useForm({
      defaultValues: {
         name: userData?.name || "",
      },
   });

   const onNameUpdate = async (data) => {
      setError("");
      setLoading(true);
      try {
         const updatedUserData = { ...userData };
         updatedUserData.name = data.name;

         const result = await authService.updateName(data.name);
         if (!result) {
            throw new Error();
         }

         dispatch(update(updatedUserData));
         setEditName(false);
      } catch (error) {
         setError("Name update error.");
      } finally {
         setLoading(false);
      }
   };
   return (
      <form
         onSubmit={handleSubmitName(onNameUpdate)}
         className={`p-2 ${editName && "shadow-lg rounded-lg"}`}
      >
         <div className="flex items-center justify-between">
            <h2 className="text-sm md:text-base font-semibold ml-2">Name:</h2>
            {!editName && (
               <Pencil
                  onClickAction={() => {
                     setEditName(true);
                  }}
               />
            )}
         </div>
         <Input
            className="text-sm md:text-base font-normal w-64"
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
         <ErrorMessage error={error} />
      </form>
   );
}

export default UpdateName;
