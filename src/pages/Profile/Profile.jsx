import { ErrorMessage, Container, LoadCards, Loader, Button } from "../../components";
import { Query } from "appwrite";
import appwriteService from "../../appwrite/config-appwrite";
import appwriteUserService from "../../appwrite/config-user";
import { useSelector } from "react-redux";
import useInfinitePosts from "../../hooks/useInfinityPost";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LazyLoadImage } from "react-lazy-load-image-component";

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

   const { allPosts, error, isFetching, isFetchingNextPage, hasNextPage } =
      useInfinitePosts(["myPosts", id], queryFn, { enabled: !!id });

   const isAuthor = userDataFromStore?.$id === user?.$id;

   const ProfileHeader = () => {
      return (
         <div className="bg-white dark:bg-black p-10 rounded-2xl">
            <h1 className="text-2xl font-bold text-center mb-4">Profile</h1>
            {userDataError && <ErrorMessage error={userDataError} />}
            {userDataLoading && !userDataError ? (
               <Loader />
            ) : (
               <div className="flex sm:flex-row flex-col space-x-7">
                  <LazyLoadImage
                     src={user?.profilePicture || "/blank-dp.png"}
                     alt="Profile Picture"
                     className="w-56 h-56 rounded-full"
                     effect="blur"
                     onError={(e) => (e.target.src = "/blank-dp.png.jpg")}
                  />
                  <div className="max-w-3xl xl:max-w-full mt-3 space-y-3">
                     <h1 className="text-3xl font-semibold">{user?.name}</h1>
                     <p className="text-lg font-medium text-gray-700 dark:text-gray-400">
                        {user?.bio}
                     </p>
                     {isAuthor && (
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
      );
   };

   const UserPosts = () => {
      return (
         <>
            <h1 className="text-2xl font-bold text-center">
               {isAuthor ? "My" : `${user?.name ?? "User"}'s`} posts
            </h1>
            <LoadCards
               posts={allPosts}
               isFetching={isFetching}
               error={error}
               isFetchingNextPage={isFetchingNextPage}
               hasNextPage={hasNextPage}
            />
         </>
      );
   };

   return (
      <Container className="space-y-5 max-w-7xl">
         <ProfileHeader />
         <UserPosts />
      </Container>
   );
}

export default Profile;
