import { useSelector } from "react-redux";
import { Loader, Container } from "../components";
import { useCallback, useEffect, useState } from "react";
import appwriteService from "../appwrite/config-appwrite";

function Profile() {
   const [profilePicture, setProfilePicture] = useState("/blank-dp.png");
   const userData = useSelector((state) => state.auth.userData);

   useEffect(() => {
      async () => {
         if (userData.profilePicture) {
            setProfilePicture(
               await appwriteService
                  .getFilePrev(userData.profilePicture)
                  .then((res) => res)
                  .catch(() => "/blank-dp.png")
            );
         }
      };
   }, [userData.profilePicture]);

   return (
      <div className="py-8">
         <Container>
            <div className="flex flex-col items-center bg-white ">
               <h1 className="text-3xl font-semibold mt-8">Profile</h1>

               <div className="flex flex-col items-center mt-8">
                  <img
                     src={profilePicture}
                     alt="Profile"
                     className="w-32 h-32 rounded-full"
                  />
                  <h2 className="text-xl font-semibold mt-4">{userData.name}</h2>
                  <p className="text-lg font-medium mt-2">{userData.email}</p>
               </div>
            </div>
         </Container>
      </div>
   );
}

export default Profile;
