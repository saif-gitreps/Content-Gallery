import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Query } from "appwrite";
import parse from "html-react-parser";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
   Container,
   Loader,
   Button,
   LoaderMini,
   ErrorMessage,
   UserHeader,
} from "../../components";
import CommentSection from "./CommentComponents/CommentSection";
import appwriteService from "../../appwrite/config-appwrite";

export default function Post() {
   const [error, setError] = useState("");
   const queryClient = useQueryClient();
   const { id } = useParams();
   const navigate = useNavigate();
   const userData = useSelector((state) => state.auth.userData);
   const authStatus = useSelector((state) => state.auth.status);

   const {
      data: post,
      error: postError,
      isLoading: postLoading,
   } = useQuery({
      queryKey: ["post", id],
      queryFn: async () => await appwriteService.getPost(id),
      enabled: !!id,
   });

   const {
      data: image,
      error: imageError,
      isLoading: imageLoading,
   } = useQuery({
      queryKey: ["image", post?.featuredImage],
      queryFn: async () => await appwriteService.getFilePrev(post.featuredImage),
      enabled: !!post,
   });

   const {
      data: isSaved,
      error: savedPostError,
      isLoading: isSavedPostLoading,
   } = useQuery({
      queryKey: ["saved", userData?.$id, post?.$id],
      queryFn: async () => {
         const userSavedPosts = await appwriteService.getSavedPosts(
            [Query.equal("userId", userData?.$id)],
            0,
            5000
         );
         for (const savedPost of userSavedPosts.documents) {
            if (savedPost.articles.$id === post?.$id) {
               return savedPost;
            }
         }
         return null;
      },
      enabled: !!userData?.$id && !!post?.$id,
   });

   const deleteMutation = useMutation({
      mutationFn: async () => {
         await appwriteService.deletePost(post.$id);
         await appwriteService.deleteFile(post.featuredImage);
      },
      onError: () => {
         setError("Error deleting post. Please try again later.");
      },
      onSuccess: () => {
         navigate("/");
      },
   });

   const toggleSaveMutation = useMutation({
      mutationFn: async () =>
         isSaved
            ? await appwriteService.unsavePost(isSaved.$id)
            : await appwriteService.savePost(userData.$id, post.$id),
      onMutate: async () => {
         // Cancel any outgoing refetches
         await queryClient.cancelQueries(["saved", userData.$id, post.$id]);

         const previousSaved = queryClient.getQueryData([
            "saved",
            userData.$id,
            post.$id,
         ]);

         queryClient.setQueryData(["saved", userData.$id, post.$id], (old) => !old);

         return { previousSaved };
      },
      onError: (context) => {
         queryClient.setQueryData(
            ["saved", userData.$id, post.$id],
            context.previousSaved
         );
         setError("Error saving/unsaving post. Please try again.");
      },
      onSettled: () => {
         queryClient.invalidateQueries(["saved", userData.$id, post.$id]);
      },
      onSuccess: () => {
         setError("");
      },
   });

   useEffect(() => {
      if (postError || imageError || savedPostError) {
         setError("Error fetching post. Please try again later.");
         const timer = setTimeout(() => navigate("/"), 2000);
         return () => clearTimeout(timer);
      }
   }, [postError, imageError, savedPostError, navigate]);

   if (postLoading || imageLoading) return <Loader />;
   if (error) return <ErrorMessage error={error} />;

   const isAuthor = post.user.$id === userData?.$id;

   return (
      <Container className="max-w-2xl lg:max-w-5xl flex lg:flex-row flex-col lg:space-x-4 space-y-4 p-2 bg-background-lightWhite dark:bg-background-darkBlack">
         <div className="flex items-start justify-center">
            <img
               src={image}
               alt={post?.title}
               className="rounded-2xl object-contain sm:max-h-[40rem] sm:max-w-[35rem] lg:mr-auto"
            />
         </div>
         <div className="lg:w-2/3 space-y-1 flex flex-col justify-between">
            <div className="space-y-2">
               <UserHeader
                  src={post?.user.profilePicture}
                  name={post?.user.name}
                  $id={post?.user.$id}
                  date={post?.$createdAt}
               />
               <h1 className="text-base font-bold">{post?.title}</h1>
               <div className="text-sm text-gray-700 dark:text-gray-400 font-semibold">
                  {parse(post?.content)}
               </div>
               <div className="flex justify-between items-center">
                  {authStatus &&
                     (toggleSaveMutation.isPending || isSavedPostLoading ? (
                        <LoaderMini />
                     ) : (
                        <Button
                           text={isSaved ? "Saved" : "Save"}
                           type="button"
                           bgNumber={isSaved ? 1 : 0}
                           onClick={() => toggleSaveMutation.mutate()}
                           disabled={toggleSaveMutation.isPending || isSavedPostLoading}
                        />
                     ))}
                  {isAuthor && (
                     <div className="flex">
                        <Link to={`/edit-post/${post?.$id}`}>
                           <Button text="Edit" type="button" bgNumber={0} />
                        </Link>
                        <Button
                           text="Delete"
                           type="button"
                           bgNumber={2}
                           onClick={() => deleteMutation.mutate()}
                           disabled={deleteMutation.isLoading}
                        />
                     </div>
                  )}
               </div>
               {toggleSaveMutation.isError && (
                  <ErrorMessage error={"Error saving/unsaving post."} />
               )}
               {deleteMutation.isError && (
                  <ErrorMessage error={"Error deleting post. Try again later."} />
               )}
            </div>
            <CommentSection post={post} isAuthor={isAuthor} userData={userData} />
         </div>
         <ErrorMessage error={error} />
      </Container>
   );
}
