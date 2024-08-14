import {
   Container,
   UpdateProfilePic,
   ErrorMessage,
   ParentContainer,
   LoadCards,
   Loader,
   Button,
} from "../components";
import { Query } from "appwrite";
import appwriteService from "../appwrite/config-appwrite";
import appwriteUserService from "../appwrite/config-user";
import { useSelector } from "react-redux";
import useInfinitePosts from "../hooks/useInfinityPost";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

function Profile() {
   const userDataFromStore = useSelector((state) => state.auth.userData);
   const { id } = useParams();
   const navigate = useNavigate();

   const {
      data: user,
      error: userDataError,
      isLoading: userDataLoading,
   } = useQuery({
      queryKey: ["userProfile", id],
      queryFn: async () => {
         return await appwriteUserService.getUserProfile(id);
      },
      enabled: !!id,
   });

   const queryFn = async ({ pageParam = 0 }) =>
      await appwriteService.getPosts([Query.equal("userId", id)], pageParam, 5);

   const { allPosts, error, isFetching } = useInfinitePosts(
      ["myPosts", id],
      queryFn,
      !!id
   );

   return (
      <ParentContainer>
         <Container className="space-y-5 max-w-7xl">
            <div className="bg-white dark:bg-black p-10 rounded-2xl">
               <h1 className="text-2xl font-bold text-center mb-4">Profile</h1>
               {userDataError && <ErrorMessage error={userDataError} />}
               {userDataLoading && !userDataError ? (
                  <Loader />
               ) : (
                  <div className="flex lg:flex-row flex-col space-x-7">
                     <img
                        src={user.profilePicture || "/blank-dp.png"}
                        alt="Profile Picture"
                        className="w-56 h-56 rounded-full"
                     />
                     <div className="max-w-3xl xl:max-w-full mt-3 space-y-3">
                        <h1 className="text-3xl font-semibold">{user.name}</h1>
                        <p className="text-lg font-medium text-gray-700 dark:bg-gray-400">
                           {user.bio}
                        </p>
                        {userDataFromStore?.$id === user.$id && (
                           <Button
                              text={"Edit profile"}
                              bgNumber={1}
                              className="w-28"
                              onClick={() => navigate("/edit-profile")}
                           />
                        )}
                     </div>
                  </div>
               )}
            </div>
            <h1 className="text-2xl font-bold text-center">My posts</h1>
            {!isFetching && <LoadCards posts={allPosts} />}
            <ErrorMessage error={error} />
            {isFetching && <Loader />}
         </Container>
      </ParentContainer>
   );
}

export default Profile;
