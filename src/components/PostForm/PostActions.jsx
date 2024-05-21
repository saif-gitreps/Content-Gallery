import { Link } from "react-router-dom";

function PostActions({ postId, onDelete }) {
   return (
      <div className="absolute right-1 top-1">
         <Link to={`/edit-post/${postId}`}>
            <button className="text-md py-3 w-16 bg-green-400 duration-300 hover:shadow-md hover:bg-green-100 rounded-lg mr-1">
               Edit
            </button>
         </Link>
         <button
            className="text-md py-3 w-16 bg-red-400 duration-300 hover:shadow-md hover:bg-red-100 rounded-lg"
            onClick={onDelete}
         >
            Delete
         </button>
      </div>
   );
}

export default PostActions;
