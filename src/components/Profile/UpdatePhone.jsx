import { useSelector } from "react-redux";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import authService from "../../appwrite/auth";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Input, SaveAndCancelDiv, Pencil, LoaderMini, ErrorMessage } from "../index";

function UpdatePhone() {
   const [editPhone, setEditPhone] = useState(false);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const userData = useSelector((state) => state.auth.userData);
   const { register, handleSubmit, reset } = useForm({
      defaultValues: {
         phone: userData?.phone || "",
         password: "",
      },
   });

   const phoneVerificationDiv = useRef(null);

   const updatePhoneMutation = useMutation({
      mutationFn: async (data) => {
         const result = await authService.updatePhone(data.phone, data.password);
         if (!result) {
            throw new Error("Error updating phone. Try again later.");
         }
         return result;
      },
      onError: (error) => {
         setError(error);
         setLoading(false);
      },
      onSuccess: () => {
         setEditPhone(false);
         setError("");
         setLoading(false);
         reset({ password: "" });
      },
   });

   const updatePhone = async (data) => {
      setError("");
      setLoading(true);
      updatePhoneMutation.mutate(data);
   };

   const verifyPhoneMutation = useMutation({
      mutationFn: async () => {
         const result = await authService.createPhoneVerification();
         if (!result) {
            throw new Error("Error sending phone verification");
         }
      },
      onError: (error) => {
         phoneVerificationDiv.current.querySelector("h2").textContent = error;
      },
      onSuccess: () => {
         phoneVerificationDiv.current.classList.remove("hidden");
      },
   });

   const verifyPhone = async () => {
      setError("");
      verifyPhoneMutation.mutate();
   };

   const confirmPhoneVerificationMutation = useMutation({
      mutationFn: async (code) => {
         const result = await authService.confirmPhoneVerification(userData.$id, code);
         if (!result) {
            throw new Error("Error verifying phone or invalid code. Try again.");
         }
         return result;
      },
      onError: (error) => {
         phoneVerificationDiv.current.classList.remove("hidden");
         phoneVerificationDiv.current.querySelector("h2").textContent = error;
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
         className={`p-2 ${editPhone ? "shadow-lg rounded-lg" : ""}`}
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
            {!editPhone && <Pencil onClickAction={() => setEditPhone(true)} />}
         </div>
         <Input
            className="text-sm md:text-base font-normal w-64"
            readOnly={!editPhone}
            {...register("phone", { required: true })}
         />
         <div ref={phoneVerificationDiv} className="hidden">
            <h2 className="text-base text-center text-red-600 font-medium  w-48">
               Check the verification SMS on your Phone.
            </h2>
            <Input className="text-sm md:text-base font-normal w-64" type="number" />
            <SaveAndCancelDiv
               save={confirmPhoneVerification}
               cancel={() => phoneVerificationDiv.current.classList.add("hidden")}
            />
         </div>
         {editPhone && (
            <div>
               <h2 className="text-sm md:text-base font-semibold ml-2">Password:</h2>
               <Input
                  className="text-sm md:text-base font-normal w-64"
                  type="password"
                  {...register("password", { required: true })}
               />
               {loading ? (
                  <div className="flex justify-center items-center mt-2">
                     <LoaderMini />
                  </div>
               ) : (
                  <SaveAndCancelDiv
                     save={() => handleSubmit(onPhoneUpdate)}
                     cancel={() => {
                        setEditPhone(false);
                        setError("");
                        reset();
                     }}
                  />
               )}
            </div>
         )}
         <ErrorMessage error={error} />
      </form>
   );
}

export default UpdatePhone;
