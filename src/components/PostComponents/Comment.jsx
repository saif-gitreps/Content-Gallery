import { useSelector } from "react-redux";
import { Button, UserHeader } from "../../components";

function Comment({ comment, isAuthor, onDelete, userData, optimisticComment = false }) {
   const authStatus = useSelector((state) => state.auth.status);

   const isOptimistic = comment?.$id === optimisticComment?.$id;

   return (
      <li className={`flex justify-between  ${isOptimistic ? "opacity-50" : ""}`}>
         <div className="items-center w-10/12">
            <UserHeader
               src={comment.user.profilePicture}
               name={comment.user.name}
               $id={comment.user.$id}
               date={isOptimistic ? "Posting..." : comment.$createdAt}
            />
            <div className="ml-1 w-full overflow-hidden text-wrap">
               <p>{comment.content}</p>
            </div>
         </div>
         {!isOptimistic &&
            authStatus &&
            (isAuthor || comment.user.$id === userData.$id) && (
               <Button
                  text="Delete"
                  type="button"
                  className="h-7 p-1 text-xs"
                  bgNumber={2}
                  onClick={() => onDelete(comment.$id)}
               />
            )}
      </li>
   );
}

export default Comment;
