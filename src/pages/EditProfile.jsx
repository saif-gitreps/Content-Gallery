import {
   UpdateEmail,
   UpdateName,
   UpdatePassword,
   UpdatePhone,
   ParentContainer,
   Container,
   ErrorMessage,
} from "../components";

function EditProfile() {
   return (
      <ParentContainer>
         <Container className="flex flex-col items-center bg-white dark:bg-background-darkBlack dark:text-text-dark max-w-md py-6 m-auto rounded-xl shadow-md space-y-2">
            <h1 className="text-2xl font-semibold">Edit Profile</h1>
            <UpdateName />
            {/* Update Bio */}
            <UpdateEmail />
            <UpdatePhone />
            <UpdatePassword />
            <ErrorMessage />
         </Container>
      </ParentContainer>
   );
}

export default EditProfile;
