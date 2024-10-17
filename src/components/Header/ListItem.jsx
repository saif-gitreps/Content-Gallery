function ListItem({ children, onClick, className = "", ...props }) {
   return (
      <li
         className={`w-full font-semibold dark:bg-background-darkBlack dark:text-text-dark p-2 text-base text-left hover:cursor-pointer hover:text-gray-500 dark:hover:text-gray-500 duration-200 ${className}`}
         onClick={onClick}
         {...props}
      >
         {children}
      </li>
   );
}

export default ListItem;
