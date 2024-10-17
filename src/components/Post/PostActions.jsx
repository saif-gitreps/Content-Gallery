import { useState, useRef } from "react";
import { EllipsisVertical } from "lucide-react";
import ListItem from "../Header/ListItem";
import useClickOutside from "../../hooks/useClickOutside";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import appwriteService from "../../appwrite/config-appwrite";
import { toast } from "react-toastify";

function PostActions({ isAuthor, post, userData }) {
   const [isActive, setIsActive] = useState(false);
   const dropdownRef = useRef(null);
   const optionRef = useRef(null);
   const navigate = useNavigate();
   useClickOutside([dropdownRef, optionRef], () => setIsActive(false));
   const queryClient = useQueryClient();

   const deleteMutation = useMutation({
      mutationFn: async () => {
         await appwriteService.deletePost(post?.$id);
         await appwriteService.deleteFile(post?.featuredImage);
      },
      onSuccess: () => {
         queryClient.invalidateQueries("posts");
         queryClient.invalidateQueries(["myPosts", userData.$id]);
         toast.success("Post deleted successfully");
         navigate("/");
      },
      onError: () =>
         toast.error("Something went wrong while deleting post, try again later"),
   });

   return (
      <div className="relative">
         <EllipsisVertical
            size={32}
            className={`dark:text-white hover:cursor-pointer hover:opacity-50 duration-200 ${
               isActive && "rotate-90"
            }`}
            onClick={() => setIsActive(!isActive)}
            ref={optionRef}
         />
         {isActive && (
            <ul className="dropdown-menu top-7 right-0 border" ref={dropdownRef}>
               <ListItem
                  children="Copy Link"
                  onClick={() => {
                     navigator.clipboard.writeText(window.location.href);
                     toast.success("Link copied to clipboard");
                  }}
               />

               {isAuthor && (
                  <ListItem
                     children="Edit"
                     onClick={() => navigate(`/edit-post/${post?.$id}`)}
                  />
               )}

               {isAuthor && (
                  <ListItem
                     children="Delete"
                     className="text-red-500 dark:text-red-700"
                     onClick={() => deleteMutation.mutate()}
                  />
               )}
            </ul>
         )}
      </div>
   );
}

export default PostActions;
