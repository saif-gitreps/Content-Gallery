import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Input, Select, SaveAndCancelDiv, LoaderMini, ErrorMessage } from "../index";
import appwriteService from "../../appwrite/config-appwrite";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function PostForm({ post, pageTitle = "Create" }) {
   const [imageSrc, setImageSrc] = useState(null);
   const [charCount, setCharCount] = useState(post?.content.length || 0);
   const navigate = useNavigate();
   const userData = useSelector((state) => state.auth.userData);
   const queryClient = useQueryClient();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm({
      defaultValues: {
         title: post?.title || "",
         content: post?.content || "",
         status: post?.status || "active",
         featuredImage: post?.featuredImage || null,
      },
   });

   const updatePostMutation = useMutation({
      mutationFn: async (data) => {
         if (data.image[0] && data.image[0].size > 1024 * 1024) {
            throw new Error("Image size should be less than 1MB.");
         }

         let file;
         if (data.image && data.image[0]) {
            file = await appwriteService.uploadFile(data.image[0]);
            if (post && post.featuredImage) {
               await appwriteService.deleteFile(post.featuredImage);
            }
         }

         if (post) {
            return await appwriteService.updatePost(post.$id, {
               ...data,
               featuredImage: file ? file.$id : post.featuredImage,
            });
         } else {
            if (!file) {
               throw new Error("No image uploaded.");
            }
            return await appwriteService.createPost({
               ...data,
               featuredImage: file.$id,
               userId: userData.$id,
            });
         }
      },
      onSuccess: (dbPost) => {
         if (dbPost) navigate(`/post/${dbPost.$id}`);
         queryClient.invalidateQueries("posts");
         queryClient.invalidateQueries(["myPosts", userData.$id]);
      },
   });

   const submit = (data) => {
      updatePostMutation.mutate(data);
   };

   const {
      data: imageSrcFromDbs,
      isLoading: isImageLoading,
      error: imageError,
   } = useQuery({
      queryKey: ["imageUrl", post?.featuredImage],
      queryFn: async ({ queryKey }) => {
         // Just retrieving the featured image $id from the queryKey
         const [_, featuredImage] = queryKey;
         if (!featuredImage) {
            throw new Error("No featured image available");
         }

         const imagePreview = await appwriteService.getFilePrev(featuredImage);
         if (!imagePreview) {
            throw new Error("Error fetching image preview");
         }

         return imagePreview;
      },
      enabled: !!post && !!post?.featuredImage,
      refetchOnWindowFocus: false,
   });

   useEffect(() => {
      if (imageSrcFromDbs) {
         setImageSrc(imageSrcFromDbs);
      }
   }, [imageSrcFromDbs]);

   const imagePreview = (event) => {
      const file = event.target.files[0];

      if (file) {
         const reader = new FileReader();
         reader.onload = () => {
            setImageSrc(reader.result);
         };
         reader.readAsDataURL(file);
      }
   };

   return (
      <div className="flex flex-col items-center bg-background-lightWhite dark:bg-background-darkBlack dark:text-text-dark max-w-lg p-5 m-auto rounded-xl shadow-md">
         <h2 className="text-center text-2xl font-bold leading-tight">
            {pageTitle} Post
         </h2>
         <form
            onSubmit={handleSubmit(submit)}
            className="mt-6 space-y-4 flex flex-col justify-center"
         >
            <Input
               label="Title:"
               className="text-lg font-normal"
               {...register("title", { required: true, maxLength: 50 })}
            />
            {errors.title && (
               <ErrorMessage error="Title is required and should be less than 50 characters." />
            )}
            <Input
               label={`Content: (${charCount}/250)`}
               className="text-lg font-normal"
               type="textarea"
               {...register("content", { required: true, maxLength: 250 })}
               onChange={(e) => setCharCount(e.target.value.length)}
            />
            {errors.content && (
               <ErrorMessage error="Content is required and should be less than 250 characters." />
            )}
            <Input
               label="Featured Image:"
               type="file"
               className=""
               {...register("image")}
               onChange={imagePreview}
            />
            {(errors.image || imageError) && (
               <ErrorMessage error="Error loading image, try again." />
            )}
            {isImageLoading && (
               <div className="flex items-center justify-center">
                  <LoaderMini />
               </div>
            )}
            {imageSrc && (
               <div className="w-full mb-4">
                  <img src={imageSrc} alt={post?.title || ""} className="rounded-lg" />
               </div>
            )}
            <Select
               label="Status:"
               options={["Active", "Inactive"]}
               className="font-normal"
               {...register("status", { required: true })}
            />

            {updatePostMutation.isPending ? (
               <div className="flex items-center justify-center">
                  <LoaderMini />
               </div>
            ) : (
               <SaveAndCancelDiv
                  saveText={post ? "Update" : "Create"}
                  cancelText="Cancel"
                  cancel={() => {
                     if (post) {
                        navigate(`/post/${post.$id}`);
                     } else {
                        navigate("/");
                     }
                  }}
               />
            )}
            {updatePostMutation.isError && (
               <ErrorMessage error={updatePostMutation.error.message} />
            )}
         </form>
      </div>
   );
}

export default PostForm;