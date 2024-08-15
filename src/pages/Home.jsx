import { Container, LoadCards, ParentContainer } from "../components";
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
      <ParentContainer>
         <Container className="max-w-7xl">
            {allPosts?.length > 0 ? (
               <LoadCards posts={allPosts} />
            ) : (
               isFetching && <Loader />
            )}
            {error && <ErrorMessage error={error} />}
            {isFetchingNextPage && <Loader />} {/* Show loader when fetching next page */}
            {!hasNextPage && allPosts?.length >= 0 && (
               <p className="text-center mt-10">No more posts.</p>
            )}
         </Container>
      </ParentContainer>
   );
}

export default Home;
