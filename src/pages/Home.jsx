import { Container, LoadCards, ParentContainer } from "../components";
import { Query } from "appwrite";
import appwriteService from "../appwrite/config-appwrite";
import { Loader, ErrorMessage } from "../components";
import useInfinitePosts from "../hooks/useInfinityPost";

function Home() {
   const queryFn = async ({ pageParam = 0 }) =>
      await appwriteService.getPosts([Query.equal("status", "active")], pageParam, 5);

   const { allPosts, error, isFetching } = useInfinitePosts(["posts"], queryFn);

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
export default Home;
