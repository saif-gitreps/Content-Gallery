import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DarkModeToggle, ListItem, LogoutButton } from "../index";
import useClickOutSide from "../../hooks/useClickOutside";

function DpDropdownMenuButton({ src, authStatus, navItems }) {
   const [open, setOpen] = useState(false);
   const navigate = useNavigate();
   const dropdownRef = useRef(null);
   const dpRef = useRef(null);

   useClickOutSide([dropdownRef, dpRef], () => setOpen(false));

   return (
      <>
         <div
            className="flex p-1 rounded-lg duration-300 hover:shadow-md hover:cursor-pointer"
            onClick={() => setOpen(!open)}
            ref={dpRef}
         >
            <img
               src={src}
               alt="profile"
               className="w-11 h-11  lg:w-14 lg:h-14 rounded-full"
            />
            {open ? (
               <p className="ml-1 flex items-center">▲</p>
            ) : (
               <p className="ml-1 flex items-center">▼</p>
            )}
         </div>

         {open && (
            <ul className="dropdown-menu top-14 lg:top-16" ref={dropdownRef}>
               {navItems.map(
                  (item) =>
                     item.active &&
                     item.forDropDownMenu && (
                        <ListItem
                           key={item.name}
                           onClick={() => navigate(item.slug)}
                           children={item.name}
                        />
                     )
               )}
               {authStatus && (
                  <li className="flex items-center">
                     <LogoutButton />
                  </li>
               )}
               <DarkModeToggle />
            </ul>
         )}
      </>
   );
}

export default DpDropdownMenuButton;
