import { ErrorProvider, ErrorContext } from "../context/ErrorContext";
import { useContext } from "react";
import {
   UpdateEmail,
   UpdateName,
   UpdatePassword,
   UpdatePhone,
   ParentContainer,
   Container,
   ErrorMessage,
   UpdateProfilePic,
   UpdateBio,
} from "../components";

function UserUpdateFields() {
   const { error } = useContext(ErrorContext);
   return (
      <Container className="bg-white dark:bg-background-darkBlack dark:text-text-dark max-w-5xl py-6 m-auto rounded-xl shadow-md space-y-3">
         <h1 className="text-2xl font-semibold text-center">Edit Profile</h1>
         <div className="flex flex-col lg:flex-row space-x-3 justify-evenly items-center">
            <UpdateProfilePic />
            <div className="flex flex-wrap justify-center items-center max-w-2xl">
               <UpdateName />
               <UpdateEmail />
               <UpdatePhone />
               <UpdatePassword />
               <UpdateBio />
            </div>
         </div>
         <ErrorMessage error={error} />
      </Container>
   );
}

function EditProfile() {
   return (
      <ErrorProvider>
         <ParentContainer>
            <UserUpdateFields />
         </ParentContainer>
      </ErrorProvider>
   );
}

export default EditProfile;
