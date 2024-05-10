import { useSelector, useDispatch } from "react-redux";
import { update } from "../../store/authSlice";
import { Input, Pencil, SaveAndCancelDiv } from "../index";
import { useState } from "react";
import authService from "../../appwrite/auth";
import { useForm } from "react-hook-form";

function UpdateName() {
   const [editName, setEditName] = useState(false);
   const userData = useSelector((state) => state.auth.userData);
   const dispatch = useDispatch();

   const { register: registerName, handleSubmit: handleSubmitName } = useForm({
      defaultValues: {
         name: userData?.name || "",
      },
   });

   const onNameUpdate = async (data) => {
      try {
         const updatedUserData = { ...userData };
         updatedUserData.name = data.name;

         const result = await authService.updateName(data.name);

         if (result) {
            dispatch(update({ updatedUserData }));
            setEditName(false);
         }
      } catch (error) {
         console.log("Name Update Error", error);
      }
   };
   return (
      <form
         onSubmit={handleSubmitName(onNameUpdate)}
         className={`p-2 my-1 ${editName && "shadow-lg rounded-lg"}`}
      >
         <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold ml-2">Name:</h2>
            {!editName && (
               <Pencil
                  onClickAction={() => {
                     setEditName(true);
                  }}
               />
            )}
         </div>
         <Input
            className="text-xl font-normal"
            readOnly={!editName}
            {...registerName("name", { required: true })}
         />
         {editName && (
            <SaveAndCancelDiv
               type="submit"
               cancel={() => {
                  setEditName(false);
               }}
            />
         )}
      </form>
   );
}

export default UpdateName;
