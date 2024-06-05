import { useState, useEffect } from "react";
import { Loader } from "../components";
import debounce from "../utils/debouncer";

function InfiniteScrollLayout({ fetchMethod, queries, renderPosts }) {
   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [offset, setOffset] = useState(0);
   const [hasMore, setHasMore] = useState(true);

   useEffect(() => {
      const fetchPosts = async () => {
         try {
            const newPosts = await fetchMethod(queries, offset);

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
         } catch (error) {
            console.log(error);
         } finally {
            setLoading(false);
         }
      };

      if (hasMore) {
         setLoading(true);
         fetchPosts();
      }
   }, [offset, hasMore, queries, fetchMethod]);

   useEffect(() => {
      const handleScroll = debounce((event) => {
         const scrollHeight = event.target.documentElement.scrollHeight;
         const currentHeight =
            event.target.documentElement.scrollTop + window.innerHeight;
         if (currentHeight + 1 >= scrollHeight && !loading && hasMore) {
            setOffset((prev) => prev + 5);
         }
      }, 200);

      document.addEventListener("scroll", handleScroll);
      return () => document.removeEventListener("scroll", handleScroll);
   }, [loading, hasMore]);

   if (posts.length === 0 && loading) {
      return <Loader />;
   }
   return (
      <>
         {renderPosts(posts)} {loading && <Loader />}
      </>
   );
}

export default InfiniteScrollLayout;
