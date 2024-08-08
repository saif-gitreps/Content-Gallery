import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import appwriteCommentsService from "../appwrite/config-comments";

export function useComments(postId) {
   return useQuery({
      queryKey: ["comments", postId],
      queryFn: () => appwriteCommentsService.getComments(postId),
   });
}

export function useAddComment() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (commentData) =>
         appwriteCommentsService.addComment(
            commentData.content,
            commentData.profilePicture,
            commentData.postId,
            commentData.userName,
            commentData.userId
         ),
      onSuccess: (newComment, variables) => {
         queryClient.setQueryData(["comments", variables.postId], (old) => [
            ...old,
            newComment,
         ]);
      },
   });
}

export function useDeleteComment() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (commentId) => appwriteCommentsService.deleteComment(commentId),
      onSuccess: (_, variables) => {
         queryClient.setQueryData(["comments", variables.postId], (old) =>
            old.filter((comment) => comment.$id !== variables.commentId)
         );
      },
   });
}
