import { useState, useEffect } from "react";
import { Container, PostCard, Loader } from "../components";
import appwriteService from "../appwrite/config-appwrite";

function Home() {
   const [posts, setPosts] = useState(null);
   const [loading, setLoading] = useState(true);
   useEffect(() => {
      appwriteService
         .getPosts()
         .then((posts) => {
            if (posts) {
               setPosts(posts.documents);
               setLoading(false);
            }
         })
         .catch((error) => {
            console.log(error);
         });
   }, []);

   if (loading) {
      return <Loader />;
   }
   return (
      <div className="w-full py-8">
         <Container>
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
         </Container>
      </div>
   );
}

export default Home;
