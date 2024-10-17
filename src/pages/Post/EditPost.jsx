import { useEffect, useState } from "react";
import { PostForm } from "../../components";
import appwriteService from "../../appwrite/config-appwrite";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
         toast.error("No such post exists");
         navigate("/");
      }
   }, [id, navigate]);

   return post ? <PostForm post={post} pageTitle="Update" /> : null;
}

export default EditPost;
