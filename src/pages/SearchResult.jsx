import { useState, useEffect } from "react";
import {
   Container,
   Loader,
   LoadCards,
   ErrorMessage,
   ParentContainer,
} from "../components";
import appwriteService from "../appwrite/config-appwrite";
import { Query } from "appwrite";
import useInfinitePosts from "../hooks/useInfinityPost";
import { useSearchParams } from "react-router-dom";

function SearchResult() {
   const [searchParams] = useSearchParams();
   const [query, setQuery] = useState(searchParams.get("q"));

   useEffect(() => {
      setQuery(searchParams.get("q"));
      if (query) {
         refetch();
      }
   }, [searchParams]);

   const queryFn = async ({ pageParam = 0 }) =>
      await appwriteService.getPosts(
         [Query.or([Query.contains("title", query), Query.contains("content", query)])],
         pageParam,
         5
      );

   const { allPosts, error, isFetching, refetch, isRefetching } = useInfinitePosts(
      ["searchPosts", query],
      queryFn,
      {
         enabled: !!query,
      }
   );

   return (
      <ParentContainer>
         <Container className="max-w-full">
            <h1 className="text-center font-bold text-lg mb-4">
               Seach Results for "{query}"
            </h1>
            {!isFetching && <LoadCards posts={allPosts} />}
            <ErrorMessage error={error} />
            {(isFetching || isRefetching) && <Loader />}
         </Container>
      </ParentContainer>
   );
}

export default SearchResult;
