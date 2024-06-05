import { useState, useEffect } from "react";
import appwriteService from "../appwrite/config-appwrite";

function useLoadPaginatedCards(queries) {
   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [offset, setOffset] = useState(0);
   const [hasMore, setHasMore] = useState(true);

   useEffect(() => {
      const fetchPosts = async () => {
         try {
            setLoading(true);
            const newPosts = await appwriteService.getPosts([...queries], offset);

            if (newPosts.documents.length > 0) {
               setPosts((prevPosts) => {
                  const uniquePosts = newPosts.documents.filter(
                     (newPost) => !prevPosts.some((post) => post.$id === newPost.$id)
                  );
                  return [...prevPosts, ...uniquePosts];
               });
               if (newPosts.documents.length < 5) {
                  setHasMore(false);
               }
            } else {
               setHasMore(false);
            }

            setLoading(false);
         } catch (error) {
            console.log(error);
            setLoading(false);
         }
      };

      if (hasMore) {
         fetchPosts();
      }
   }, [offset, hasMore, queries]);

   useEffect(() => {
      const handleScroll = (event) => {
         const scrollHeight = event.target.documentElement.scrollHeight;
         const currentHeight =
            event.target.documentElement.scrollTop + window.innerHeight;
         if (currentHeight + 1 >= scrollHeight && !loading && hasMore) {
            setOffset((prev) => prev + 5);
         }
      };

      document.addEventListener("scroll", handleScroll);
      return () => document.removeEventListener("scroll", handleScroll);
   }, [loading, hasMore]);

   return { posts, loading };
}

export default useLoadPaginatedCards;
