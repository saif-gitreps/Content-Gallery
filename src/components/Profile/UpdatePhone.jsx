import { useSelector } from "react-redux";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import authService from "../../appwrite/auth";
import { Link } from "react-router-dom";
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

   const onPhoneUpdate = async (data) => {
      setError("");
      setLoading(true);
      try {
         const result = await authService.updatePhone(data.phone, data.password);
         if (!result) throw new Error();

         setEditPhone(false);
      } catch (error) {
         setError("Phone update error.");
      } finally {
         setLoading(false);
         reset({ password: "" });
      }
   };

   const verifyPhone = async () => {
      setError("");
      try {
         const result = await authService.createPhoneVerification();
         if (!result) throw new Error();

         phoneVerificationDiv.current.classList.remove("hidden");
      } catch (error) {
         phoneVerificationDiv.current.classList.remove("hidden");
         phoneVerificationDiv.current.querySelector("h2").textContent =
            "Phone verification error. Try Again.";
      }
   };

   const confirmPhoneVerification = async () => {
      setError("");
      try {
         const result = await authService.confirmPhoneVerification(
            userData.$id,
            phoneVerificationDiv.current.querySelector("input").value
         );
         if (!result) throw new Error();

         phoneVerificationDiv.current.classList.add("hidden");
      } catch (error) {
         phoneVerificationDiv.current.classList.remove("hidden");
         phoneVerificationDiv.current.querySelector("h2").textContent =
            "Invalid Code. Try Again.";
      }
   };

   return (
      <form
         onSubmit={handleSubmit(onPhoneUpdate)}
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
            <h2 className="text-base text-red-600 font-medium ml-2">
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
