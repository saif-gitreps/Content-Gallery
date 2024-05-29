import {
   Container,
   Loader,
   PostActions,
   CommentSection,
   SharableLinks,
   Button,
   LoaderMini,
} from "../components";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import appwriteService from "../appwrite/config-appwrite";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
   const [image, setImage] = useState("");
   const [saved, setSaved] = useState(null);
   const [post, setPost] = useState(null);
   const [loading, setLoading] = useState(true);
   const [saveLoader, setSaveLoader] = useState(false);
   const [showShareLinks, setShowShareLinks] = useState(false);
   const { id } = useParams();

   const navigate = useNavigate();
   const userData = useSelector((state) => state.auth.userData);

   useEffect(() => {
      const fetchData = async () => {
         try {
            if (!id) {
               navigate("/");
               return;
            }
            const post = await appwriteService.getPost(id);
            if (!post) {
               navigate("/");
               return;
            }

            setPost(post);

            const isSaved = await appwriteService.getSavedPost(userData.$id);
            console.log(isSaved);
            if (isSaved.documents.length > 0) {
               setSaved(isSaved.documents[0]);
            }

            const result = await appwriteService.getFilePrev(post.featuredImage);
            setImage(result);
            setLoading(false);
         } catch (error) {
            console.error("Error fetching post:", error);
            navigate("/");
         }
      };
      fetchData();
   }, [id, navigate, userData.$id]);

   const deletePost = async () => {
      try {
         const status = await appwriteService.deletePost(post.$id);
         if (status) {
            await appwriteService.deleteFile(post.featuredImage);
            navigate("/");
         }
      } catch (error) {
         console.error("Error deleting post:", error);
      }
   };

   const toggleSave = async () => {
      setSaveLoader(true);
      if (saved) {
         setSaveLoader(true);
         await appwriteService.unsavePost(saved.$id);
         setSaved(null);
         setSaveLoader(false);
      } else {
         setSaveLoader(true);
         const savedPost = await appwriteService.savePost(userData.$id, post.$id);
         if (savedPost) {
            setSaved(savedPost);
            setSaveLoader(false);
         }
      }
   };

   const isAuthor = post && userData ? post.userId === userData.$id : false;

   if (loading) {
      return <Loader />;
   }
   return post ? (
      <div className="p-8">
         <Container>
            <div className="mb-7 p-6 border rounded-2xl bg-white shadow-lg space-y-3">
               <div>
                  <h1 className="text-xl font-bold">{post.title}</h1>
                  <div className="text-base font-medium">{parse(post.content)}</div>
               </div>
               <div>
                  <div className="relative flex justify-end">
                     {isAuthor && <PostActions postId={post.$id} onDelete={deletePost} />}
                  </div>
                  <div className="flex justify-center">
                     <img
                        src={image}
                        alt={post.title}
                        className="rounded-2xl h-96 object-contain"
                     />
                  </div>
               </div>
               <div className="flex justify-end items-center">
                  {saveLoader ? (
                     <LoaderMini />
                  ) : (
                     <Button
                        text={!saved ? "Save" : "Saved"}
                        type="button"
                        className="rounded-lg h-12"
                        bgNumber={!saved ? 0 : 1}
                        onClick={toggleSave}
                     />
                  )}

                  <div className="relative">
                     {!showShareLinks ? (
                        <img
                           onClick={() => setShowShareLinks(true)}
                           src="/share-icon.png
                     "
                           alt="Share"
                           className="w-14 p-3 rounded-r-lg hover:cursor-pointer hover:shadow-md rounded-xl duration-300"
                        />
                     ) : (
                        <img
                           onClick={() => setShowShareLinks(false)}
                           src="/delete-button.png"
                           alt="delete"
                           className="w-14 p-3 rounded-r-lg hover:cursor-pointer hover:shadow-md rounded-xl duration-300"
                        />
                     )}

                     {showShareLinks && <SharableLinks />}
                  </div>
               </div>
            </div>
            <CommentSection post={post} isAuthor={isAuthor} userData={userData} />
         </Container>
      </div>
   ) : null;
}
