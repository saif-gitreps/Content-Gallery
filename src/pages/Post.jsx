import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Container, Loader } from "../components";
import appwriteService from "../appwrite/config-appwrite";
import appwriteCommentsService from "../appwrite/config-comments";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

export default function Post() {
   const [image, setImage] = useState("");
   const [loading, setLoading] = useState(true);
   const { id } = useParams();
   const navigate = useNavigate();
   const userData = useSelector((state) => state.auth.userData);
   const [post, setPost] = useState(null);
   const [postComments, setPostComments] = useState([]);

   const { register, handleSubmit } = useForm({
      defaultValues: {
         content: "",
      },
   });

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

   useEffect(() => {
      const fetchData = async () => {
         try {
            const commentsOnThePost = await appwriteCommentsService.getComments(
               post?.$id
            );
            if (commentsOnThePost) {
               setPostComments(commentsOnThePost.documents);
            }
         } catch (error) {
            console.error("Error fetching comments:", error);
         }
      };
      fetchData();
   }, [post?.$id]);

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

   const addComments = async (data) => {
      try {
         await appwriteCommentsService.addComment(
            data.content,
            userData.prefs?.profilePicture,
            post?.$id,
            userData.name
         );
      } catch (error) {
         console.error("Error adding comment:", error);
      }
   };

   const deleteComment = async (id) => {
      try {
         await appwriteCommentsService.deleteComment(id);
      } catch (error) {
         console.error("Error deleting comment:", error);
      }
   };

   if (loading) {
      return <Loader />;
   }
   return post ? (
      <div className="py-8">
         <Container className="w-2/3 mx-auto">
            <div className="mb-6 p-6 relative border rounded-2xl bg-white shadow-lg">
               {isAuthor && (
                  <div className="absolute right-7 top-7">
                     <Link to={`/edit-post/${post.$id}`}>
                        <button className="text-md inline-bock py-3 w-16 bg-green-400 duration-300 hover:shadow-md hover:bg-green-100 rounded-lg mr-1">
                           Edit
                        </button>
                     </Link>
                     <button
                        className="text-md inline-bock py-3 w-16 bg-red-400 duration-300 hover:shadow-md hover:bg-red-100 rounded-lg"
                        onClick={deletePost}
                     >
                        Delete
                     </button>
                  </div>
               )}
               <div className="w-full flex justify-center ">
                  <img src={image} alt={post.title} className="rounded-2xl " />
               </div>
            </div>
            <div className="mb-6">
               <h1 className="text-2xl font-bold">{post.title}</h1>
               <div className="text-xl font-medium">{parse(post.content)}</div>
            </div>
            <div className="p-6 relative border rounded-2xl bg-white shadow-lg">
               <h1 className="text-2xl font-bold text-center">Comments</h1>
               <ul>
                  {postComments.length === 0 ? (
                     <li className="text-center">No comments yet</li>
                  ) : (
                     postComments.map((comment, index) => (
                        <li key={index} className="mb-4 flex justify-between">
                           <div className="flex items-center">
                              <img
                                 src={comment.avatar}
                                 alt={comment.userName}
                                 className="w-10 h-10 rounded-full"
                              />
                              <div className="ml-2 max-w-2/5">
                                 <p className="font-bold">{comment.userName}</p>
                                 <p>{comment.content}</p>
                              </div>
                           </div>
                           {(isAuthor || comment.userId === userData.$id) && (
                              <button
                                 className="text-sm w-14 bg-red-400 duration-300 hover:shadow-md hover:bg-red-100 rounded-lg"
                                 onClick={() => deleteComment(comment.$id)}
                              >
                                 Delete
                              </button>
                           )}
                        </li>
                     ))
                  )}
               </ul>
               <form onSubmit={handleSubmit(addComments)}>
                  <textarea
                     {...register("content", { required: true })}
                     className="w-full h-24 p-4 mt-4 border rounded-xl"
                     placeholder="Add a comment"
                  ></textarea>
                  <button
                     type="submit"
                     className="w-full py-3 bg-blue-400 duration-300 hover:shadow-md hover:bg-blue-100 rounded-lg mt-4"
                  >
                     Add Comment
                  </button>
               </form>
            </div>
         </Container>
      </div>
   ) : null;
}
