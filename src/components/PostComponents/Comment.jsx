import formatDate from "../../utils/formatDate";
import { useSelector } from "react-redux";
import { Button } from "../../components";

function Comment({ comment, isAuthor, onDelete, userData }) {
   const authStatus = useSelector((state) => state.auth.status);

   const extractUserId = (comment) => {
      return comment.$permissions[2].substring(13, comment.$permissions[2].length - 2);
   };

   return (
      <li className="mb-4 flex justify-between border-b-1 p-3 rounded-lg shadow-md">
         <div className="items-center w-10/12">
            <div className="flex items-center mb-2">
               <img
                  src={comment.avatar || "blank-dp.png"}
                  alt={comment.userName}
                  className="w-10 h-10 rounded-full"
               />
               <p className="font-semibold mx-1">{comment.userName}</p>
               <p className="text-sm font-medium text-gray-500">
                  {formatDate(comment.$createdAt)}
               </p>
            </div>
            <div className="ml-1 w-full overflow-hidden text-wrap">
               <p>{comment.content}</p>
            </div>
         </div>
         {authStatus && (isAuthor || extractUserId(comment) === userData?.$id) && (
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
