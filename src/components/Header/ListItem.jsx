import React from "react";

function ListItem({ children, className = "", ...props }) {
   return (
      <li
         {...props}
         className={`w-full dark:bg-background-darkBlack dark:text-text-dark px-4 text-xs lg:text-base py-2 text-left duration-300 hover:cursor-pointer hover:bg-background-lightGray dark:hover:bg-background-darkHover dark:rounded-none ${className}`}
      >
         {children}
      </li>
   );
}

export default ListItem;
