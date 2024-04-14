import { useState, useEffect } from "react";
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config-appwrite";

function AllPost() {
   const [posts, setPosts] = useState([]);
   useEffect(() => {
      appwriteService
         .getPosts()
         .then((posts) => {
            if (posts) {
               setPosts(posts.documents);
            }
         })
         .catch((error) => {
            console.log(error);
         });
   }, []);

   return (
      <div className="w-full py-8">
         <Container>
            <h1 className="text-center">
               {posts.length === 0 && <p>No posts available.</p>}
            </h1>
            <div className="flex flex-wrap">
               {posts.map((post) => {
                  return (
                     <div key={post.$id} className="p-2 w-1/4">
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

export default AllPost;
