import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config-appwrite";
import { useQuery } from "@tanstack/react-query";
import { LoaderMini } from "./Loader";

function PostCard({ $id, title, featuredImage, className = "" }) {
   const {
      data: imageSrc,
      error,
      isLoading,
   } = useQuery({
      queryKey: ["postImage", featuredImage],
      queryFn: async () => {
         return await appwriteService.getFilePrev(featuredImage);
      },
      enabled: !!featuredImage,
   });

   return (
      <Link to={`/post/${$id}`}>
         <div
            className={`w-full bg-white dark:bg-background-darkBlack dark:text-text-dark rounded-2xl p-3 duration-300 hover:shadow-md dark:hover:shadow-gray-700 ${className}`}
         >
            <div className="w-full flex justify-center items-centers mb-2">
               {imageSrc && <img src={imageSrc} alt={title} className="rounded-xl" />}
            </div>
            {isLoading && <LoaderMini />}
            {error && (
               <p className="text-red-500 text-xs text-center">Error loading image</p>
            )}
            <h2 className="text-xs sm:text-sm lg:text-base font-bold text-center">
               {title}
            </h2>
         </div>
      </Link>
   );
}

export default PostCard;
