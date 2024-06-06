import { useState, useEffect } from "react";
import { Container, Loader, LoadCards } from "../components";
import appwriteService from "../appwrite/config-appwrite";
import { Query } from "appwrite";
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
               const results = await appwriteService.getPosts([
                  Query.or(
                     [Query.contains("title", query), Query.contains("content", query)],
                     0,
                     500
                  ),
               ]);
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
            <LoadCards posts={posts} />
         </Container>
      </div>
   );
}

export default SearchResult;
