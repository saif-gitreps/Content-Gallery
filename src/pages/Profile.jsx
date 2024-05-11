import {
   Container,
   UpdateProfilePic,
   UpdateName,
   UpdateEmail,
   UpdatePhone,
   UpdatePassword,
} from "../components";
import { useState } from "react";

function Profile() {
   const [errorMessage, setErrorMessage] = useState(false);
   return (
      <div className="py-8">
         <Container>
            <div className="flex flex-col items-center bg-white max-w-xl m-auto rounded-xl shadow-md">
               <h1 className="text-3xl font-semibold mt-8">Profile</h1>
               <UpdateProfilePic setErrorMessage={setErrorMessage} />
               <div className="flex flex-col items-center mb-4">
                  <UpdateName setErrorMessage={setErrorMessage} />
                  <UpdateEmail setErrorMessage={setErrorMessage} />
                  <UpdatePhone setErrorMessage={setErrorMessage} />
                  <UpdatePassword setErrorMessage={setErrorMessage} />
                  {errorMessage && (
                     <p className="text-red-600 mt-2 text-lg font-medium text-center">
                        Something went wrong, please try again.
                     </p>
                  )}
               </div>
            </div>
         </Container>
      </div>
   );
}

export default Profile;
