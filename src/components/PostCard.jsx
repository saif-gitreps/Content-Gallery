import React from "react";
import appwriteService from "../appwrite/config-appwrite";
import { Link } from "react-router-dom";

// good thing about Link is that it can direct u from the current endpoint
// ex: if your state of endpoint was site/login/info, u can continue after /info.
function PostCard({ $id, title, featuredImage }) {
   return (
      <Link to={`/post/${$id}`}>
         <div className="w-full bg-gray-200 rounded-lg p-4">
            <div className="w-full justify-center mb-4">
               <img
                  src={appwriteService.getFilePreview(featuredImage)}
                  alt={title}
                  className="rounded-xl"
               />
            </div>
            <h2 className="text-2xl font-bold">{title}</h2>
         </div>
      </Link>
   );
}

export default PostCard;
