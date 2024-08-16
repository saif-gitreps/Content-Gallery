import { useEffect, useState } from "react";
import PostForm from "./PostComponents/PostForm";
import appwriteService from "../../appwrite/config-appwrite";
import { useParams, useNavigate } from "react-router-dom";

function EditPost() {
   const [post, setPost] = useState(null);
   const { id } = useParams();
   const navigate = useNavigate();

   useEffect(() => {
      if (id) {
         appwriteService.getPost(id).then((post) => {
            if (post) {
               setPost(post);
            }
         });
      } else {
         navigate("/");
      }
   }, [id, navigate]);

   return post ? <PostForm post={post} pageTitle="Update" /> : null;
}

export default EditPost;
