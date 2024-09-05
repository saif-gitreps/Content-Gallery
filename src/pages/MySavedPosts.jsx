import { Container, PostCard, ErrorMessage, Loader } from "../components";
import appwriteService from "../appwrite/config-appwrite";
import { useSelector } from "react-redux";
import { Query } from "appwrite";
import useInfinitePosts from "../hooks/useInfinityPost";

function MySavedPosts() {
   const userData = useSelector((state) => state.auth.userData);

   const queryFn = async ({ pageParam = 0 }) =>
      await appwriteService.getSavedPosts(
         [Query.equal("userId", userData?.$id)],
         pageParam,
         5
      );

   const { allPosts, error, isFetching, isFetchingNextPage, hasNextPage } =
      useInfinitePosts(["savedPosts", userData?.$id], queryFn, {
         enabled: !!userData?.$id,
      });

   return (
      <Container className="max-w-7xl">
         <h1 className="text-center font-bold text-lg mb-4">My Saved Posts</h1>
         {allPosts?.length > 0 ? (
            <>
               <h1 className="text-center">
                  {allPosts?.length === 0 && <p>No posts available.</p>}
               </h1>
               <div className="masonry-grid">
                  {allPosts?.map((saved) => (
                     <div key={saved.articles.$id} className="masonry-item">
                        <PostCard
                           $id={saved.articles.$id}
                           title={saved.articles.title}
                           featuredImage={saved.articles.featuredImage}
                        />
                     </div>
                  ))}
               </div>
            </>
         ) : (
            isFetching && <Loader />
         )}
         {error && <ErrorMessage error={error.messages} />}
         {isFetchingNextPage && <Loader />}
         {!hasNextPage && !isFetching && (
            <p className="text-center mt-10">No more posts.</p>
         )}
      </Container>
   );
}

export default MySavedPosts;
