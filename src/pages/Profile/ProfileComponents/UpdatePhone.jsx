import { useSelector } from "react-redux";
import { useState, useRef, useContext } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Input, SaveAndCancelDiv, LoaderMini } from "../../../components";
import authService from "../../../appwrite/auth";
import { ErrorContext } from "../../../context/ErrorContext";
import Pencil from "./Pencil";

function UpdatePhone() {
   const [editPhone, setEditPhone] = useState(false);
   const [loading, setLoading] = useState(false);
   const { setError } = useContext(ErrorContext);
   const userData = useSelector((state) => state.auth.userData);
   const { register, handleSubmit, reset } = useForm({
      defaultValues: {
         phone: userData?.phone || "",
         password: "",
      },
   });

   const phoneVerificationDiv = useRef(null);

   const updatePhoneMutation = useMutation({
      mutationFn: async (data) =>
         await authService.updatePhone(data.phone, data.password),
      onError: () => {
         setError("Failed to update phone. Try again later.");
         setLoading(false);
      },
      onSuccess: () => {
         setEditPhone(false);
         setError("");
         setLoading(false);
         reset({ password: "" });
      },
   });

   const updatePhone = (data) => {
      setError("");
      setLoading(true);
      updatePhoneMutation.mutate(data);
   };

   const verifyPhoneMutation = useMutation({
      mutationFn: async () => await authService.createPhoneVerification(),
      onError: () => {
         phoneVerificationDiv.current.querySelector("h2").textContent =
            "Failed to send SMS. Try again later.";
      },
      onSuccess: () => {
         phoneVerificationDiv.current.classList.remove("hidden");
      },
   });

   const verifyPhone = () => {
      setError("");
      verifyPhoneMutation.mutate();
   };

   const confirmPhoneVerificationMutation = useMutation({
      mutationFn: async (code) =>
         await authService.confirmPhoneVerification(userData?.$id, code),
      onError: () => {
         phoneVerificationDiv.current.classList.remove("hidden");
         phoneVerificationDiv.current.querySelector("h2").textContent =
            "Something went wrong or Invalid code. Try again.";
      },
      onSuccess: () => {
         phoneVerificationDiv.current.classList.add("hidden");
      },
   });

   const confirmPhoneVerification = async () => {
      setError("");
      confirmPhoneVerificationMutation.mutate(
         phoneVerificationDiv.current.querySelector("input").value
      );
   };

   return (
      <form
         onSubmit={handleSubmit(updatePhone)}
         className={`p-4 dark:bg-gray-800 rounded-lg`}
      >
         <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">
               Phone :{" "}
               {!userData?.phoneVerification && (
                  <Link
                     className="text-green-600 hover:underline ml-1"
                     onClick={verifyPhone}
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
            {...register("phone", { required: true })}
         />

         <div ref={phoneVerificationDiv} className="hidden space-y-2">
            <h2 className="text-base text-center text-red-600 font-medium w-full sm:w-48">
               Check the verification SMS on your Phone.
            </h2>
            <Input
               className="text-base font-normal w-full  bg-white dark:bg-gray-700 border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
               type="number"
            />
            <SaveAndCancelDiv
               save={confirmPhoneVerification}
               cancel={() => phoneVerificationDiv.current.classList.add("hidden")}
            />
         </div>

         {editPhone && (
            <div className="">
               <h2 className="text-lg font-medium">Password:</h2>
               <Input
                  className="text-base font-normal w-full bg-white dark:bg-gray-700 border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  type="password"
                  {...register("password", { required: true })}
               />
               {loading ? (
                  <div className="flex justify-center items-center mt-2">
                     <LoaderMini />
                  </div>
               ) : (
                  <div className="flex justify-end space-x-4">
                     <SaveAndCancelDiv
                        save={() => handleSubmit(onPhoneUpdate)}
                        cancel={() => {
                           setEditPhone(false);
                           setError("");
                           reset();
                        }}
                     />
                  </div>
               )}
            </div>
         )}
      </form>
   );
}

export default UpdatePhone;
