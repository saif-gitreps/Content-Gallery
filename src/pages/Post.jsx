import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button, Container, Loader } from "../components";
import appwriteService from "../appwrite/config-appwrite";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
   const [post, setPost] = useState(null);
   const [image, setImage] = useState("");
   const [loading, setLoading] = useState(true);
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
            setLoading(false);
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

   if (loading) {
      return <Loader />;
   }
   return post ? (
      <div className="py-8">
         <Container>
            <div className="w-full flex justify-center mb-6 relative border rounded-xl p-2 bg-white hover:shadow-lg">
               <img src={image} alt={post.title} className="rounded-xl " />
            </div>
            <div className="w-full mb-6">
               <h1 className="text-3xl font-bold">{post.title}</h1>
               <div className="text-xl font-medium">{parse(post.content)}</div>
            </div>
            {isAuthor && (
               <div className="font-medium">
                  <Link to={`/edit-post/${post.$id}`}>
                     <Button className="text-xl inline-bock px-3 py-4 bg-green-400 duration-300 hover:shadow-md hover:bg-green-100 rounded-xl mr-3">
                        Edit
                     </Button>
                  </Link>
                  <Button
                     className="text-xl inline-bock px-3 py-4 bg-red-400 duration-300 hover:shadow-md hover:bg-red-100 rounded-xl"
                     onClick={deletePost}
                  >
                     Delete
                  </Button>
               </div>
            )}
         </Container>
      </div>
   ) : null;
}
