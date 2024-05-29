import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Comment, Loader, Button } from "../../components";
import appwriteCommentsService from "../../appwrite/config-comments";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function CommentSection({ post, userData, isAuthor }) {
   const [postComments, setPostComments] = useState([]);
   const [loader, setLoader] = useState(true);
   const authStatus = useSelector((state) => state.auth.status);

   const { register, handleSubmit, reset } = useForm({
      defaultValues: { content: "" },
   });

   useEffect(() => {
      const fetchData = async () => {
         try {
            const commentsOnThePost = await appwriteCommentsService.getComments(
               post?.$id
            );
            if (commentsOnThePost) {
               setPostComments(commentsOnThePost.documents);
               setLoader(false);
            }
         } catch (error) {
            console.error("Error fetching comments:", error);
         }
      };
      fetchData();
   }, [post?.$id]);

   const addComments = async (data) => {
      try {
         await appwriteCommentsService.addComment(
            data.content,
            userData.prefs?.profilePicture,
            post?.$id,
            userData.name,
            userData.$id
         );
         const commentsOnThePost = await appwriteCommentsService.getComments(post?.$id);
         if (commentsOnThePost) {
            setPostComments(commentsOnThePost.documents);
            reset({ content: "" });
         }
      } catch (error) {
         console.error("Error adding comment:", error);
      }
   };

   const deleteComment = async (commentId) => {
      try {
         await appwriteCommentsService.deleteComment(commentId);
         setPostComments((prevComments) =>
            prevComments.filter((comment) => comment.$id !== commentId)
         );
      } catch (error) {
         console.error("Error deleting comment:", error);
      }
   };
   return (
      <div className="p-4 relative border rounded-2xl bg-white shadow-lg">
         <h1 className="text-xl font-bold text-center">Comments</h1>
         <ul>
            {loader && <Loader />}
            {!loader && postComments.length === 0 ? (
               <li className="text-center">No comments yet</li>
            ) : (
               postComments.map((comment, index) => (
                  <Comment
                     key={index}
                     comment={comment}
                     isAuthor={isAuthor}
                     onDelete={deleteComment}
                     userData={userData}
                  />
               ))
            )}
         </ul>
         {authStatus && (
            <form onSubmit={handleSubmit(addComments)}>
               <textarea
                  {...register("content", { required: true })}
                  className="w-full h-24 p-4 mt-4 border rounded-xl"
                  placeholder="Add a comment"
               ></textarea>
               <Button type="submit" text="Add Comment" className="w-full" bgNumber={1} />
            </form>
         )}

         {!authStatus && (
            <p className="text-center mt-4 text-base">
               <Link
                  to="/login"
                  className="font-semibold transition-all duration-200 hover:underline text-blue-700"
               >
                  <Button text="Login" type="button" bgNumber={1} />
               </Link>
               to add a comment
            </p>
         )}
      </div>
   );
}

export default CommentSection;
