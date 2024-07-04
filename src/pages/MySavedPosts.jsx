import {
   Container,
   PostCard,
   InfinityScrollLayout,
   ParentContainer,
} from "../components";
import appwriteService from "../appwrite/config-appwrite";
import { useSelector } from "react-redux";
import { Query } from "appwrite";

function MySavedPosts() {
   const userData = useSelector((state) => state.auth.userData);

   const renderPosts = (posts) => {
      return (
         <Container className="max-w-7xl">
            <h1 className="text-center">
               {posts.length === 0 && <p>No posts available.</p>}
            </h1>
            <div className="masonry-grid">
               {posts.map((saved) => {
                  return (
                     <div key={saved.articles.$id} className="masonry-item">
                        <PostCard
                           $id={saved.articles.$id}
                           title={saved.articles.title}
                           featuredImage={saved.articles.featuredImage}
                        />
                     </div>
                  );
               })}
            </div>
         </Container>
      );
   };

   return (
      <ParentContainer>
         <InfinityScrollLayout
            fetchMethod={(queries, offset) =>
               appwriteService.getSavedPosts(queries, offset)
            }
            queries={[Query.equal("userId", userData.$id)]}
            renderPosts={renderPosts}
         />
      </ParentContainer>
   );
}

export default MySavedPosts;
