import { useState, useEffect } from "react";
import { Container, Loader, LoadCards } from "../components";
import appwriteService from "../appwrite/config-appwrite";
import { Query } from "appwrite";
import debounce from "../utils/debouncer";

function Home() {
   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [offset, setOffset] = useState(0);
   const [hasMore, setHasMore] = useState(true);

   useEffect(() => {
      const fetchPosts = async () => {
         try {
            setLoading(true);
            const newPosts = await appwriteService.getPosts(
               [Query.equal("status", "active")],
               offset
            );

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
   }, [offset, hasMore]);

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
      <div className="w-full py-8">
         <Container className="max-w-7xl">
            <LoadCards posts={posts} />
            {loading && <Loader />}
         </Container>
      </div>
   );
}

export default Home;
