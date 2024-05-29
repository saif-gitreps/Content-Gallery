import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config-appwrite";

function PostCard({ $id, title, featuredImage, className = "" }) {
   const [imageSrc, setImageSrc] = useState("");

   useEffect(() => {
      const fetchImageSrc = async () => {
         try {
            const imageUrl = await appwriteService.getFilePrev(featuredImage);
            setImageSrc(imageUrl);
         } catch (error) {
            console.error("Error fetching image preview:", error);
         }
      };

      fetchImageSrc();
   }, [featuredImage]);

   return (
      <Link to={`/post/${$id}`}>
         <div
            className={`w-full bg-white rounded-2xl p-3 duration-300 hover:shadow-lg ${className}`}
         >
            <div className="w-full flex justify-center items-centers mb-2">
               {imageSrc && <img src={imageSrc} alt={title} className="rounded-xl" />}
            </div>
            <h2 className="text-xs sm:text-sm lg:text-base font-bold text-center">
               {title}
            </h2>
         </div>
      </Link>
   );
}

export default PostCard;
