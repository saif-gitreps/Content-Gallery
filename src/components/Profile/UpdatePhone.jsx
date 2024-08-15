import { useSelector } from "react-redux";
import { useState, useRef, useContext } from "react";
import { useForm } from "react-hook-form";
import authService from "../../appwrite/auth";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ErrorContext } from "../../context/ErrorContext";
import { Input, SaveAndCancelDiv, Pencil, LoaderMini, ErrorMessage } from "../index";

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
         await authService.confirmPhoneVerification(userData.$id, code),
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
         className={`p-2 ${editPhone ? "shadow-lg rounded-lg" : ""}`}
      >
         <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold ml-2">
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
            className="text-base font-normal w-64"
            readOnly={!editPhone}
            {...register("phone", { required: true })}
         />
         <div ref={phoneVerificationDiv} className="hidden">
            <h2 className="text-base text-center text-red-600 font-medium  w-48">
               Check the verification SMS on your Phone.
            </h2>
            <Input className="text-base font-normal w-64" type="number" />
            <SaveAndCancelDiv
               save={confirmPhoneVerification}
               cancel={() => phoneVerificationDiv.current.classList.add("hidden")}
            />
         </div>
         {editPhone && (
            <div>
               <h2 className="text-base font-semibold ml-2">Password:</h2>
               <Input
                  className="text-base font-normal w-64"
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
      </form>
   );
}

export default UpdatePhone;
