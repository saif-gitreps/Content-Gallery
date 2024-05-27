import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

function SharableLinks() {
   return (
      <div className="absolute right-0 top-12 flex space-x-4 bg-white p-4 rounded-lg shadow-lg">
         <Link
            href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
         >
            <FaFacebook size={32} />
         </Link>
         <Link
            href={`https://twitter.com/intent/tweet?url=${window.location.href}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600"
         >
            <FaTwitter size={32} />
         </Link>
         <Link
            href={`https://www.linkedin.com/shareArticle?url=${window.location.href}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-900"
         >
            <FaLinkedin size={32} />
         </Link>
         <Link
            href={`https://api.whatsapp.com/send?text=${window.location.href}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:text-green-700"
         >
            <FaWhatsapp size={32} />
         </Link>
      </div>
   );
}

export default SharableLinks;
