import { useState, useEffect } from "react";
import { Container, PostCard, Loader } from "../components";
import appwriteService from "../appwrite/config-appwrite";
import { useSearchParams } from "react-router-dom";

function SearchResult() {
   const [searchParams] = useSearchParams();
   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchPosts = async () => {
         setLoading(true);
         const query = searchParams.get("q");
         if (query) {
            try {
               const results = await appwriteService.searchPosts(query);
               setPosts(results.documents);
            } catch (error) {
               console.error("Error fetching search results:", error);
            }
         }
         setLoading(false);
      };

      fetchPosts();
   }, [searchParams]);

   return loading ? (
      <Loader />
   ) : (
      <div className="w-full py-8">
         <Container className="max-w-full">
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

export default SearchResult;
