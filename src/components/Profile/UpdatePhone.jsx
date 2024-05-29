import { useSelector, useDispatch } from "react-redux";
import { update } from "../../store/authSlice";
import { Input, SaveAndCancelDiv, Pencil } from "../index";
import { useState, useRef } from "react";
import authService from "../../appwrite/auth";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

function UpdatePhone({ setErrorMessage }) {
   const [editPhone, setEditPhone] = useState(false);
   const userData = useSelector((state) => state.auth.userData);
   const dispatch = useDispatch();
   const { register: registerPhone, handleSubmit: handleSubmitPhone } = useForm({
      defaultValues: {
         phone: userData?.phone || "",
         password: "",
      },
   });

   const onPhoneUpdate = async (data) => {
      try {
         setErrorMessage(false);
         const updatedUserData = { ...userData };
         updatedUserData.phone = data.phone;

         const result = await authService.updatePhone(data.phone, data.password);

         if (result) {
            dispatch(update({ updatedUserData }));
            setEditPhone(false);
         } else {
            setErrorMessage(true);
         }
      } catch (error) {
         console.log("Phone Update Error", error);
      }
   };

   const phoneVerificationDiv = useRef(null);

   const verifyPhone = async () => {
      try {
         if (userData.phone) {
            setErrorMessage(false);
            const result = await authService.createPhoneVerification();
            if (result) {
               phoneVerificationDiv.current.classList.remove("hidden");
            } else {
               phoneVerificationDiv.current.classList.remove("hidden");
               setErrorMessage(true);
            }
         }
      } catch (error) {
         console.log("Phone Verification Error", error);
      }
   };

   const connfirmPhoneVerification = async () => {
      try {
         setErrorMessage(false);
         const confirmInput = phoneVerificationDiv.current.querySelector("input").value;
         const result = await authService.confirmPhoneVerification(
            userData.$id,
            confirmInput
         );
         if (result) {
            phoneVerificationDiv.current.classList.add("hidden");
         } else {
            phoneVerificationDiv.current.classList.add("hidden");
            setErrorMessage(true);
         }
      } catch (error) {
         phoneVerificationDiv.current.querySelector("h2").textContent =
            "Phone confirmation failed, Please try again.";
      }
   };
   return (
      <form
         onSubmit={handleSubmitPhone(onPhoneUpdate)}
         className={`p-2 ${editPhone && "shadow-lg rounded-lg"}`}
      >
         <div className="flex items-center justify-between">
            <h2 className="text-sm md:text-base font-semibold ml-2">
               Phone :{" "}
               {!userData?.phoneVerification && (
                  <Link className="text-green-600 hover:underline" onClick={verifyPhone}>
                     Verify
                  </Link>
               )}
            </h2>
            {!editPhone && (
               <Pencil
                  onClickAction={() => {
                     setEditPhone(true);
                  }}
               />
            )}
         </div>
         <Input
            className="text-sm md:text-base font-normal w-64"
            readOnly={!editPhone}
            {...registerPhone("phone", { required: true })}
         />
         <div ref={phoneVerificationDiv} className="hidden">
            <h2 className="text-base text-red-700 font-medium ml-2">
               Check the verification SMS on your Phone.
            </h2>
            <Input className="text-sm md:text-base font-normal w-64" type="Number" />
            <SaveAndCancelDiv
               save={connfirmPhoneVerification}
               cancel={() => {
                  phoneVerificationDiv.current.classList.add("hidden");
               }}
            />
         </div>
         {editPhone && (
            <div>
               <h2 className="text-sm md:text-base font-semibold ml-2">Password:</h2>
               <Input
                  className="text-sm md:text-base font-normal w-64"
                  type="password"
                  {...registerPhone("password", { required: true })}
               />
               <SaveAndCancelDiv
                  cancel={() => {
                     setEditPhone(false);
                     setErrorMessage(false);
                  }}
               />
            </div>
         )}
      </form>
   );
}

export default UpdatePhone;
