import { useState } from "react";
import { useForm } from "react-hook-form";
import { Comment, Loader, Button, ErrorMessage, LoaderMini } from "../../components";
import appwriteCommentsService from "../../appwrite/config-comments";
import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

function CommentSection({ post, userData, isAuthor }) {
   const [miniLoading, setMiniLoading] = useState(false);
   const authStatus = useSelector((state) => state.auth.status);
   const [error, setError] = useState("");
   const queryClient = useQueryClient();

   const { register, handleSubmit, reset } = useForm({
      defaultValues: { content: "" },
   });

   const {
      data: postComments,
      isLoading,
      isError,
   } = useQuery({
      queryKey: ["comments", post.$id],
      queryFn: async () => {
         const comments = await appwriteCommentsService.getComments(post.$id);
         return comments?.documents;
      },
      enabled: !!post?.$id,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
   });

   const addCommentMutation = useMutation({
      mutationFn: async (data) =>
         await appwriteCommentsService.addComment(
            data.content,
            userData.prefs?.profilePicture,
            post?.$id,
            userData.name,
            userData.$id
         ),
      onMutate: async (data) => {
         const optimisticComment = {
            $id: Date.now(),
            content: data.content,
            avatar: userData.prefs?.profilePicture,
            articleId: post.$id,
            userName: userData.name,
         };
         await queryClient.setQueryData(["comments", post.$id], (oldComments) => [
            ...oldComments,
            optimisticComment,
         ]);
         return { optimisticComment };
      },
      onError: () => {
         setError("Error adding comment. Please try again.");
         setMiniLoading(false);
         reset({ content: "" });
      },
      onSuccess: async () => {
         setMiniLoading(false);
         reset({ content: "" });
         setError("");
      },
      onSettled: () => {
         return queryClient.invalidateQueries(["comments", post.$id]);
      },
   });

   const addComment = async (data) => {
      setError("");
      setMiniLoading(true);
      try {
         await addCommentMutation.mutateAsync(data);
      } catch (error) {
         setError("Error adding comment. Please try again.");
      }
   };

   const deleteCommentMutation = useMutation({
      mutationFn: async (commentId) =>
         await appwriteCommentsService.deleteComment(commentId),
      onMutate: async (commentId) => {
         await queryClient.setQueryData(["comments", post.$id], (oldComments) =>
            oldComments.filter((comment) => comment.$id !== commentId)
         );
      },
      onError: () => {
         setError("Error deleting comment. Please try again.");
         setMiniLoading(false);
      },
      onSuccess: async () => {
         setMiniLoading(false);
         setError("");
      },
      onSettled: () => {
         return queryClient.invalidateQueries(["comments", post.$id]);
      },
   });

   const deleteComment = async (commentId) => {
      setError("");
      setMiniLoading(true);
      try {
         await deleteCommentMutation.mutateAsync(commentId);
      } catch (error) {
         setError("Error deleting comment. Please try again.");
      }
   };

   return (
      <div className="p-4 relative border rounded-2xl bg-background-lightWhite dark:bg-background-darkBlack  shadow-lg">
         <h1 className="text-xl font-bold text-center">Comments</h1>
         <ErrorMessage error={error || isError} />

         <ul>
            {isLoading && <Loader />}
            {!isError && postComments?.length === 0 ? (
               <li className="text-center">No comments yet</li>
            ) : (
               postComments?.map((comment) => (
                  <Comment
                     key={comment.$id}
                     comment={comment}
                     isAuthor={isAuthor}
                     onDelete={deleteComment}
                     userData={userData}
                     optimisticComment={addCommentMutation?.context?.optimisticComment}
                  />
               ))
            )}
         </ul>

         {authStatus && (
            <form onSubmit={handleSubmit(addComment)}>
               <textarea
                  {...register("content", { required: true })}
                  className="w-full h-24 p-4 mt-2 border rounded-xl dark:bg-background-darkGray dark:text-text-dark dark:border-none"
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
