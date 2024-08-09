import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import debounce from "../utils/debouncer";

const useInfinitePosts = (queryKey, queryFn) => {
   const { data, error, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
      queryKey,
      queryFn,
      initialPageParam: 0,
      getNextPageParam: (lastPage, pages) => {
         return lastPage.documents.length > 0 ? pages.length * 5 : undefined;
      },
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
   });

   const allPosts = data?.pages?.flatMap((page) => page.documents) || [];

   useEffect(() => {
      const handleScroll = debounce((event) => {
         const scrollHeight = event.target.documentElement.scrollHeight;
         const currentHeight =
            event.target.documentElement.scrollTop + window.innerHeight;
         if (currentHeight + 1 >= scrollHeight && hasNextPage) fetchNextPage();
      }, 200);

      document.addEventListener("scroll", handleScroll);
      return () => document.removeEventListener("scroll", handleScroll);
   }, [hasNextPage, fetchNextPage]);

   return { allPosts, error, isFetching };
};

export default useInfinitePosts;
