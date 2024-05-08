import { useSelector, useDispatch } from "react-redux";
import { update } from "../store/authSlice";
import { Container, Input, UpdateProfilePic, SaveAndCancelDiv } from "../components";
import { useState, useRef } from "react";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

function Profile() {
   const [editName, setEditName] = useState(false);
   const [editEmail, setEditEmail] = useState(false);
   const [editPassword, setEditPassword] = useState(false);
   const [editPhone, setEditPhone] = useState(false);
   const userData = useSelector((state) => state.auth.userData);
   const dispatch = useDispatch();

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
   const phoneVerificationDiv = useRef(null);

   const verifyEmail = async () => {
      try {
         if (userData.email) {
            const result = await authService.createEmailVerification();
            if (result) {
               emailVerificationMessage.current.classList.remove("hidden");
            }
         }
      } catch (error) {
         console.log("Email Verification Error", error);
      }
   };

   const verifyPhone = async () => {
      try {
         if (userData.phone) {
            const result = await authService.createPhoneVerification();
            if (result) {
               phoneVerificationDiv.current.classList.remove("hidden");
            }
         }
      } catch (error) {
         console.log("Phone Verification Error", error);
      }
   };

   const connfirmPhoneVerification = async () => {
      try {
         const confirmInput = phoneVerificationDiv.current.querySelector("input").value;
         const result = await authService.confirmPhoneVerification(
            userData.$id,
            confirmInput
         );
         if (result) {
            phoneVerificationDiv.current.classList.add("hidden");
         }
      } catch (error) {
         phoneVerificationDiv.current.querySelector("h2").textContent =
            "Phone confirmation failed, Please try again.";
         console.log("Phone Verification Error", error);
      }
   };

   return (
      <div className="py-8">
         <Container>
            <div className="flex flex-col items-center bg-white max-w-xl m-auto rounded-xl shadow-md">
               <h1 className="text-3xl font-semibold mt-8">Profile</h1>
               <UpdateProfilePic />
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
                           <SaveAndCancelDiv
                              type="submit"
                              cancel={() => {
                                 setEditName(false);
                              }}
                           />
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
                              <SaveAndCancelDiv
                                 cancel={() => {
                                    setEditEmail(false);
                                 }}
                              />
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
                                 <Link
                                    className="text-green-600 hover:underline"
                                    onClick={verifyPhone}
                                 >
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
                        <div ref={phoneVerificationDiv} className="hidden">
                           <h2 className="text-base text-red-700 font-medium ml-2">
                              Check the verification SMS on your Phone.
                           </h2>
                           <Input className="text-xl font-normal" type="Number" />
                           <div className="flex justify-center items-center m-2">
                              <button
                                 className="bg-green-300 p-2 mx-1 rounded-lg hover:cursor-pointer hover:opacity-50"
                                 onClick={connfirmPhoneVerification}
                              >
                                 Confirm
                              </button>
                              <button
                                 className="bg-red-300 p-2 mx-1 rounded-lg hover:cursor-pointer hover:opacity-50"
                                 onClick={() => {
                                    phoneVerificationDiv.current.classList.add("hidden");
                                 }}
                              >
                                 close
                              </button>
                           </div>
                        </div>
                        {editPhone && (
                           <div>
                              <h2 className="text-lg font-semibold ml-2">Password:</h2>
                              <Input
                                 className="text-xl font-normal"
                                 type="password"
                                 {...registerPhone("password", { required: true })}
                              />
                              <SaveAndCancelDiv cancel={() => setEditPhone(false)} />
                           </div>
                        )}
                     </form>
                     <form
                        key={5}
                        onSubmit={handleSubmitPassword(onPasswordUpdate)}
                        className={`p-2 my-1 ${editPassword && "shadow-lg rounded-lg"}`}
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
                              <SaveAndCancelDiv
                                 cancel={() => {
                                    setEditPassword(false);
                                 }}
                              />
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
