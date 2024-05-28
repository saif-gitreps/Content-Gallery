import { Link } from "react-router-dom";
import { Button } from "../../components";

function PostActions({ postId, onDelete }) {
   return (
      <div className="absolute">
         <Link to={`/edit-post/${postId}`}>
            <Button text="Edit" type="button" bgNumber={0} />
         </Link>
         <Button text="Delete" type="button" bgNumber={2} onClick={onDelete} />
      </div>
   );
}

export default PostActions;
