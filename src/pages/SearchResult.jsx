import { useState, useEffect } from "react";
import { Container, Loader, LoadCards, ErrorMessage } from "../components";
import appwriteService from "../appwrite/config-appwrite";
import { Query } from "appwrite";
import { useSearchParams } from "react-router-dom";
import debounce from "../utils/debouncer";

function SearchResult() {
   const [searchParams] = useSearchParams();
   const [error, setError] = useState("");
   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [offset, setOffset] = useState(0);
   const [hasMore, setHasMore] = useState(true);
   const [isFetching, setIsFetching] = useState(false);

   const fetchPosts = (query, offset, limit) => {
      return appwriteService.getPosts(
         [Query.or([Query.contains("title", query), Query.contains("content", query)])],
         offset,
         limit
      );
   };

   useEffect(() => {
      const fetchInitialPosts = async () => {
         const query = searchParams.get("q");
         if (query) {
            try {
               const results = await fetchPosts(query, 0, 5);

               if (!results) {
                  throw new Error();
               }

               setPosts(results.documents);
               setHasMore(results.documents.length >= 5);
            } catch (error) {
               setError("Error fetching posts. Please try again.");
            } finally {
               setLoading(false);
            }
         }
      };

      setOffset(0);
      setHasMore(true);
      setLoading(true);
      setPosts([]);
      fetchInitialPosts();
   }, [searchParams]);

   useEffect(() => {
      const fetchMorePosts = async () => {
         const query = searchParams.get("q");
         if (query && hasMore && !isFetching) {
            setIsFetching(true);
            try {
               const results = await fetchPosts(query, offset, 5);

               if (!results) {
                  throw new Error();
               }

               setPosts((prevPosts) => [
                  ...prevPosts,
                  ...results.documents.filter(
                     (newPost) => !prevPosts.some((post) => post.$id === newPost.$id)
                  ),
               ]);
               setHasMore(results.documents.length === 5);
            } catch (error) {
               setError("Error fetching posts. Please try again.");
            } finally {
               setIsFetching(false);
            }
         }
      };

      if (offset > 0) {
         fetchMorePosts();
         setLoading(true);
      }
   }, [offset, searchParams, hasMore, isFetching]);

   useEffect(() => {
      const handleScroll = debounce(() => {
         const scrollHeight = document.documentElement.scrollHeight;
         const currentHeight = window.innerHeight + document.documentElement.scrollTop;
         if (currentHeight + 1 >= scrollHeight && !loading && hasMore && !isFetching) {
            setOffset((prev) => prev + 5);
         }
      }, 200);

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, [loading, hasMore, isFetching]);

   if (posts.length === 0 && loading) {
      return <Loader />;
   }
   if (error) {
      return <ErrorMessage error={error} />;
   }
   return (
      <div className="w-full py-8">
         <Container className="max-w-full">
            <h1 className="text-center font-bold text-lg mb-4">Seach Results:</h1>
            <LoadCards posts={posts} />
            {isFetching && <Loader />}
         </Container>
      </div>
   );
}

export default SearchResult;
