import {
   Container,
   Loader,
   PostActions,
   CommentSection,
   SharableLinks,
   Button,
   LoaderMini,
   ErrorMessage,
   ParentContainer,
} from "../components";
import { useEffect, useState } from "react";
import { useParams, useNavigate, redirect } from "react-router-dom";
import appwriteService from "../appwrite/config-appwrite";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { Query } from "appwrite";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Post() {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const [saveLoader, setSaveLoader] = useState(false);
   const [showShareLinks, setShowShareLinks] = useState(false);
   const queryClient = useQueryClient();
   const { id } = useParams();

   const navigate = useNavigate();
   const userData = useSelector((state) => state.auth.userData);
   const authStatus = useSelector((state) => state.auth.status);

   const {
      data: post,
      error: postError,
      isLoading,
   } = useQuery({
      queryKey: ["post", id],
      queryFn: async () => {
         const fetchedPost = await appwriteService.getPost(id);
         if (!fetchedPost) {
            throw new Error("Error fetching post");
         }
         return fetchedPost;
      },
      enabled: !!id,
   });

   const { data: image, error: imageError } = useQuery({
      queryKey: ["image", post?.featuredImage],
      queryFn: async () => {
         return await appwriteService.getFilePrev(post.featuredImage);
      },
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
      enabled: userData?.$id && !!post?.$id,
   });

   useEffect(() => {
      if (postError) {
         setError("Error fetching post. Redirecting to home page.");
         setTimeout(() => navigate("/"), 2000);
      }
      if (savedPostError) {
         setError(savedPostError);
      }
      if (imageError) {
         setError(imageError);
      }
   }, [postError, imageError, savedPostError]);

   const deleteMutation = useMutation({
      mutationFn: async () => {
         await appwriteService.deletePost(post.$id);
         await appwriteService.deleteFile(post.featuredImage);
      },
      onError: () => {
         setError("Error deleting post. Please try again later.");
      },
      onSuccess: () => {
         setLoading(false);
         navigate("/");
      },
   });

   const deletePost = async () => {
      setLoading(true);
      deleteMutation.mutate();
   };

   const toggleSaveMutation = useMutation({
      mutationFn: async () => {
         if (isSaved) {
            await appwriteService.unsavePost(isSaved.$id);
            return null;
         } else {
            return await appwriteService.savePost(userData.$id, post.$id);
         }
      },
      onMutate: async () => {
         // Cancel any outgoing refetches
         await queryClient.cancelQueries(["saved", userData.$id, post.$id]);

         const previousSaved = queryClient.getQueryData([
            "saved",
            userData.$id,
            post.$id,
         ]);

         // Optimistically update to the new value
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
         setSaveLoader(false);
      },
   });

   const toggleSave = () => {
      setSaveLoader(true);
      toggleSaveMutation.mutate();
   };

   const isAuthor = post && userData ? post.userId === userData.$id : false;

   if (loading || isLoading) {
      return <Loader />;
   }
   if (error) {
      return <ErrorMessage error={error} />;
   }
   return post ? (
      <ParentContainer>
         <Container>
            <div className="mb-7 p-6 border rounded-2xl  shadow-lg space-y-3 bg-background-lightWhite dark:bg-background-darkBlack dark:text-text-dark">
               <div>
                  <h1 className="text-xl font-bold">{post.title}</h1>
                  <div className="text-base font-medium">{parse(post.content)}</div>
               </div>
               <div>
                  <div className="relative flex justify-end">
                     {isAuthor && <PostActions postId={post.$id} onDelete={deletePost} />}
                  </div>
                  <div className="flex justify-center">
                     <img
                        src={image}
                        alt={post.title}
                        className="rounded-2xl h-96 object-contain"
                     />
                  </div>
               </div>
               <div className="flex justify-end items-center">
                  {authStatus &&
                     (saveLoader || isSavedPostLoading ? (
                        <LoaderMini />
                     ) : (
                        <Button
                           text={!isSaved ? "Save" : "Saved"}
                           type="button"
                           className="rounded-lg h-12"
                           bgNumber={!isSaved ? 0 : 1}
                           onClick={toggleSave}
                        />
                     ))}

                  <div className="relative">
                     {!showShareLinks ? (
                        <img
                           onClick={() => setShowShareLinks(true)}
                           src="/share-icon.png
                     "
                           alt="Share"
                           className="w-14 p-3 rounded-r-lg hover:cursor-pointer hover:shadow-md rounded-xl duration-300 dark:invert"
                        />
                     ) : (
                        <img
                           onClick={() => setShowShareLinks(false)}
                           src="/delete-button.png"
                           alt="delete"
                           className="w-14 p-3 rounded-r-lg hover:cursor-pointer hover:shadow-md rounded-xl duration-300"
                        />
                     )}

                     {showShareLinks && <SharableLinks />}
                  </div>
               </div>
            </div>
            <CommentSection post={post} isAuthor={isAuthor} userData={userData} />
         </Container>
      </ParentContainer>
   ) : null;
}
