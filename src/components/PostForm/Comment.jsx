import formatDate from "../../utils/formatDate";
import { useSelector } from "react-redux";

function Comment({ comment, isAuthor, onDelete, userData }) {
   const authStatus = useSelector((state) => state.auth.status);

   return (
      <li className="mb-4 flex justify-between border-b-1 p-3 rounded-lg shadow-md">
         <div className="items-center w-10/12">
            <div className="flex items-center mb-2">
               <img
                  src={comment.avatar || "blank-dp.png"}
                  alt={comment.userName}
                  className="w-10 h-10 rounded-full"
               />
               <p className="font-bold mx-2">{comment.userName}</p>
               <p className="font-medium text-gray-500">
                  {formatDate(comment.$createdAt)}
               </p>
            </div>
            <div className="ml-1 w-full overflow-hidden text-wrap">
               <p>{comment.content}</p>
            </div>
         </div>
         {authStatus && (isAuthor || comment.userId === userData?.$id) && (
            <button
               className="text-sm w-14 h-10 bg-red-400 duration-300 hover:shadow-md hover:bg-red-100 rounded-lg"
               onClick={() => onDelete(comment.$id)}
            >
               Delete
            </button>
         )}
      </li>
   );
}

export default Comment;
