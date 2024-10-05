import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

function PostCard({ $id, title, featuredImageSrc, className = "" }) {
   return (
      <Link to={`/post/${$id}`}>
         <div
            className={`w-full bg-white dark:bg-background-darkBlack dark:text-text-dark duration-300 hover:shadow-md dark:hover:shadow-gray-700 ${className} rounded-2xl overflow-hidden`}
         >
            <div className="w-full flex justify-center items-centers">
               <LazyLoadImage
                  src={featuredImageSrc || "/fallback-mountain.jpg"}
                  alt={title}
                  className="rounded-t-2xl"
                  onError={(e) => (e.target.src = "/fallback-mountain.jpg")}
                  placeholderSrc="/fallback-mountain.jpg"
                  effect="blur"
               />
            </div>

            <h2 className="text-xs sm:text-sm lg:text-base font-bold text-center my-2">
               {title}
            </h2>
         </div>
      </Link>
   );
}

export default PostCard;
