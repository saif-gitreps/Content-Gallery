import { useState, useEffect } from "react";
import { Container, PostCard, Loader } from "../components";
import appwriteService from "../appwrite/config-appwrite";
import { useSelector } from "react-redux";

function MyPosts() {
   const [posts, setPosts] = useState(null);
   const [loading, setLoading] = useState(true);
   const userData = useSelector((state) => state.auth.userData);

   useEffect(() => {
      if (userData) {
         appwriteService
            .getUserPosts(userData.$id)
            .then((posts) => {
               if (posts) {
                  setPosts(posts.documents);
                  setLoading(false);
               }
            })
            .catch((error) => {
               console.log(error);
            });
      }
   }, [userData]);

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

export default MyPosts;
