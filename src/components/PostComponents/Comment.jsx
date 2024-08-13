import formatDate from "../../utils/formatDate";
import { useSelector } from "react-redux";
import { Button, UserHeader } from "../../components";

function Comment({ comment, isAuthor, onDelete, userData, optimisticComment = false }) {
   const authStatus = useSelector((state) => state.auth.status);

   const isOptimistic = comment?.$id === optimisticComment?.$id;

   return (
      <li
         className={`mb-2 flex justify-between border-b-1 p-3 rounded-lg shadow-md ${
            isOptimistic ? "opacity-50" : ""
         }`}
      >
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
                  className="h-11 text-xs sm:text-sm p-1"
                  bgNumber={2}
                  onClick={() => onDelete(comment.$id)}
               />
            )}
      </li>
   );
}

export default Comment;
