import React from "react";

function ParentContainer({ children, className = "" }) {
   return (
      <div
         className={`p-3 bg-background-lightGray dark:bg-background-darkGray dark:text-text-dark ${className}`}
      >
         {children}
      </div>
   );
}

export default ParentContainer;
