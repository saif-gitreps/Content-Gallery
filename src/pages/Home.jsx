import { Container, LoadCards, ParentContainer } from "../components";
import { Query } from "appwrite";
import appwriteService from "../appwrite/config-appwrite";
import { useEffect } from "react";
import { Loader, ErrorMessage } from "../components";
import debounce from "../utils/debouncer";
import { useInfiniteQuery } from "@tanstack/react-query";

function Home() {
   const { data, error, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: async ({ pageParam = 0 }) =>
         await appwriteService.getPosts([Query.equal("status", "active")], pageParam, 5),
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

   return (
      <ParentContainer>
         <Container className="max-w-7xl">
            <LoadCards posts={allPosts} />
            <ErrorMessage error={error} />
            {isFetching && <Loader />}
         </Container>
      </ParentContainer>
   );
}
export default Home;
