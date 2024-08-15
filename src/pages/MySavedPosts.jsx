import {
   Container,
   PostCard,
   ParentContainer,
   ErrorMessage,
   Loader,
} from "../components";
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
      <ParentContainer>
         <Container className="max-w-7xl">
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
            {error && <ErrorMessage error={error} />}
            {isFetchingNextPage && <Loader />}
            {!hasNextPage && allPosts?.length >= 0 && (
               <p className="text-center mt-10">No more posts.</p>
            )}
         </Container>
      </ParentContainer>
   );
}

export default MySavedPosts;
