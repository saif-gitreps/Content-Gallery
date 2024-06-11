import {
   Container,
   UpdateProfilePic,
   UpdateName,
   UpdateEmail,
   UpdatePhone,
   UpdatePassword,
   ErrorMessage,
} from "../components";

function Profile() {
   return (
      <div className="py-8">
         <Container className="flex flex-col items-center bg-white max-w-md py-6 m-auto rounded-xl shadow-md space-y-2">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <UpdateProfilePic />
            <div className="flex flex-col items-center">
               <UpdateName />
               <UpdateEmail />
               <UpdatePhone />
               <UpdatePassword />
               <ErrorMessage />
            </div>
         </Container>
      </div>
   );
}

export default Profile;
