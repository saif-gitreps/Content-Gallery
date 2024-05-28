import { useState, useEffect } from "react";
import { Container, PostCard, Loader } from "../components";
import appwriteService from "../appwrite/config-appwrite";
import { useSelector } from "react-redux";

function MySavedPosts() {
   const [savedPosts, setSavedPosts] = useState(null);
   const [loading, setLoading] = useState(true);
   const userData = useSelector((state) => state.auth.userData);

   useEffect(() => {
      if (userData) {
         appwriteService
            .getSavedPosts(userData.$id)
            .then((posts) => {
               if (posts) {
                  setSavedPosts(posts.documents);
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
         <Container className="max-w-full">
            <h1 className="text-center">
               {savedPosts.length === 0 && <p>No posts available.</p>}
            </h1>
            <div className="masonry-grid">
               {savedPosts.map((saved) => {
                  return (
                     <div key={saved.articles.$id} className="masonry-item">
                        <PostCard
                           $id={saved.articles.$id}
                           title={saved.articles.title}
                           featuredImage={saved.articles.featuredImage}
                        />
                     </div>
                  );
               })}
            </div>
         </Container>
      </div>
   );
}

export default MySavedPosts;
