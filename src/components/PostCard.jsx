import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config-appwrite";

function PostCard({ $id, title, featuredImage, getFilePrev }) {
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
   }, [featuredImage, getFilePrev]);

   return (
      <Link to={`/post/${$id}`}>
         <div className="w-full bg-gray-200 rounded-lg p-4">
            <div className="w-full justify-center mb-4">
               {imageSrc && <img src={imageSrc} alt={title} className="rounded-xl" />}
            </div>
            <h2 className="text-2xl font-bold">{title}</h2>
         </div>
      </Link>
   );
}

export default PostCard;
