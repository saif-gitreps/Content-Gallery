import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogoutButton } from "../index";

function DpDropdownMenuButton({ src, authStatus, navItems }) {
   const [open, setOpen] = useState(false);
   const navigate = useNavigate();
   const dropdownRef = useRef(null);
   const dpRef = useRef(null);

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target) &&
            !dpRef.current.contains(event.target)
         ) {
            setOpen(false);
         }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [open]);

   return (
      <>
         <div
            className="flex p-2 rounded-full duration-300 hover:shadow-md hover:cursor-pointer"
            onClick={() => setOpen(!open)}
            ref={dpRef}
         >
            <img src={src} alt="profile" className="w-16 h-16 rounded-full" />
            {open ? (
               <p className="ml-2 flex items-center">▲</p>
            ) : (
               <p className="ml-2 flex items-center">▼</p>
            )}
         </div>

         {open && (
            <ul className="dropdown-menu " ref={dropdownRef}>
               {navItems.map(
                  (item) =>
                     item.active &&
                     item.forDropDownMenu && (
                        <li
                           key={item.name}
                           onClick={() => navigate(item.slug)}
                           className="w-full px-4 py-2 text-left duration-300 hover:cursor-pointer hover:shadow-md rounded-md"
                        >
                           {item.name}
                        </li>
                     )
               )}
               {authStatus && (
                  <li className="flex items-center">
                     <LogoutButton />
                  </li>
               )}
            </ul>
         )}
      </>
   );
}

export default DpDropdownMenuButton;
