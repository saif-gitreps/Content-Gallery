import {
   Container,
   Loader,
   CommentSection,
   Button,
   LoaderMini,
   ErrorMessage,
   ParentContainer,
   UserHeader,
} from "../components";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Query } from "appwrite";
import parse from "html-react-parser";
import { useParams, useNavigate, Link } from "react-router-dom";
import appwriteService from "../appwrite/config-appwrite";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Post() {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const [saveLoader, setSaveLoader] = useState(false);
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

   if (postError) {
      setError("Error fetching post. Redirecting to home page.");
      setTimeout(() => navigate("/"), 2000);
   }

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

   const isAuthor = post && userData ? post.user.$id === userData.$id : false;

   if (loading || isLoading) {
      return <Loader />;
   }
   if (error || imageError || savedPostError) {
      return <ErrorMessage error={error || imageError || savedPostError} />;
   }
   return post ? (
      <ParentContainer>
         <Container>
            <div className="mb-7 p-6 border rounded-2xl  shadow-lg space-y-3 bg-background-lightWhite dark:bg-background-darkBlack dark:text-text-dark">
               <div>
                  <UserHeader
                     src={post.user.profilePicture}
                     name={post.user.name}
                     $id={post.user.$id}
                     date={post.$createdAt}
                  />
                  <h1 className="text-xl font-semibold">{post.title}</h1>
                  <div className="text-base text-gray-600 font-medium">
                     {parse(post.content)}
                  </div>
               </div>
               <div>
                  <div className="relative flex justify-end"></div>
                  <div className="flex justify-center">
                     <img
                        src={image}
                        alt={post.title}
                        className="rounded-2xl h-96 object-contain"
                     />
                  </div>
               </div>
               <div className="flex  justify-between items-center">
                  {authStatus &&
                     (saveLoader || isSavedPostLoading ? (
                        <LoaderMini />
                     ) : (
                        <Button
                           text={!isSaved ? "Save" : "Saved"}
                           type="button"
                           className="rounded-lg h-12"
                           bgNumber={!isSaved ? 0 : 1}
                           onClick={() => {
                              setSaveLoader(true);
                              toggleSaveMutation.mutate();
                           }}
                        />
                     ))}

                  {isAuthor && (
                     <div className="flex">
                        <Link to={`/edit-post/${post.$id}`}>
                           <Button text="Edit" type="button" bgNumber={0} />
                        </Link>
                        <Button
                           text="Delete"
                           type="button"
                           bgNumber={2}
                           onClick={deletePost}
                        />
                     </div>
                  )}
               </div>
            </div>
            <CommentSection post={post} isAuthor={isAuthor} userData={userData} />
         </Container>
      </ParentContainer>
   ) : null;
}
