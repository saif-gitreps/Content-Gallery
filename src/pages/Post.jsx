import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Loader, PostActions, CommentSection } from "../components";
import appwriteService from "../appwrite/config-appwrite";

import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
   const [image, setImage] = useState("");
   const [loading, setLoading] = useState(true);
   const { id } = useParams();
   const navigate = useNavigate();
   const userData = useSelector((state) => state.auth.userData);

   const [post, setPost] = useState(null);

   useEffect(() => {
      const fetchData = async () => {
         try {
            if (!id) {
               navigate("/");
               return;
            }
            const post = await appwriteService.getPost(id);
            if (!post) {
               navigate("/");
               return;
            }
            setPost(post);
            const result = await appwriteService.getFilePrev(post.featuredImage);
            setImage(result);
            setLoading(false);
         } catch (error) {
            console.error("Error fetching post:", error);
            navigate("/");
         }
      };
      fetchData();
   }, [id, navigate]);

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

   if (loading) {
      return <Loader />;
   }
   return post ? (
      <div className="p-8">
         <Container>
            <div className="mb-3 p-10 border rounded-2xl bg-white shadow-lg">
               <div className="mb-6">
                  <h1 className="text-2xl font-bold">{post.title}</h1>
                  <div className="text-xl font-medium">{parse(post.content)}</div>
               </div>
               <div className="relative flex justify-center">
                  {isAuthor && <PostActions postId={post.$id} onDelete={deletePost} />}
                  <img
                     src={image}
                     alt={post.title}
                     className="rounded-2xl h-96 object-cover"
                  />
               </div>
            </div>
            <CommentSection post={post} isAuthor={isAuthor} userData={userData} />
         </Container>
      </div>
   ) : null;
}
