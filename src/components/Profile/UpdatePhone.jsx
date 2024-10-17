import { useSelector } from "react-redux";
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Input, SaveAndCancelDiv, LoaderMini, Button, ErrorMessage } from "..";
import authService from "../../appwrite/auth";
import Pencil from "./Pencil";
import { toast } from "react-toastify";

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
         toast.success("Phone updated successfully");
      },
      onError: (error) => toast.error("Something went wrong while updating phone"),
   });

   const updatePhone = (data) => {
      updatePhoneMutation.mutate(data);
   };

   const verifyPhoneMutation = useMutation({
      mutationFn: async () => await authService.createPhoneVerification(),
      onError: (error) =>
         toast.error("Something went wrong while sending SMS verification"),
      onSuccess: () =>
         toast.success(
            "SMS Verification code sent to your phone, please check your phone"
         ),
   });

   const verifyPhone = () => {
      verifyPhoneMutation.mutate();
   };

   const confirmPhoneVerificationMutation = useMutation({
      mutationFn: async (code) =>
         await authService.confirmPhoneVerification(userData?.$id, code),
      onError: (error) => toast.error("Something went wrong while verifying phone"),
      onSuccess: () => toast.success("Phone verified successfully"),
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
                  {!userData?.phoneVerification && userData?.phone && (
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
               readOnly={!editPhone}
               {...registerPhone("phone", { required: "Phone number is required." })}
            />
            {editPhone && (
               <div>
                  <h2 className="text-lg font-medium">Password:</h2>
                  <Input
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
                     <SaveAndCancelDiv
                        cancel={() => {
                           setEditPhone(false);
                           reset();
                        }}
                     />
                  )}
               </div>
            )}
            {phoneErrors.phone && <ErrorMessage error={phoneErrors.phone.message} />}
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
                  <SaveAndCancelDiv
                     cancel={() => {
                        setEnableVerificationField(false);
                     }}
                  />
               )}
               {verificationErrors?.verificationCode && (
                  <ErrorMessage error={verificationErrors.verificationCode.message} />
               )}
            </form>
         )}
      </div>
   );
}

export default UpdatePhone;
