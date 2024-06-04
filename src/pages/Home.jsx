import { useState, useEffect } from "react";
import { Container, Loader, LoadCards } from "../components";
import appwriteService from "../appwrite/config-appwrite";
import { Query } from "appwrite";

function Home() {
   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [offset, setOffset] = useState(0);

   useEffect(() => {
      const fetchPosts = async () => {
         try {
            setLoading(true);
            const newPosts = await appwriteService.getPosts([
               Query.equal("status", "active"),
            ]);

            console.log(newPosts);

            if (posts.length === 0) {
               setPosts(newPosts.documents);
            } else {
               setPosts((prev) => {
                  setPosts(...prev, ...newPosts.documents);
               });
            }

            setLoading(false);
         } catch (error) {
            console.log(error);
         }
      };

      fetchPosts();
   }, [offset]);

   useEffect(() => {
      const handleScroll = (event) => {
         const scrollHeight = event.target.documentElement.scrollHeight;
         const currentHeight =
            event.target.documentElement.scrollTop + window.innerHeight;
         if (currentHeight + 1 >= scrollHeight) setOffset((prev) => prev + 5);
      };

      document.addEventListener("scroll", handleScroll);
      return () => document.removeEventListener("scroll", handleScroll);
   }, []);

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

export default Home;
