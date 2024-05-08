import { useSelector, useDispatch } from "react-redux";
import { update } from "../../store/authSlice";
import { Input, SaveAndCancelDiv } from "../index";
import { useState, useRef } from "react";
import authService from "../../appwrite/auth";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

function UpdateEmail() {
   const [editEmail, setEditEmail] = useState(false);
   const userData = useSelector((state) => state.auth.userData);
   const dispatch = useDispatch();

   const { register: registerEmail, handleSubmit: handleSubmitEmail } = useForm({
      defaultValues: {
         email: userData?.email || "",
         password: "",
      },
   });

   const emailVerificationMessage = useRef(null);

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
   return (
      <form
         key={3}
         onSubmit={handleSubmitEmail(onEmailUpdate)}
         className={`p-2 my-1 ${editEmail && "shadow-lg rounded-lg"}`}
      >
         <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold ml-2">
               Email :{" "}
               {!userData?.emailVerification && (
                  <Link onClick={verifyEmail} className="text-green-600 hover:underline">
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
   );
}

export default UpdateEmail;