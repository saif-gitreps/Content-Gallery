import { ErrorProvider, ErrorContext } from "../../context/ErrorContext";
import { useContext } from "react";
import {
   UpdateEmail,
   UpdateName,
   UpdatePassword,
   UpdatePhone,
   UpdateProfilePic,
   UpdateBio,
} from "./ProfileComponents";
import { ErrorMessage, ParentContainer } from "../../components";
function UserUpdateFields() {
   const { error } = useContext(ErrorContext);
   return (
      <ParentContainer className="bg-white dark:bg-black rounded-lg shadow-lg p-8 max-w-7xl mx-auto">
         <h1 className="text-3xl font-bold text-center mb-6">Edit Profile</h1>
         <div className="flex flex-col lg:flex-row lg:space-x-8">
            <div className="w-full lg:w-1/3 mb-6 lg:mb-0 mt-3">
               <UpdateProfilePic />
            </div>
            <div className="w-full lg:w-2/3">
               <UpdateName />
               <UpdateEmail />
               <UpdatePhone />
               <UpdatePassword />
               <UpdateBio />
            </div>
         </div>
         {error && (
            <ErrorMessage error={error} className="mt-6 text-center text-red-500" />
         )}
      </ParentContainer>
   );
}

function EditProfile() {
   return (
      <ErrorProvider>
         <UserUpdateFields />
      </ErrorProvider>
   );
}

export default EditProfile;
