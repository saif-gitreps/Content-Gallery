import { useState, useEffect } from "react";
import { Container, Loader, LoadCards } from "../components";
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
         <Container className="max-w-7xl">
            <LoadCards posts={posts} />
         </Container>
      </div>
   );
}

export default MyPosts;
