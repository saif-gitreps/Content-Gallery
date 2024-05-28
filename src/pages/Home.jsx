import { useState, useEffect } from "react";
import { Container, Loader, LoadCards } from "../components";
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
         <Container className="max-w-full">
            <LoadCards posts={posts} />
         </Container>
      </div>
   );
}

export default Home;
