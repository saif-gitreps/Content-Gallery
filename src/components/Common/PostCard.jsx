import { Link } from "react-router-dom";
import appwriteService from "../../appwrite/config-appwrite";
import { useQuery } from "@tanstack/react-query";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

function PostCard({ $id, title, featuredImage, className = "" }) {
   const { data: imageSrc, error } = useQuery({
      queryKey: ["postImage", featuredImage],
      queryFn: async () => {
         return await appwriteService.getFilePrev(featuredImage);
      },
      enabled: !!featuredImage,
   });

   return (
      <Link to={`/post/${$id}`}>
         <div
            className={`w-full bg-white dark:bg-background-darkBlack dark:text-text-dark duration-300 hover:shadow-md dark:hover:shadow-gray-700 ${className} rounded-2xl overflow-hidden`}
         >
            <div className="w-full flex justify-center items-centers">
               <LazyLoadImage
                  src={imageSrc || "/fallback-mountain.jpg"}
                  alt={title}
                  className="rounded-t-2xl"
                  onError={(e) => (e.target.src = "/fallback-mountain.jpg")}
                  placeholderSrc="/fallback-mountain.jpg"
                  effect="blur"
               />
            </div>
            {error && (
               <p className="text-red-500 text-xs text-center">Error loading image</p>
            )}
            <h2 className="text-xs sm:text-sm lg:text-base font-bold text-center my-2">
               {title}
            </h2>
         </div>
      </Link>
   );
}

export default PostCard;
