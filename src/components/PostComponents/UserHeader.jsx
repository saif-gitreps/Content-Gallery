import React from "react";
import { Link } from "react-router-dom";
import formatDate from "../../utils/formatDate";

function UserHeader({ src, name, $id, date }) {
   return (
      <div className="flex items-center space-x-2">
         <img src={src || "blank-dp.png"} alt={name} className="w-10 h-10 rounded-full" />
         <div className="flex flex-col space-y-0">
            <Link to={`/profile/${$id}`}>
               <p className="text-base font-bold hover:text-blue-600">@{name}</p>
            </Link>
            <p className="text-xs font-medium text-gray-500">{formatDate(date)}</p>
         </div>
      </div>
   );
}

export default UserHeader;
