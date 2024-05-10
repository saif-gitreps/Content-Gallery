import { useSelector, useDispatch } from "react-redux";
import { update } from "../../store/authSlice";
import { Input, SaveAndCancelDiv, Pencil } from "../index";
import { useState, useRef } from "react";
import authService from "../../appwrite/auth";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

function UpdatePhone() {
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

   const phoneVerificationDiv = useRef(null);

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
      }
   };
   return (
      <form
         onSubmit={handleSubmitPhone(onPhoneUpdate)}
         className={`p-2 my-1 ${editPhone && "shadow-lg rounded-lg"}`}
      >
         <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold ml-2">
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
   );
}

export default UpdatePhone;
