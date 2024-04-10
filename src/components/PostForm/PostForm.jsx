import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
import appwriteService from "../../appwrite/config-appwrite";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PostForm({ post }) {
   const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
      defaultValues: {
         title: post?.title || "",
         slug: post?.slug || "",
         content: post?.content || "",
         status: post?.status || "active",
      },
   });

   const navigate = useNavigate();
   const userData = useSelector((state) => state.auth.userData);

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

   // with this ,we can crate a slug using title, replace any spaces inbetwreern with _
   // and the above replace will ignore chars from a-z or A-Z and \d is for digits.
   const slugTransform = useCallback((value) => {
      if (value && typeof value === "string")
         return value.trim().toLowerCase().replace(/\s/g, "_");
      return "";
   }, []);

   useEffect(() => {
      /* watch method is like useEffect for react-hook-form, it watches for any changes in the fields */

      const subscription = watch((value, { name }) => {
         if (name == "title") {
            setValue("slug", slugTransform(value.title, { shouldValidate: true }));
         }
      });

      /*
      return () => { ... }: This is the cleanup function of the useEffect hook. It runs when the component is unmounted or before the effect runs again. In this case, it unsubscribes from the watch subscription to prevent memory leaks or unwanted side effects.

       This is important to prevent memory leaks and ensure that resources are properly released when the component unmounts or when the effect is no longer needed.
      */
      return () => {
         subscription.unsubscribe();
      };
   }, [slugTransform, setValue, watch]);

   return (
      <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
         <div className="w-2/3 px-2">
            <Input
               label="Title :"
               placeholder="Title"
               className="mb-4"
               {...register("title", { required: true })}
            />
            <Input
               label="Slug :"
               placeholder="Slug"
               className="mb-4"
               {...register("slug", { required: true })}
               onInput={(e) => {
                  setValue("slug", slugTransform(e.currentTarget.value), {
                     shouldValidate: true,
                  });
               }}
            />
            {/* <RTE
               label="Content :"
               name="content"
               control={control}
               defaultValue={getValues("content")}
            /> */}
            <Input
               label="Content: "
               type="text"
               placeholder="content"
               {...register("content", { required: true })}
            />
         </div>
         <div className="w-1/3 px-2">
            <Input
               label="Featured Image :"
               type="file"
               className="mb-4"
               accept="image/png, image/jpg, image/jpeg, image/gif"
               {...register("image")}
            />
            {post && (
               <div className="w-full mb-4">
                  <img
                     src={appwriteService.getFilePreview(post.featuredImage)}
                     alt={post.title}
                     className="rounded-lg"
                  />
               </div>
            )}
            <Select
               options={["active", "inactive"]}
               label="Status"
               className="mb-4"
               {...register("status", { required: true })}
            />
            <Button
               type="submit"
               bgColor={post ? "bg-green-500" : undefined}
               className="w-full"
            >
               {post ? "Update" : "Submit"}
            </Button>
         </div>
      </form>
   );
}

export default PostForm;
