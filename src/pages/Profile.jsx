import { useSelector, useDispatch } from "react-redux";
import { update } from "../store/authSlice";
import { Loader, Container, Input, Button } from "../components";
import { useEffect, useState } from "react";
import appwriteService from "../appwrite/config-appwrite";
import { useForm } from "react-hook-form";

function Profile() {
   const [profilePicture, setProfilePicture] = useState("/blank-dp.png");
   const userData = useSelector((state) => state.auth.userData);
   const [isEditable, setIsEditable] = useState(false);
   const dispatch = useDispatch();

   const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
   };

   const { register, handleSubmit } = useForm({
      defaultValues: {
         name: userData?.name || "",
         email: userData?.email || "",
         password:
            userData && userData.password ? formatDate(userData.passwordUpdate) : "",
         phone: userData?.phone || "",
      },
   });

   useEffect(() => {
      async () => {
         if (userData.profilePicture) {
            setProfilePicture(
               await appwriteService
                  .getFilePrev(userData.profilePicture)
                  .then((res) => res)
                  .catch(() => "/blank-dp.png")
            );
         }
      };
   }, [userData.profilePicture]);

   const onSave = async (data) => {
      const file = data.profilePicture[0]
         ? await appwriteService.uploadFile(data.profilePicture[0])
         : null;

      if (file) {
         appwriteService.deleteFile(userData.profilePicture);
      }

      const dbUser = await appwriteService.updateUser({
         ...data,
         profilePicture: file ? file.$id : undefined,
      });

      if (dbUser) {
         dispatch(update({ dbUser }));
         setIsEditable(false);
      }
   };

   return (
      <div className="py-8">
         <Container>
            <div className="flex flex-col items-center bg-white max-w-xl m-auto rounded-lg">
               <h1 className="text-3xl font-semibold mt-8">Profile</h1>
               <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-32 h-32 rounded-full"
               />

               {isEditable ? (
                  <form onSubmit={handleSubmit(onSave)}>
                     <Input
                        label="Profile Picture:"
                        type="file"
                        {...register("profilePicture")}
                     />
                     <Input
                        label="Name:"
                        placeholder={userData?.name}
                        type="text"
                        {...register("name", { required: true })}
                     />
                     <Input
                        label="Email:"
                        placeholder={userData?.email}
                        type="email"
                        {...register("email", { required: true })}
                     />
                     <Input
                        label="Password:"
                        placeholder={""}
                        type="password"
                        {...register("password", { required: true })}
                     />
                     <Input
                        label="Phone:"
                        type="tel"
                        placeholder={userData?.phone || ""}
                        {...register("name", { required: true })}
                     />
                     <Button
                        className="text-xl  bg-green-400 duration-300 hover:shadow-md hover:bg-green-100 rounded-xl"
                        type="submit"
                     >
                        Save
                     </Button>
                     <Button
                        className="text-xl  bg-red-400 duration-300 hover:shadow-md hover:bg-red-100 rounded-xl"
                        onClick={() => setIsEditable(!isEditable)}
                     >
                        Cancel
                     </Button>
                  </form>
               ) : (
                  <div className="flex flex-col items-center my-6">
                     <div className="my-6">
                        <h2 className="text-xl font-semibold mt-4">
                           <span className="text-blue-900">Name: </span>
                           {userData.name}
                        </h2>
                        <p className="text-xl font-semibold mt-42">
                           <span className="text-blue-900">Email: </span>{" "}
                           {userData.email +
                              `${
                                 userData.emailVerification
                                    ? " (Verified)"
                                    : " (Not Verified)"
                              }`}
                        </p>
                        <p className="text-xl font-semibold mt-42">
                           <span className="text-blue-900">Password: </span> Last updated
                           on {formatDate(userData.passwordUpdate)}
                        </p>
                        <p className="text-xl font-semibold mt-42">
                           <span className="text-blue-900">Phone: </span>
                           {userData.phone
                              ? userData.phone +
                                `${
                                   userData.phoneVerification
                                      ? " (Verified)"
                                      : " (Not verified)"
                                }`
                              : "Not provided"}
                        </p>
                     </div>
                     <Button
                        className="text-xl  bg-green-400 duration-300 hover:shadow-md hover:bg-green-100 rounded-xl"
                        onClick={() => setIsEditable(!isEditable)}
                     >
                        Edit profile
                     </Button>
                  </div>
               )}
            </div>
         </Container>
      </div>
   );
}

export default Profile;
