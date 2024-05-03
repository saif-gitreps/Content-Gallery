import { useSelector, useDispatch } from "react-redux";
import { update } from "../store/authSlice";
import { Container, Input, Button } from "../components";
import { useEffect, useState } from "react";
import appwriteService from "../appwrite/config-appwrite";
import { useForm } from "react-hook-form";

function Profile() {
   const [profilePicture, setProfilePicture] = useState("/blank-dp.png");
   const userData = useSelector((state) => state.auth.userData);
   const [editProfilePic, setEditProfilePic] = useState(false);
   const [editName, setEditName] = useState(false);
   const [editEmail, setEditEmail] = useState(false);
   const [editPassword, setEditPassword] = useState(false);
   const [editPhone, setEditPhone] = useState(false);
   const dispatch = useDispatch();

   const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
   };

   const { register: registerProfilePicture, handleSubmit: handleSubmitProfilePicture } =
      useForm();

   const { register: registerName, handleSubmit: handleSubmitName } = useForm({
      defaultValues: {
         name: userData?.name || "",
      },
   });

   const { register: registerEmail, handlesubmit: handleSubmitEmail } = useForm({
      defaultValues: {
         email: userData?.email || "",
      },
   });

   const { register: registerPassword, handleSubmit: handleSubmitPassword } = useForm({
      defaultValues: {
         password: "",
      },
   });

   const { register: registerPhone, handleSubmit: handleSubmitPhone } = useForm({
      defaultValues: {
         phone: userData?.phone || "",
      },
   });

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
               <div>
                  <img
                     src={profilePicture}
                     alt="Profile"
                     className="w-32 h-32 rounded-full"
                  />
                  <img
                     src="edit-icon.png"
                     alt="Profile"
                     className="w-4 h-4 relative bottom-4 left-28 hover:cursor-pointer hover:opacity-50"
                  />
                  <Input className="hidden" />
               </div>

               <div className="flex flex-col items-center my-6">
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
                        <span className="text-blue-900">Password: </span> Last updated on{" "}
                        {formatDate(userData.passwordUpdate)}
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
               </div>
            </div>
         </Container>
      </div>
   );
}

export default Profile;
