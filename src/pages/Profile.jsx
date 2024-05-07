import { useSelector, useDispatch } from "react-redux";
import { update } from "../store/authSlice";
import { Container, Input } from "../components";
import { useState, useRef } from "react";
import authService from "../appwrite/auth";
import appwriteService from "../appwrite/config-appwrite";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

function Profile() {
   const [editProfilePic, setEditProfilePic] = useState(false);
   const [editName, setEditName] = useState(false);
   const [editEmail, setEditEmail] = useState(false);
   const [editPassword, setEditPassword] = useState(false);
   const [editPhone, setEditPhone] = useState(false);
   const userData = useSelector((state) => state.auth.userData);
   const [profilePicture, setProfilePicture] = useState(
      userData?.prefs?.profilePicture || "/blank-dp.png"
   );
   const dispatch = useDispatch();

   const { register: registerProfilePicture, handleSubmit: handleSubmitProfilePicture } =
      useForm();

   const { register: registerName, handleSubmit: handleSubmitName } = useForm({
      defaultValues: {
         name: userData?.name || "",
      },
   });

   const { register: registerEmail, handleSubmit: handleSubmitEmail } = useForm({
      defaultValues: {
         email: userData?.email || "",
         password: "",
      },
   });

   const { register: registerPassword, handleSubmit: handleSubmitPassword } = useForm({
      defaultValues: {
         oldPassword: "",
         newPassword: "",
      },
   });

   const { register: registerPhone, handleSubmit: handleSubmitPhone } = useForm({
      defaultValues: {
         phone: userData?.phone || "",
         password: "",
      },
   });

   const onProfilePicUpload = async (data) => {
      try {
         const file = await appwriteService.uploadFile(data.profilePicture[0]);
         if (file) {
            console.log(userData);
            if (userData.prefs.profilePictureId) {
               const check = await appwriteService.deleteFile(
                  userData.prefs.profilePictureId
               );
               console.log(check);
            }
            const filePreviw = await appwriteService.getFilePrev(file.$id);

            const updatedUserData = { ...userData };

            updatedUserData.prefs = {
               ...userData.prefs,
               profilePicture: filePreviw.href,
               profilePictureId: file.$id,
            };

            await authService.updateProfilePicture(filePreviw.href, file.$id);

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

   const onNameUpdate = async (data) => {
      try {
         const updatedUserData = { ...userData };
         updatedUserData.name = data.name;

         const result = await authService.updateName(data.name);

         if (result) {
            dispatch(update({ updatedUserData }));
            setEditName(false);
         }
      } catch (error) {
         console.log("Name Update Error", error);
      }
   };

   const onEmailUpdate = async (data) => {
      try {
         const updatedUserData = { ...userData };
         updatedUserData.email = data.email;

         const result = await authService.updateEmail(data.email, data.password);

         if (result) {
            dispatch(update({ updatedUserData }));
            setEditEmail(false);
         }
      } catch (error) {
         console.log("Email Update Error", error);
      }
   };

   const onPhoneUpdate = async (data) => {
      try {
         const updatedUserData = { ...userData };
         updatedUserData.phone = data.phone;

         const result = await authService.updatePhone(data.phone, data.password);

         if (result) {
            dispatch(update({ updatedUserData }));
            setEditPhone(false);
         }
      } catch (error) {
         console.log("Phone Update Error", error);
      }
   };

   const onPasswordUpdate = async (data) => {
      try {
         const result = await authService.updatePassword(
            data.OldPassword,
            data.newPassword
         );

         if (result) {
            setEditPassword(false);
         }
      } catch (error) {
         console.log("Password Update Error", error);
      }
   };

   const emailVerificationMessage = useRef(null);

   const verifyEmail = async () => {
      try {
         const result = await authService.createEmailVerification();
         if (result) {
            emailVerificationMessage.current.classList.remove("hidden");
         }
      } catch (error) {
         console.log("Email Verification Error", error);
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
                  className="flex items-center flex-col"
               >
                  <img
                     src={profilePicture}
                     alt="Profile"
                     className="w-32 h-32 rounded-full"
                  />
                  {!editProfilePic && (
                     <img
                        src="edit-icon.png"
                        alt="Profile"
                        className="w-4 h-4 relative bottom-32 left-14 hover:cursor-pointer hover:opacity-50"
                        onClick={() => {
                           setEditProfilePic(true);
                        }}
                     />
                  )}
                  {editProfilePic && (
                     <div className="flex flex-col items-center">
                        <Input
                           type="file"
                           {...registerProfilePicture("profilePicture")}
                           onChange={handleProfilePicPreview}
                        />
                        <div className="flex m-2">
                           <button
                              type="submit"
                              className="bg-green-300 p-2 mx-1 rounded-lg hover:cursor-pointer hover:opacity-50"
                           >
                              Save
                           </button>
                           <button
                              className="bg-red-300 p-2 mx-1 rounded-lg hover:cursor-pointer hover:opacity-50"
                              onClick={() => {
                                 setProfilePicture(
                                    userData?.prefs.profilePicture || "/blank-dp.png"
                                 );
                                 setEditProfilePic(false);
                              }}
                           >
                              close
                           </button>
                        </div>
                     </div>
                  )}
               </form>
               <div className="flex flex-col items-center mb-6">
                  <div className="my-6">
                     <form
                        key={2}
                        onSubmit={handleSubmitName(onNameUpdate)}
                        className={`p-2 my-1 ${editName && "shadow-lg rounded-lg"}`}
                     >
                        <div className="flex items-center justify-between">
                           <h2 className="text-lg font-semibold ml-2">Name:</h2>
                           {!editName && (
                              <img
                                 src="edit-icon.png"
                                 alt="Profile"
                                 className="w-4 h-4 hover:cursor-pointer hover:opacity-50"
                                 onClick={() => {
                                    setEditName(true);
                                 }}
                              />
                           )}
                        </div>
                        <Input
                           className="text-xl font-normal"
                           readOnly={!editName}
                           {...registerName("name", { required: true })}
                        />
                        {editName && (
                           <div className="flex flex-col items-center m-2">
                              <div className="flex">
                                 <button
                                    type="submit"
                                    className="bg-green-300 p-2 mx-1 rounded-lg hover:cursor-pointer hover:opacity-50"
                                 >
                                    Save
                                 </button>
                                 <button
                                    className="bg-red-300 p-2 mx-1 rounded-lg hover:cursor-pointer hover:opacity-50"
                                    type="button"
                                    onClick={() => {
                                       setEditName(false);
                                    }}
                                 >
                                    close
                                 </button>
                              </div>
                           </div>
                        )}
                     </form>
                     <form
                        key={3}
                        onSubmit={handleSubmitEmail(onEmailUpdate)}
                        className={`p-2 my-1 ${editEmail && "shadow-lg rounded-lg"}`}
                     >
                        <div className="flex items-center justify-between">
                           <h2 className="text-lg font-semibold ml-2">
                              Email :{" "}
                              {!userData?.emailVerification && (
                                 <Link
                                    onClick={verifyEmail}
                                    className="text-green-600 hover:underline"
                                 >
                                    Verify
                                 </Link>
                              )}{" "}
                           </h2>
                           {!editEmail && (
                              <img
                                 src="edit-icon.png"
                                 alt="Profile"
                                 className="w-4 h-4 hover:cursor-pointer hover:opacity-50"
                                 onClick={() => {
                                    setEditEmail(true);
                                 }}
                              />
                           )}
                        </div>
                        <Input
                           className="text-xl font-normal"
                           readOnly={!editEmail}
                           {...registerEmail("email", { required: true })}
                        />
                        <h2
                           className="text-base text-red-700 font-medium ml-2 hidden"
                           ref={emailVerificationMessage}
                        >
                           Check your email for email verification
                        </h2>
                        {editEmail && (
                           <div>
                              <h2 className="text-lg font-semibold ml-2">Password:</h2>
                              <Input
                                 className="text-xl font-normal"
                                 type="password"
                                 {...registerEmail("password", { required: true })}
                              />
                           </div>
                        )}
                        {editEmail && (
                           <div className="flex flex-col items-center m-2">
                              <div className="flex">
                                 <button
                                    type="submit"
                                    className="bg-green-300 p-2 mx-1 rounded-lg hover:cursor-pointer hover:opacity-50"
                                 >
                                    Save
                                 </button>
                                 <button
                                    className="bg-red-300 p-2 mx-1 rounded-lg hover:cursor-pointer hover:opacity-50"
                                    onClick={() => {
                                       setEditEmail(false);
                                    }}
                                 >
                                    close
                                 </button>
                              </div>
                           </div>
                        )}
                     </form>
                     <form
                        key={4}
                        onSubmit={handleSubmitPhone(onPhoneUpdate)}
                        className={`p-2 my-1 ${editPhone && "shadow-lg rounded-lg"}`}
                     >
                        <div className="flex items-center justify-between">
                           <h2 className="text-lg font-semibold ml-2">
                              Phone :{" "}
                              {!userData?.phoneVerification && (
                                 <Link className="text-green-600 hover:underline">
                                    Verify
                                 </Link>
                              )}
                           </h2>
                           {!editPhone && (
                              <img
                                 src="edit-icon.png"
                                 alt="Profile"
                                 className="w-4 h-4 hover:cursor-pointer hover:opacity-50"
                                 onClick={() => {
                                    setEditPhone(true);
                                 }}
                              />
                           )}
                        </div>
                        <Input
                           className="text-xl font-normal"
                           readOnly={!editPhone}
                           {...registerPhone("phone", { required: true })}
                        />
                        {editPhone && (
                           <div>
                              <h2 className="text-lg font-semibold ml-2">Password:</h2>
                              <Input
                                 className="text-xl font-normal"
                                 type="password"
                                 {...registerPhone("password", { required: true })}
                              />
                           </div>
                        )}
                        {editPhone && (
                           <div className="flex flex-col items-center m-2">
                              <div className="flex">
                                 <button
                                    type="submit"
                                    className="bg-green-300 p-2 mx-1 rounded-lg hover:cursor-pointer hover:opacity-50"
                                 >
                                    Save
                                 </button>
                                 <button
                                    className="bg-red-300 p-2 mx-1 rounded-lg hover:cursor-pointer hover:opacity-50"
                                    onClick={() => {
                                       setEditPhone(false);
                                    }}
                                 >
                                    close
                                 </button>
                              </div>
                           </div>
                        )}
                     </form>
                     <form
                        key={5}
                        onSubmit={handleSubmitPassword(onPasswordUpdate)}
                        className={`p-2 my-1 ${editPhone && "shadow-lg rounded-lg"}`}
                     >
                        <div className="flex items-center justify-between">
                           <h2 className="text-lg font-semibold ml-2">
                              {editPassword ? "Old Password :" : "Password :"}
                           </h2>
                           {!editPassword && (
                              <img
                                 src="edit-icon.png"
                                 alt="Profile"
                                 className="w-4 h-4 hover:cursor-pointer hover:opacity-50"
                                 onClick={() => {
                                    setEditPassword(true);
                                 }}
                              />
                           )}
                        </div>
                        <Input
                           className="text-xl font-normal"
                           readOnly={!editPassword}
                           value={editPassword ? "" : "********"}
                           {...registerPassword("OldPassword", { required: true })}
                        />
                        {editPassword && (
                           <div>
                              <h2 className="text-lg font-semibold ml-2">Password:</h2>
                              <Input
                                 className="text-xl font-normal"
                                 type="password"
                                 value=""
                                 {...registerPassword("newPassword", { required: true })}
                              />
                           </div>
                        )}
                        {editPassword && (
                           <div className="flex flex-col items-center m-2">
                              <div className="flex">
                                 <button
                                    type="submit"
                                    className="bg-green-300 p-2 mx-1 rounded-lg hover:cursor-pointer hover:opacity-50"
                                 >
                                    Save
                                 </button>
                                 <button
                                    className="bg-red-300 p-2 mx-1 rounded-lg hover:cursor-pointer hover:opacity-50"
                                    onClick={() => {
                                       setEditPassword(false);
                                    }}
                                 >
                                    close
                                 </button>
                              </div>
                           </div>
                        )}
                     </form>
                  </div>
               </div>
            </div>
         </Container>
      </div>
   );
}

export default Profile;
