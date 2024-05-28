import { PostCard } from "../components";

function LoadCards({ posts }) {
   return (
      <>
         <h1 className="text-center">
            {posts.length === 0 && <p>No posts available.</p>}
         </h1>
         <div className="masonry-grid">
            {posts.map((post) => {
               return (
                  <div key={post.$id} className="masonry-item">
                     <PostCard
                        $id={post.$id}
                        title={post.title}
                        featuredImage={post.featuredImage}
                     />
                  </div>
               );
            })}
         </div>
      </>
   );
}

export default LoadCards;
