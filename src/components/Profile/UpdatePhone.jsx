import { useSelector } from "react-redux";
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Input, SaveAndCancelDiv, LoaderMini, Button, ErrorMessage } from "..";
import authService from "../../appwrite/auth";
import Pencil from "./Pencil";

function UpdatePhone() {
   const [editPhone, setEditPhone] = useState(false);
   const userData = useSelector((state) => state.auth.userData);
   const [enableVerificationField, setEnableVerificationField] = useState(false);
   const {
      register: registerPhone,
      handleSubmit: handleSubmitPhone,
      reset,
      formState: { errors: phoneErrors },
   } = useForm({
      defaultValues: {
         phone: userData?.phone || "",
         password: "",
      },
   });

   const {
      register: registerConfirmVerification,
      handleSubmit: handleSubmitConfirmVerification,
      setError,
      formState: { errors: verificationErrors },
   } = useForm({
      defaultValues: {
         verificationCode: "",
      },
   });

   const updatePhoneMutation = useMutation({
      mutationFn: async (data) =>
         await authService.updatePhone(data.phone, data.password),
      onSuccess: () => {
         setEditPhone(false);
         reset({ password: "" });
      },
      onError: (error) => {
         setError("phone", {
            message: error.message || "Failed to update phone number.",
         });
      },
   });

   const updatePhone = (data) => {
      updatePhoneMutation.mutate(data);
   };

   const verifyPhoneMutation = useMutation({
      mutationFn: async () => await authService.createPhoneVerification(),
      onError: (error) => {
         setError("verificationCode", { message: error.message });
      },
   });

   const verifyPhone = () => {
      verifyPhoneMutation.mutate();
   };

   const confirmPhoneVerificationMutation = useMutation({
      mutationFn: async (code) =>
         await authService.confirmPhoneVerification(userData?.$id, code),
      onError: (error) => {
         setError("verificationCode", { message: error.message });
      },
   });

   const confirmPhoneVerification = (data) => {
      confirmPhoneVerificationMutation.mutate(data.verificationCode);
   };

   return (
      <div className="p-2 dark:bg-gray-800 rounded-lg">
         <form onSubmit={handleSubmitPhone(updatePhone)}>
            <div className="flex items-center justify-between">
               <h2 className="text-lg font-medium">
                  Phone :{" "}
                  {!userData?.phoneVerification && (
                     <Link
                        className="text-green-600 hover:underline ml-1"
                        onClick={() => {
                           verifyPhone;
                           setEnableVerificationField(true);
                        }}
                     >
                        Verify
                     </Link>
                  )}
               </h2>
               {!editPhone && (
                  <Pencil
                     onClickAction={() => setEditPhone(true)}
                     className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer"
                  />
               )}
            </div>
            <Input
               className={`text-base font-normal w-full ${
                  editPhone ? "bg-white dark:bg-gray-700" : "bg-transparent"
               } border rounded-md p-2 focus:ring-2 focus:ring-blue-500`}
               readOnly={!editPhone}
               {...registerPhone("phone", { required: "Phone number is required." })}
            />
            {editPhone && (
               <div>
                  <h2 className="text-lg font-medium">Password:</h2>
                  <Input
                     className="text-base font-normal w-full bg-white dark:bg-gray-700 border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                     type="password"
                     {...registerPhone("password", { required: "Password is required." })}
                  />
                  {phoneErrors.password && (
                     <ErrorMessage error={phoneErrors.password.message} />
                  )}
                  {updatePhoneMutation?.isPending ? (
                     <div className="flex justify-center items-center mt-2">
                        <LoaderMini />
                     </div>
                  ) : (
                     <div className="flex justify-end space-x-4">
                        <SaveAndCancelDiv
                           cancel={() => {
                              setEditPhone(false);
                              setError("phone", { message: "" });
                              setError("verificationCode", { message: "" });
                              reset();
                           }}
                        />
                     </div>
                  )}
               </div>
            )}
            {phoneErrors.phone && <ErrorMessage error={phoneErrors.phone.message} />}
            {updatePhoneMutation.isError && (
               <ErrorMessage error="Error updating phone number, please try again." />
            )}
         </form>

         {enableVerificationField && (
            <form
               onSubmit={handleSubmitConfirmVerification(confirmPhoneVerification)}
               className="space-y-2"
            >
               <h2 className="text-base text-red-600 font-medium">
                  Check the verification SMS on your Phone.
               </h2>
               <Input
                  className="text-base font-normal bg-white dark:bg-gray-700 border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  type="number"
                  {...registerConfirmVerification("verificationCode", {
                     required: "Verification code is required.",
                  })}
               />
               {confirmPhoneVerificationMutation?.isPending ? (
                  <div className="flex justify-center items-center mt-2">
                     <LoaderMini />
                  </div>
               ) : (
                  <div className="flex justify-end space-x-4">
                     <SaveAndCancelDiv
                        cancel={() => {
                           setEnableVerificationField(false);
                        }}
                     />
                  </div>
               )}
               {verificationErrors?.verificationCode && (
                  <ErrorMessage error={verificationErrors.verificationCode.message} />
               )}
               {confirmPhoneVerificationMutation?.isError && (
                  <ErrorMessage error="Error verifying phone number, please try again." />
               )}
            </form>
         )}
      </div>
   );
}

export default UpdatePhone;
