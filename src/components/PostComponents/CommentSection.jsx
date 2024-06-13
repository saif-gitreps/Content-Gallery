import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Comment, Loader, Button, ErrorMessage, LoaderMini } from "../../components";
import appwriteCommentsService from "../../appwrite/config-comments";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function CommentSection({ post, userData, isAuthor }) {
   const [postComments, setPostComments] = useState([]);
   const [loading, setLoading] = useState(true);
   const [miniLoading, setMiniLoading] = useState(false);
   const authStatus = useSelector((state) => state.auth.status);
   const [error, setError] = useState("");

   const { register, handleSubmit, reset } = useForm({
      defaultValues: { content: "" },
   });

   useEffect(() => {
      const fetchData = async () => {
         try {
            const commentsOnThePost = await appwriteCommentsService.getComments(
               post?.$id
            );
            if (!commentsOnThePost) {
               throw new Error();
            }
            setPostComments(commentsOnThePost.documents);
         } catch (error) {
            setError("Error fetching comments. Please try again.");
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, [post?.$id]);

   const addComments = async (data) => {
      setError("");
      setMiniLoading(true);
      try {
         const addedComment = await appwriteCommentsService.addComment(
            data.content,
            userData.prefs?.profilePicture,
            post?.$id,
            userData.name,
            userData.$id
         );

         console.log(addedComment);

         if (!addedComment) {
            throw new Error();
         }

         setPostComments((prev) => [...prev, addedComment]);
         reset({ content: "" });
      } catch (error) {
         setError("Error adding comment. Please try again.");
      } finally {
         setMiniLoading(false);
      }
   };

   const deleteComment = async (commentId) => {
      setError("");
      setMiniLoading(true);
      try {
         const deletedComment = await appwriteCommentsService.deleteComment(commentId);

         if (!deletedComment) {
            throw new Error();
         }

         setPostComments((prevComments) =>
            prevComments.filter((comment) => comment.$id !== commentId)
         );
      } catch (error) {
         setError("Error deleting comment. Please try again.");
      } finally {
         setMiniLoading(false);
      }
   };

   return (
      <div className="p-4 relative border rounded-2xl bg-white shadow-lg">
         <h1 className="text-xl font-bold text-center">Comments</h1>
         <ErrorMessage error={error} />

         <ul>
            {loading && <Loader />}
            {!loading && !error && postComments.length === 0 ? (
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
                  className="w-full h-24 p-4 mt-2 border rounded-xl"
                  placeholder="Add a comment"
               ></textarea>
               {miniLoading ? (
                  <div className="flex justify-center items-center mt-3">
                     <LoaderMini />
                  </div>
               ) : (
                  <Button
                     type="submit"
                     text="Add Comment"
                     className="w-full"
                     bgNumber={1}
                  />
               )}
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
