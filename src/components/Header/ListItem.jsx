import React from "react";

function ListItem({ children, className = "", ...props }) {
   return (
      <li
         {...props}
         className={`w-full dark:bg-background-darkBlack dark:text-text-dark p-2 text-xs lg:text-base text-left hover:cursor-pointer hover:text-gray-500 dark:hover:text-gray-500 duration-200 ${className}`}
      >
         {children}
      </li>
   );
}

export default ListItem;
