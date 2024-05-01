import { useSelector } from "react-redux";
import { Loader, Container, Button } from "../components";
import { useCallback, useEffect, useState } from "react";
import appwriteService from "../appwrite/config-appwrite";

function Profile() {
   const [profilePicture, setProfilePicture] = useState("/blank-dp.png");
   const userData = useSelector((state) => state.auth.userData);
   const [isEditable, setIsEditable] = useState(false);

   function formatDate(dateString) {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
   }

   console.log(userData);

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
            <div className="flex flex-col items-center bg-white max-w-xl m-auto rounded-lg">
               <h1 className="text-3xl font-semibold mt-8">Profile</h1>

               {isEditable ? (
                  <div>hi</div>
               ) : (
                  <div className="flex flex-col items-center my-6">
                     <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-32 h-32 rounded-full"
                     />
                     <div className="my-6">
                        <h2 className="text-xl font-semibold mt-4">
                           <span className="text-blue-900">Name: </span>
                           {userData.name}
                        </h2>
                        <p className="text-xl font-semibold mt-42">
                           <span className="text-blue-900">Email: </span>{" "}
                           {userData.email +
                              `${
                                 userData.emailVerification
                                    ? " (Verified)"
                                    : " (Not Verified)"
                              }`}
                        </p>
                        <p className="text-xl font-semibold mt-42">
                           <span className="text-blue-900">Password: </span> Last updated
                           on {formatDate(userData.passwordUpdate)}
                        </p>
                        <p className="text-xl font-semibold mt-42">
                           <span className="text-blue-900">Phone: </span>
                           {userData.phone
                              ? userData.phone +
                                `${
                                   userData.phoneVerification
                                      ? " (Verified)"
                                      : " (Not verified)"
                                }`
                              : "Not provided"}
                        </p>
                     </div>
                     <Button
                        className="text-xl  bg-green-400 duration-300 hover:shadow-md hover:bg-green-100 rounded-xl"
                        onClick={() => setIsEditable(!isEditable)}
                     >
                        Edit profile
                     </Button>
                  </div>
               )}
            </div>
         </Container>
      </div>
   );
}

export default Profile;
