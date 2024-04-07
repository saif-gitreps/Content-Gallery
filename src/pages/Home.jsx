import { useState, useEffect } from "react";
import appwriteService from "../appwrite/config-appwrite";
import { Container, PostCard } from "../components";

function Home() {
   const [posts, setPosts] = useState();

   useEffect(() => {
      appwriteService.getPosts().then((posts) => {
         if (posts) {
            setPosts(posts.documents);
         }
      });
   }, []);

   return !posts.length ? (
      <div className="w-full py-8 mt-4 text-center">
         <Container>
            <div className="flex flex-wrap">
               <div className="p-2 w-full">
                  <h1 className="text-2xl">Login to read posts</h1>
               </div>
            </div>
         </Container>
      </div>
   ) : (
      <div className="w-full py-8">
         {posts.map((post) => (
            <div key={post.$id} className="p-2 w-1/4">
               <PostCard {...post} />
            </div>
         ))}
      </div>
   );
}

export default Home;
