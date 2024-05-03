import { useSelector, useDispatch } from "react-redux";
import { update } from "../store/authSlice";
import { Container, Input, Button } from "../components";
import { useEffect, useState, useRef } from "react";
import appwriteService from "../appwrite/config-appwrite";
import { useForm } from "react-hook-form";

function Profile() {
   const [profilePicture, setProfilePicture] = useState("/blank-dp.png");
   const userData = useSelector((state) => state.auth.userData);
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

   const onProfilePicUpload = async (data) => {
      const file = data.profilePicture[0];
      const fileData = new FormData();
      fileData.append("file", file);

      try {
         const fileRes = await appwriteService.uploadFile(fileData);
         const updatedUser = await appwriteService.updateProfile({
            profilePicture: fileRes.$id,
         });
         dispatch(update({ userData: updatedUser }));
      } catch (error) {
         console.log("Profile Picture Upload Error", error);
      }
   };

   const profilePictureInputRef = useRef(null);

   /// i am taking the ref of the hidden input field
   // and putting an event listener as to when there exist a file
   // that was uploaded. the preview will be shown in the profile picture.
   const handleProfilePicPreview = (event) => {
      const file = event.target.files[0];
      if (file) {
         const reader = new FileReader();
         reader.onload = () => {
            setProfilePicture(reader.result);
         };
         reader.readAsDataURL(file);
      }
   };

   return (
      <div className="py-8">
         <Container>
            <div className="flex flex-col items-center bg-white max-w-xl m-auto rounded-lg">
               <h1 className="text-3xl font-semibold mt-8">Profile</h1>
               <form onSubmit={handleSubmitProfilePicture(onProfilePicUpload)}>
                  <img
                     src={profilePicture}
                     alt="Profile"
                     className="w-32 h-32 rounded-full"
                  />
                  <Input
                     className="hidden"
                     type="file"
                     {...registerProfilePicture("profilePicture")}
                     onChange={handleProfilePicPreview}
                     ref={profilePictureInputRef}
                  />
                  <img
                     src="edit-icon.png"
                     alt="Profile"
                     className="w-4 h-4 relative bottom-4 left-28 hover:cursor-pointer hover:opacity-50"
                     onClick={() => profilePictureInputRef.current.click()}
                  />
                  <Button type="submit">Save</Button>
                  <Button
                     type="button"
                     onClick={() => {
                        setProfilePicture(userData?.profilePicture || "/blank-dp.png");
                     }}
                  >
                     Cancel
                  </Button>
               </form>

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
