import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button, Container } from "../components";
import appwriteService from "../appwrite/config-appwrite";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
   const [post, setPost] = useState(null);
   const [image, setImage] = useState("");
   const { slug } = useParams();
   const navigate = useNavigate();
   const userData = useSelector((state) => state.auth.userData);

   useEffect(() => {
      const fetchData = async () => {
         try {
            if (!slug) {
               navigate("/");
               return;
            }
            const post = await appwriteService.getPost(slug);
            if (!post) {
               navigate("/");
               return;
            }
            setPost(post);
            const result = await appwriteService.getFilePrev(post.featuredImage);
            setImage(result);
         } catch (error) {
            console.error("Error fetching post:", error);
            navigate("/");
         }
      };
      fetchData();
   }, [slug, navigate]);

   const deletePost = async () => {
      try {
         const status = await appwriteService.deletePost(post.$id);
         if (status) {
            await appwriteService.deleteFile(post.featuredImage);
            navigate("/");
         }
      } catch (error) {
         console.error("Error deleting post:", error);
      }
   };

   const isAuthor = post && userData ? post.userId === userData.$id : false;

   return post ? (
      <div className="py-8">
         <Container>
            <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
               <img src={image} alt={post.title} className="rounded-xl" />
               {isAuthor && (
                  <div className="absolute right-6 top-6">
                     <Link to={`/edit-post/${post.$id}`}>
                        <Button bgColor="bg-green-500" className="mr-3">
                           Edit
                        </Button>
                     </Link>
                     <Button bgColor="bg-red-500" onClick={deletePost}>
                        Delete
                     </Button>
                  </div>
               )}
            </div>
            <div className="w-full mb-6">
               <h1 className="text-2xl font-bold">{post.title}</h1>
            </div>
            <div className="browser-css">{parse(post.content)}</div>
         </Container>
      </div>
   ) : null;
}
