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
import { useSelector } from "react-redux";
import useInfinitePosts from "../hooks/useInfinityPost";
import { useNavigate } from "react-router-dom";

function Profile() {
   const userData = useSelector((state) => state.auth.userData);
   const navigate = useNavigate();

   const queryFn = async ({ pageParam = 0 }) =>
      await appwriteService.getPosts([Query.equal("userId", userData.$id)], pageParam, 5);

   const { allPosts, error, isFetching } = useInfinitePosts(
      ["myPosts", userData.$id],
      queryFn
   );
   return (
      <ParentContainer>
         <Container className="space-y-5 max-w-7xl">
            <div className="bg-white dark:bg-black p-10 rounded-2xl">
               <h1 className="text-2xl font-bold text-center mb-4">Profile</h1>
               <div className="flex lg:flex-row flex-col justify-evenly items-center">
                  <UpdateProfilePic />
                  <div className="max-w-lg xl:max-w-4xl  space-y-3">
                     <h1 className="text-xl font-semibold">Name</h1>
                     <p className="text-lg font-medium">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure vel
                        impedit similique, dolore omnis cumque modi quae obcaecati soluta
                        quas quos amet beatae rerum. Praesentium explicabo magni quae
                        modi. Delectus. Lorem ipsum dolor sit amet consectetur adipisicing
                        elit. Maiores animi rem sapiente cumque dignissimos alias tenetur
                        officiis vitae ipsum similique placeat corporis, odio porro,
                        labore, corrupti beatae nostrum exercitationem temporibus.
                     </p>
                     <Button
                        text={"Edit profile"}
                        bgNumber={1}
                        className="w-28"
                        onClick={() => navigate("/edit-profile")}
                     />
                  </div>
               </div>
            </div>
            <h1 className="text-2xl font-bold text-center">My posts</h1>
            <LoadCards posts={allPosts} />
            <ErrorMessage error={error} />
            {isFetching && <Loader />}
         </Container>
      </ParentContainer>
   );
}

export default Profile;
