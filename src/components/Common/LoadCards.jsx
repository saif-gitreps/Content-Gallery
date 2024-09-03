import { ErrorMessage, Loader, PostCard } from "..";

function LoadCards({ posts, isFetching, error, isFetchingNextPage, hasNextPage }) {
   return (
      <>
         {posts?.length > 0 ? (
            <>
               <h1 className="text-center">
                  {!isFetching && posts?.length === 0 && <p>No posts available.</p>}
               </h1>
               <div className="masonry-grid">
                  {posts.map((post) => {
                     return (
                        <div key={post?.$id} className="masonry-item">
                           <PostCard
                              $id={post?.$id}
                              title={post?.title}
                              featuredImage={post?.featuredImage}
                           />
                        </div>
                     );
                  })}
               </div>
            </>
         ) : (
            isFetching && <Loader />
         )}
         {error && <ErrorMessage error={error} />}
         {isFetchingNextPage && <Loader />}
         {!hasNextPage && !isFetching && (
            <p className="text-center mt-10">No more posts.</p>
         )}
      </>
   );
}

export default LoadCards;
