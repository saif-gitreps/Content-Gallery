import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { DarkModeToggle, ListItem, LogoutButton } from "../index";
import useClickOutSide from "../../hooks/useClickOutside";

const Hamburger = ({ navItems, logutButton }) => {
   const navigate = useNavigate();
   const [open, setOpen] = useState(false);
   const dropdownRef = useRef(null);
   const hamburgerRef = useRef(null);

   useClickOutSide([dropdownRef, hamburgerRef], () => setOpen(false));

   return (
      <div className="flex flex-col justify-center p-2 relative">
         <div className="flex justify-end">
            <img
               className={`w-16 p-2 dark:invert hover:cursor-pointer hover:shadow-md duration-300 rounded-full ${
                  open ? "rotate-90" : "rotate-0"
               }`}
               ref={hamburgerRef}
               onClick={() => setOpen(!open)}
               src="/hamburger-icon.png"
               alt="Burger"
            />
         </div>
         {open && (
            <ul className="dropdown-menu top-16 right-0 " ref={dropdownRef}>
               {navItems.map((item) =>
                  item.active ? (
                     <ListItem
                        key={item.name}
                        onClick={() => navigate(item.slug)}
                        children={item.name}
                     />
                  ) : null
               )}
               {logutButton && (
                  <li className="flex items-center">
                     <LogoutButton />
                  </li>
               )}
               <DarkModeToggle />
            </ul>
         )}
      </div>
   );
};

export default Hamburger;
