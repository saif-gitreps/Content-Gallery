import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
   Input,
   Select,
   SaveAndCancelDiv,
   LoaderMini,
   ErrorMessage,
   Button,
} from "../index";
import appwriteService from "../../appwrite/config-appwrite";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ImageCropModal from "../Common/ImageCropModal";
import { toast } from "react-toastify";

function PostForm({ post, pageTitle = "Create" }) {
   const [imageSrc, setImageSrc] = useState(null);
   const [charCount, setCharCount] = useState(post?.content.length || 0);
   const [toggleModal, setToggleModal] = useState(false);
   const navigate = useNavigate();
   const userData = useSelector((state) => state.auth.userData);
   const queryClient = useQueryClient();

   const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
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
         let file;
         if (data.featuredImage && typeof data.featuredImage !== "string") {
            if (data.featuredImage.size > 1024 * 1024) {
               toast.error("Image size should be less than 1MB");
               throw new Error();
            }
            file = await appwriteService.uploadFile(data.featuredImage);
            if (post && post.featuredImage) {
               await appwriteService.deleteFile(post.featuredImage);
            }
         }

         if (post) {
            if (!file)
               return await appwriteService.updatePost(post.$id, {
                  ...data,
               });

            const featuredImageSrc = await appwriteService.getFilePrev(file.$id);

            return await appwriteService.updatePost(post.$id, {
               ...data,
               featuredImage: file.$id,
               featuredImageSrc: featuredImageSrc.href,
            });
         } else {
            if (!file) {
               toast.error("Please upload an image");
               throw new Error();
            }

            const featuredImageSrc = await appwriteService.getFilePrev(file.$id);

            return await appwriteService.createPost({
               ...data,
               featuredImage: file.$id,
               userId: userData.$id,
               featuredImageSrc: featuredImageSrc.href,
            });
         }
      },
      onSuccess: (dbPost) => {
         if (dbPost) {
            queryClient.invalidateQueries("posts");
            queryClient.invalidateQueries(["myPosts", userData.$id]);
            toast.success(
               `Post ${pageTitle === "Create" ? "added" : "updated"} successfully`
            );
            navigate(`/post/${dbPost.$id}`);
         }
      },
      onError: () =>
         toast.error(
            `Something went wrong while ${
               pageTitle === "Create" ? "adding" : "updating"
            } post, please try again`
         ),
   });

   const submit = (data) => {
      updatePostMutation.mutate(data);
   };

   const { isLoading: isImageLoading, error: imageError } = useQuery({
      queryKey: ["imageUrl", post?.featuredImage],
      queryFn: async ({ queryKey }) => {
         const [_, featuredImage] = queryKey;
         if (!featuredImage) {
            throw new Error("No featured image available");
         }

         const imagePreview = await appwriteService.getFilePrev(featuredImage);
         if (!imagePreview) {
            throw new Error("Error fetching image preview");
         }

         setImageSrc(imagePreview);
         return imagePreview;
      },
      enabled: !!post && !!post?.featuredImage,
      refetchOnWindowFocus: false,
   });

   const handleImageCrop = (croppedImage) => {
      setImageSrc(croppedImage);

      // Extract the image type from the base64 string
      const imageType = croppedImage.split(";")[0].split("/")[1];

      // Convert base64 to file
      fetch(croppedImage)
         .then((res) => res.blob())
         .then((blob) => {
            // Generate a unique filename with the correct extension
            const uniqueFilename = `image-${crypto.randomUUID()}.${imageType}`;
            const file = new File([blob], uniqueFilename, { type: `image/${imageType}` });
            setValue("featuredImage", file);
         });
   };

   return (
      <div className="flex flex-col items-center bg-background-lightWhite dark:bg-background-darkBlack dark:text-text-dark max-w-xl p-5 m-auto rounded-xl shadow-md">
         <h2 className="text-center text-2xl font-bold leading-tight">
            {pageTitle} Post
         </h2>
         <form
            onSubmit={handleSubmit(submit)}
            className="mt-6 space-y-4 flex flex-col justify-center w-full"
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

            <Select
               label="Status:"
               options={["Active", "Inactive"]}
               className="font-normal"
               {...register("status", { required: true })}
            />

            <div className="flex space-x-2 items-center">
               <p className="inline-block mb-1 pl -1">Featured Image:</p>
               <Button
                  text={imageSrc ? "Change image" : "Upload image"}
                  onClick={(e) => {
                     e.preventDefault();
                     setToggleModal(true);
                  }}
               />
            </div>

            {toggleModal && (
               <ImageCropModal
                  setToggleModal={setToggleModal}
                  imageSrc={imageSrc}
                  setImageSrc={handleImageCrop}
               />
            )}

            {imageSrc && (
               <div className="w-full mb-4">
                  <img src={imageSrc} alt={post?.title || ""} className="rounded-lg" />
               </div>
            )}

            {(errors.image || imageError) && (
               <ErrorMessage error="Error loading image, try again." />
            )}

            {isImageLoading && (
               <div className="flex items-center justify-center">
                  <LoaderMini />
               </div>
            )}

            {updatePostMutation?.isPending ? (
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
         </form>
      </div>
   );
}

export default PostForm;
