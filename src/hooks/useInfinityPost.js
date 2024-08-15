import { useEffect, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import debounce from "../utils/debouncer";

const useInfinitePosts = (queryKey, queryFn, options = {}) => {
   const {
      data,
      error,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
      refetch,
      isRefetching,
   } = useInfiniteQuery({
      queryKey,
      queryFn,
      initialPageParam: 0,
      getNextPageParam: (lastPage, pages) => {
         return lastPage.documents.length > 0 ? pages.length * 5 : undefined;
      },
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 3,
      ...options,
   });

   const allPosts = data?.pages?.flatMap((page) => page.documents) || [];

   const handleScroll = useCallback(
      debounce((event) => {
         const scrollHeight = event.target.documentElement.scrollHeight;
         const currentHeight =
            event.target.documentElement.scrollTop + window.innerHeight;
         if (currentHeight + 1 >= scrollHeight && hasNextPage) fetchNextPage();
      }, 200),
      [hasNextPage, fetchNextPage]
   );

   useEffect(() => {
      document.addEventListener("scroll", handleScroll);
      return () => document.removeEventListener("scroll", handleScroll);
   }, [handleScroll]);

   return {
      allPosts,
      error,
      isFetching,
      isFetchingNextPage,
      refetch,
      isRefetching,
      hasNextPage,
      fetchNextPage,
   };
};

export default useInfinitePosts;
