import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button, LoaderMini } from "..";
import appwriteCommentsService from "../../appwrite/config-comments";
import Comment from "./Comment";
import { toast } from "react-toastify";

function CommentSection({ post, userData, isAuthor }) {
   const [miniLoading, setMiniLoading] = useState(false);
   const authStatus = useSelector((state) => state.auth.status);
   const queryClient = useQueryClient();
   const { register, handleSubmit, reset } = useForm({
      defaultValues: { content: "" },
   });

   const {
      data: postComments = [],
      isLoading,
      isError,
   } = useQuery({
      queryKey: ["comments", post.$id],
      queryFn: async () => {
         const result = await appwriteCommentsService.getComments(post.$id);
         return result.documents;
      },
      enabled: !!post?.$id,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
   });

   const addCommentMutation = useMutation({
      mutationFn: async (data) =>
         await appwriteCommentsService.addComment(data.content, post?.$id, userData.$id),
      onMutate: async (data) => {
         const optimisticComment = {
            $id: Date.now().toString(),
            content: data.content,
            articles: post.$id,
            user: {
               name: userData.name,
               profilePicture: userData.profilePicture,
            },
         };
         await queryClient.setQueryData(["comments", post.$id], (oldComments) => [
            ...(oldComments || []),
            optimisticComment,
         ]);
         return { optimisticComment };
      },
      onError: () => {
         toast.error("Error adding comment. Please try again.");
         setMiniLoading(false);
         reset({ content: "" });
      },
      onSuccess: () => {
         setMiniLoading(false);
         reset({ content: "" });
      },
      onSettled: () => queryClient.invalidateQueries(["comments", post.$id]),
   });

   const deleteCommentMutation = useMutation({
      mutationFn: (commentId) => appwriteCommentsService.deleteComment(commentId),
      onMutate: async (commentId) => {
         await queryClient.setQueryData(["comments", post.$id], (oldComments) =>
            oldComments.filter((comment) => comment.$id !== commentId)
         );
      },
      onError: () => {
         toast.error("Error deleting comment. Please try again.");
         setMiniLoading(false);
      },
      onSuccess: () => {
         setMiniLoading(false);
      },
      onSettled: () => queryClient.invalidateQueries(["comments", post.$id]),
   });

   const addComment = async (data) => {
      setMiniLoading(true);
      try {
         await addCommentMutation.mutateAsync(data);
      } catch (error) {
         toast.error("Something went wrong while adding comment");
      }
   };

   const deleteComment = async (commentId) => {
      setMiniLoading(true);
      try {
         await deleteCommentMutation.mutateAsync(commentId);
      } catch (error) {
         toast.error("Something went wrong while deleting comment");
      }
   };

   return (
      <div className="py-1 px-1 relative rounded-xl rounded-b-md bg-background-lightWhite dark:bg-background-darkBlack shadow-lg">
         <h1 className="text-xl font-bold text-center">Comments</h1>

         <ul
            className={`space-y-1 mb-1 ${
               postComments.length > 4 ? "max-h-56 overflow-y-auto" : ""
            }`}
         >
            {isLoading && (
               <div className="flex justify-center items-center mt-3">
                  <LoaderMini />
               </div>
            )}
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
                     optimisticComment={addCommentMutation.context?.optimisticComment}
                  />
               ))
            )}
         </ul>

         {authStatus ? (
            <form onSubmit={handleSubmit(addComment)}>
               <textarea
                  {...register("content", { required: true })}
                  className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-background-darkGray dark:text-text-dark"
                  placeholder="Add a comment"
               />
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
         ) : (
            <div className="mt-4 text-base flex justify-center items-center">
               <Link
                  to="/login"
                  className="font-semibold transition-all duration-200 hover:underline text-blue-700"
               >
                  <Button text="Login" type="button" bgNumber={1} />
               </Link>
               <span className="ml-1">to comment.</span>
            </div>
         )}
      </div>
   );
}

export default CommentSection;
