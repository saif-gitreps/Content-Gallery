import { Container, LoadCards, ParentContainer } from "../components";
import { Query } from "appwrite";
import appwriteService from "../appwrite/config-appwrite";
import { Loader, ErrorMessage } from "../components";
import { useSelector } from "react-redux";
import useInfinitePosts from "../hooks/useInfinityPost";

function MyPosts() {
   const userData = useSelector((state) => state.auth.userData);

   const queryFn = async ({ pageParam = 0 }) =>
      await appwriteService.getPosts([Query.equal("userId", userData.$id)], pageParam, 5);

   const { allPosts, error, isFetching } = useInfinitePosts(
      ["myPosts", userData.$id],
      queryFn
   );

   return (
      <ParentContainer>
         <Container className="max-w-7xl">
            <LoadCards posts={allPosts} />
            <ErrorMessage error={error} />
            {isFetching && <Loader />}
         </Container>
      </ParentContainer>
   );
}

export default MyPosts;
