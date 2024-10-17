import { useState, useEffect } from "react";
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
   CommentSection,
   PostActions,
} from "../../components";
import { LazyLoadImage } from "react-lazy-load-image-component";
import appwriteService from "../../appwrite/config-appwrite";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "react-toastify";

export default function Post() {
   const queryClient = useQueryClient();
   const { id } = useParams();
   const navigate = useNavigate();
   const userData = useSelector((state) => state.auth.userData);
   const authStatus = useSelector((state) => state.auth.status);

   if (!id || id === "undefined" || id === undefined) {
      setTimeout(() => navigate("/"), 1000);
      toast.error("Something went wrong while loading post");
      return <></>;
   }

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
      data: isSaved,
      error: savedPostError,
      isLoading: isSavedPostLoading,
   } = useQuery({
      queryKey: ["saved", userData?.$id, post?.$id],
      queryFn: async () => {
         const savedPosts = await appwriteService.getSavedPosts(
            [
               Query.and([
                  Query.equal("articlesId", post?.$id),
                  Query.equal("userId", userData?.$id),
               ]),
            ],
            0,
            5000
         );

         return savedPosts?.documents.length === 0 ? null : savedPosts?.documents[0];
      },
      enabled: !!post?.$id && !!userData?.$id,
   });

   const toggleSaveMutation = useMutation({
      mutationFn: async () =>
         isSaved
            ? await appwriteService.unsavePost(isSaved.$id)
            : await appwriteService.savePost(userData.$id, post.$id),
      onMutate: async () => {
         // Cancel any outgoing refetches
         await queryClient.cancelQueries(["saved", userData.$id, post.$id]);

         const previousSaved = await queryClient.getQueryData([
            "saved",
            userData.$id,
            post.$id,
         ]);

         await queryClient.setQueryData(["saved", userData.$id, post.$id], (old) => !old);

         return { previousSaved };
      },
      onSuccess: () => {
         if (!isSaved) toast.success("Post unsaved successfully");
         else toast.success("Post saved successfully");
      },
      onError: (context) => {
         toast.error("Something went wrong while saving/unsaving post");
         queryClient.setQueryData(
            ["saved", userData.$id, post.$id],
            context.previousSaved
         );
      },
      onSettled: () => {
         queryClient.invalidateQueries(["saved", userData.$id, post.$id]);
      },
   });

   if (postLoading) return <Loader />;

   if (postError) {
      setTimeout(() => navigate("/"), 1000);
      toast.error("Something went wrong while loading post");
      return <></>;
   }

   const isAuthor = post?.user?.$id === userData?.$id;

   return (
      <Container className="max-w-2xl lg:max-w-5xl flex lg:flex-row flex-col lg:space-x-4 space-y-2 p-2 bg-background-lightWhite dark:bg-background-darkBlack">
         <div className="flex items-start justify-center">
            <LazyLoadImage
               src={post?.featuredImageSrc || "/fallback-mountain.jpg"}
               alt={post?.title}
               className="rounded-xl object-contain sm:max-h-[40rem] sm:max-w-[35rem] lg:mr-auto"
               effect="blur"
            />
         </div>

         <div className="lg:w-2/3 space-y-1 flex flex-col justify-between">
            <div className="space-y-2">
               <div className="flex justify-between">
                  <UserHeader
                     src={post?.user.profilePicture}
                     name={post?.user.name}
                     $id={post?.user.$id}
                     date={post?.$createdAt}
                  />
                  <div className="flex">
                     {authStatus &&
                        !savedPostError &&
                        (!isSaved ? (
                           <Bookmark
                              size={32}
                              className={`dark:text-white hover:cursor-pointer hover:opacity-50 duration-200 ${
                                 (toggleSaveMutation?.isPending || isSavedPostLoading) &&
                                 "opacity-40"
                              }`}
                              onClick={() => toggleSaveMutation.mutate()}
                              disabled={
                                 toggleSaveMutation?.isPending || isSavedPostLoading
                              }
                           />
                        ) : (
                           <BookmarkCheck
                              size={32}
                              className={`text-green-600 dark:text-green-400 hover:cursor-pointer hover:opacity-50 duration-200 ${
                                 (toggleSaveMutation?.isPending || isSavedPostLoading) &&
                                 "opacity-40"
                              }`}
                              onClick={() => toggleSaveMutation.mutate()}
                              disabled={
                                 toggleSaveMutation?.isPending || isSavedPostLoading
                              }
                           />
                        ))}

                     <PostActions isAuthor={isAuthor} post={post} userData={userData} />
                  </div>
               </div>

               <h1 className="text-base font-semibold">{post?.title}</h1>
               <div className="text-sm text-gray-700 dark:text-gray-400 font-semibold">
                  {parse(post?.content)}
               </div>
            </div>
            {savedPostError && (
               <ErrorMessage error="Error loading saved state of the post." />
            )}
            <CommentSection post={post} isAuthor={isAuthor} userData={userData} />
         </div>
      </Container>
   );
}
