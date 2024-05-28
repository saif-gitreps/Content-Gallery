import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Input, Select, SaveAndCancelDiv } from "../index";
import appwriteService from "../../appwrite/config-appwrite";

function PostForm({ post, pageTitle = "Create" }) {
   const [imageSrc, setImageSrc] = useState(null);
   const navigate = useNavigate();
   const userData = useSelector((state) => state.auth.userData);

   const { register, handleSubmit } = useForm({
      defaultValues: {
         title: post?.title || "",
         content: post?.content || "",
         status: post?.status || "active",
      },
   });

   const submit = async (data) => {
      if (post) {
         const file = data.image[0]
            ? await appwriteService.uploadFile(data.image[0])
            : null;

         if (file) {
            appwriteService.deleteFile(post.featuredImage);
         }

         const dbPost = await appwriteService.updatePost(post.$id, {
            ...data,
            featuredImage: file ? file.$id : undefined,
         });

         if (dbPost) {
            navigate(`/post/${dbPost.$id}`);
         }
      } else {
         const file = await appwriteService.uploadFile(data.image[0]);

         if (file) {
            const fileId = file.$id;
            data.featuredImage = fileId;
            const dbPost = await appwriteService.createPost({
               ...data,
               userId: userData.$id,
            });

            if (dbPost) {
               navigate(`/post/${dbPost.$id}`);
            }
         }
      }
   };

   useEffect(() => {
      const fetchImageSrc = async () => {
         try {
            if (post) {
               const imageUrl = await appwriteService.getFilePrev(post.featuredImage);
               setImageSrc(imageUrl);
            }
         } catch (error) {
            console.error("Error fetching image preview:", error);
         }
      };
      fetchImageSrc();
   }, [post?.featuredImage, post]);

   return (
      <div className="flex flex-col items-center bg-white max-w-lg p-5 m-auto rounded-xl shadow-md">
         <h2 className="text-center text-2xl font-bold leading-tight">
            {pageTitle} Post
         </h2>
         <form
            onSubmit={handleSubmit(submit)}
            className="mt-6 space-y-4 flex flex-col justify-center"
         >
            <Input
               label="Title :"
               className="text-xl font-normal"
               {...register("title", { required: true })}
            />
            <Input
               label="Content: "
               className="text-xl font-normal"
               type="text"
               {...register("content", { required: true })}
            />
            <Input
               label="Featured Image :"
               type="file"
               className=""
               {...register("image")}
               onChange={(event) => {
                  const file = event.target.files[0];
                  if (file) {
                     const reader = new FileReader();
                     reader.onload = () => {
                        setImageSrc(reader.result);
                     };
                     reader.readAsDataURL(file);
                  }
               }}
            />
            {imageSrc && (
               <div className="w-full mb-4">
                  <img src={imageSrc} alt={post?.title || ""} className="rounded-lg" />
               </div>
            )}
            <Select
               label="Status: "
               options={["Active", "Inactive"]}
               className="mb-4"
               {...register("status", { required: true })}
            />

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
         </form>
      </div>
   );
}

export default PostForm;
