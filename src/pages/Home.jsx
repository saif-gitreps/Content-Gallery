import { Container, LoadCards } from "../components";
import { Query } from "appwrite";
import appwriteService from "../appwrite/config-appwrite";
import { Loader, ErrorMessage } from "../components";
import useInfinitePosts from "../hooks/useInfinityPost";

function Home() {
   const queryFn = async ({ pageParam = 0 }) =>
      await appwriteService.getPosts([Query.equal("status", "active")], pageParam, 5);

   const { allPosts, error, isFetching, isFetchingNextPage, hasNextPage } =
      useInfinitePosts(["posts"], queryFn);

   return (
      <Container className="max-w-7xl">
         <LoadCards
            posts={allPosts}
            isFetching={isFetching}
            error={error}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
         />
      </Container>
   );
}

export default Home;
