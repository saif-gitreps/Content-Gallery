import {
   Container,
   UpdateProfilePic,
   UpdateName,
   UpdateEmail,
   UpdatePhone,
   UpdatePassword,
} from "../components";

function Profile() {
   return (
      <div className="py-8">
         <Container>
            <div className="flex flex-col items-center bg-white max-w-xl m-auto rounded-xl shadow-md">
               <h1 className="text-3xl font-semibold mt-8">Profile</h1>
               <UpdateProfilePic />
               <div className="flex flex-col items-center mb-6">
                  <div className="my-6">
                     <UpdateName />
                     <UpdateEmail />
                     <UpdatePhone />
                     <UpdatePassword />
                  </div>
               </div>
            </div>
         </Container>
      </div>
   );
}

export default Profile;
