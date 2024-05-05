import { useSelector, useDispatch } from "react-redux";
import { update } from "../store/authSlice";
import { Container, Input } from "../components";
import { useState, useRef } from "react";
import authService from "../appwrite/auth";
import appwriteService from "../appwrite/config-appwrite";
import { set, useForm } from "react-hook-form";

function ProfilePicUpdateIcons({
   profilePictureInputRef,
   setProfilePicture,
   userData,
   setEditProfilePic,
}) {
   return (
      <div className="flex items-center justify-evenly p-2">
         <img
            src="upload-icon.png"
            alt="save"
            className="w-6 h-6 hover:cursor-pointer hover:opacity-50"
            onClick={() => profilePictureInputRef.current.click()}
         />
         <button type="submit" className="hover:cursor-pointer hover:opacity-50">
            <img src="check.png" alt="save" className="w-6 h-6" />
         </button>
         <img
            src="delete-button.png"
            alt="cancel"
            className="w-6 h-6 hover:cursor-pointer hover:opacity-50"
            onClick={() => {
               setProfilePicture(userData?.profilePicture || "/blank-dp.png");
               setEditProfilePic(false);
            }}
         />
      </div>
   );
}

function Profile() {
   const [editProfilePic, setEditProfilePic] = useState(false);
   const [editName, setEditName] = useState(false);
   const [editEmail, setEditEmail] = useState(false);
   const [editPassword, setEditPassword] = useState(false);
   const [editPhone, setEditPhone] = useState(false);
   const userData = useSelector((state) => state.auth.userData);
   const [profilePicture, setProfilePicture] = useState(
      userData.prefs.profilePicture || "/blank-dp.png"
   );
   const dispatch = useDispatch();

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

   const onProfilePicUpload = async (data) => {
      try {
         const file = await appwriteService.uploadFile(data.profilePicture[0]);
         console.log(file);
         if (file) {
            const filePreviw = await appwriteService.getFilePrev(file.$id);

            const updatedUserData = { ...userData };
            updatedUserData.prefs = { ...userData.prefs };
            updatedUserData.prefs.profilePicture = filePreviw.href;

            await authService.updateProfilePicture(filePreviw.href);

            dispatch(update({ updatedUserData }));

            if (filePreviw) {
               setProfilePicture(filePreviw);
            }
            setEditProfilePic(false);
         }
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
            <div className="flex flex-col items-center bg-white max-w-xl m-auto rounded-xl shadow-md">
               <h1 className="text-3xl font-semibold mt-8">Profile</h1>
               <form
                  key={1}
                  onSubmit={handleSubmitProfilePicture(onProfilePicUpload)}
                  className="h-44"
               >
                  <img
                     src={profilePicture}
                     alt="Profile"
                     className="w-32 h-32 rounded-full"
                  />
                  <Input
                     className=""
                     type="file"
                     {...registerProfilePicture("profilePicture")}
                     onChange={handleProfilePicPreview}
                     // ref={profilePictureInputRef}
                  />
                  {!editProfilePic && (
                     <img
                        src="edit-icon.png"
                        alt="Profile"
                        className="w-4 h-4 relative bottom-4 left-28 hover:cursor-pointer hover:opacity-50"
                        onClick={() => {
                           setEditProfilePic(true);
                        }}
                     />
                  )}
                  {editProfilePic && (
                     <div className="flex items-center justify-evenly p-2">
                        <img
                           src="upload-icon.png"
                           alt="upload"
                           className="w-6 h-6 hover:cursor-pointer hover:opacity-50"
                           onClick={() => profilePictureInputRef.current.click()}
                        />
                        <button
                           type="submit"
                           className="hover:cursor-pointer hover:opacity-50"
                        >
                           <img src="check.png" alt="save" className="w-6 h-6" />
                           submit
                        </button>
                        <img
                           src="delete-button.png"
                           alt="cancel"
                           className="w-6 h-6 hover:cursor-pointer hover:opacity-50"
                           onClick={() => {
                              setProfilePicture(
                                 userData?.profilePicture || "/blank-dp.png"
                              );
                              setEditProfilePic(false);
                           }}
                        />
                     </div>
                  )}
               </form>

               {/*

               <div className="flex flex-col items-center mb-6">
                  <div className="my-6">
                     <form action="">
                        <h2 className="text-lg font-semibold ml-2">Name:</h2>
                        <Input
                           className="text-xl font-normal"
                           readOnly={!editName}
                           {...registerName("name", { required: true })}
                        />
                     </form>
                     <form action="">
                        <h2 className="text-lg font-semibold ml-2">
                           Email{" "}
                           {`${
                              userData.emailVerification
                                 ? " (Verified)"
                                 : " (Not Verified)"
                           }`}{" "}
                           :
                        </h2>
                        <Input
                           className="text-xl font-normal"
                           readOnly={!editEmail}
                           {...registerEmail("email", { required: true })}
                        />
                     </form>
                     <form action="">
                        <h2 className="text-lg font-semibold ml-2">
                           Phone{" "}
                           {`${
                              userData.phoneVerification
                                 ? " (Verified)"
                                 : " (Not Verified)"
                           }`}{" "}
                           :
                        </h2>
                        <Input
                           className="text-xl font-normal"
                           readOnly={!editPhone}
                           {...registerPhone("phone")}
                        />
                     </form>
                     <form action="">
                        <h2 className="text-lg font-semibold ml-2">Password:</h2>
                        <Input
                           className="text-xl font-normal"
                           readOnly={!editPassword}
                           {...registerPassword("password", { required: true })}
                        />
                     </form>
                  </div>
               </div>
               */}
            </div>
         </Container>
      </div>
   );
}

export default Profile;
