import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Input, Select, SaveAndCancelDiv, LoaderMini, ErrorMessage } from "../index";
import appwriteService from "../../appwrite/config-appwrite";

function PostForm({ post, pageTitle = "Create" }) {
   const [imageSrc, setImageSrc] = useState(null);
   const navigate = useNavigate();
   const userData = useSelector((state) => state.auth.userData);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   const { register, handleSubmit, reset } = useForm({
      defaultValues: {
         title: post?.title || "",
         content: post?.content || "",
         status: post?.status || "active",
      },
   });

   const submit = async (data) => {
      setError("");
      setLoading(true);
      try {
         if (data.image[0] && data.image[0].size > 1024 * 1024) {
            setError("Image size should be less than 1MB.");
            setLoading(false);
            return;
         }

         let file;
         if (data.image && data.image[0]) {
            file = await appwriteService.uploadFile(data.image[0]);
            if (post && post.featuredImage) {
               await appwriteService.deleteFile(post.featuredImage);
            }
         }

         if (post) {
            const dbPost = await appwriteService.updatePost(post.$id, {
               ...data,
               featuredImage: file ? file.$id : post.featuredImage,
            });

            if (dbPost) {
               navigate(`/post/${dbPost.$id}`);
            }
         } else {
            const dbPost = await appwriteService.createPost({
               ...data,
               featuredImage: file ? file.$id : undefined,
               userId: userData.$id,
            });

            if (dbPost) {
               navigate(`/post/${dbPost.$id}`);
            }
         }
      } catch (error) {
         console.error("Error submitting post:", error);
         setError("Something went wrong, please try again.");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      const fetchImageSrc = async () => {
         setError("");
         if (post && post.featuredImage) {
            try {
               const imageUrl = await appwriteService.getFilePrev(post.featuredImage);
               setImageSrc(imageUrl);
            } catch (error) {
               console.error("Error loading image:", error);
               setError("Failed to load image.");
            }
         }
      };

      fetchImageSrc();
      reset(post);
   }, [post, reset]);

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
      <div className="flex flex-col items-center dark:bg-background-darkBlack dark:text-text-dark max-w-lg p-5 m-auto rounded-xl shadow-md">
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
               {...register("title", { required: true })}
            />
            <Input
               label="Content:"
               className="text-lg font-normal"
               type="text"
               {...register("content", { required: true })}
            />
            <Input
               label="Featured Image:"
               type="file"
               className=""
               {...register("image")}
               onChange={imagePreview}
            />
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

            {loading ? (
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
            <ErrorMessage error={error} />
         </form>
      </div>
   );
}

export default PostForm;
