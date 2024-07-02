import React from "react";

function ListItem({ children, ...props }) {
   return (
      <li
         {...props}
         className="w-full dark:bg-background-darkBlack dark:text-text-dark px-4 text-xs lg:text-base py-2 text-left duration-300 hover:cursor-pointer hover:shadow-md  dark:hover:bg-background-darkHover dark:rounded-none"
      >
         {children}
      </li>
   );
}

export default ListItem;
