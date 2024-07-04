import React from "react";

function ParentContainer({ children, className = "" }) {
   return (
      <div
         className={`py-8 bg-background-lightGray dark:bg-background-darkGray dark:text-text-dark ${className}`}
      >
         {children}
      </div>
   );
}

export default ParentContainer;
