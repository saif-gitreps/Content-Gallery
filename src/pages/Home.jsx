import {
   Container,
   InfinityScrollLayout,
   LoadCards,
   ParentContainer,
} from "../components";
import { Query } from "appwrite";
import appwriteService from "../appwrite/config-appwrite";

function Home() {
   const renderPosts = (posts) => {
      return (
         <Container className="max-w-7xl">
            <LoadCards posts={posts} />
         </Container>
      );
   };

   return (
      <ParentContainer>
         <InfinityScrollLayout
            fetchMethod={(queries, offet) => appwriteService.getPosts(queries, offet)}
            queries={[Query.equal("status", "active")]}
            renderPosts={renderPosts}
         />
      </ParentContainer>
   );
}

export default Home;
