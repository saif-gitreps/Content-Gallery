import { Container, InfinityScrollLayout, LoadCards } from "../components";
import { useSelector } from "react-redux";
import appwriteService from "../appwrite/config-appwrite";
import { Query } from "appwrite";

function MyPosts() {
   const userData = useSelector((state) => state.auth.userData);

   const renderPosts = (posts) => {
      return (
         <Container className="max-w-7xl">
            <LoadCards posts={posts} />
         </Container>
      );
   };

   return (
      <div className="w-full py-8">
         <InfinityScrollLayout
            fetchMethod={(queries, offset) => appwriteService.getPosts(queries, offset)}
            queries={[Query.equal("userId", userData.$id)]}
            renderPosts={renderPosts}
         />
      </div>
   );
}

export default MyPosts;
