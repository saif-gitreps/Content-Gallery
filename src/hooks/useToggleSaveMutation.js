import { useMutation, useQueryClient } from "@tanstack/react-query";
import appwriteService from "../appwrite/config-appwrite";

export const useToggleSaveMutation = (userData, post, onError, onSuccess) => {
   const queryClient = useQueryClient();

   const toggleSaveMutation = useMutation({
      mutationFn: async (isSaved) =>
         isSaved
            ? await appwriteService.unsavePost(isSaved.$id)
            : await appwriteService.savePost(userData.$id, post.$id),
      onMutate: async () => {
         await queryClient.cancelQueries(["saved", userData.$id, post.$id]);
         const previousSaved = queryClient.getQueryData([
            "saved",
            userData.$id,
            post.$id,
         ]);
         queryClient.setQueryData(["saved", userData.$id, post.$id], (old) => !old);
         return { previousSaved };
      },
      onError: (err, variables, context) => {
         queryClient.setQueryData(
            ["saved", userData.$id, post.$id],
            context.previousSaved
         );
         onError(err);
      },
      onSettled: () => {
         queryClient.invalidateQueries(["saved", userData.$id, post.$id]);
      },
      onSuccess,
   });

   return toggleSaveMutation;
};
