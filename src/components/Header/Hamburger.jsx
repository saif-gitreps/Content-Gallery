import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import LogoutButton from "../Header/LogoutButton";
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
               className={`w-16 p-2 hover:cursor-pointer hover:shadow-md duration-300 rounded-full ${
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
                     <li
                        key={item.name}
                        onClick={() => {
                           navigate(item.slug);
                           setOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left duration-300 hover:shadow-md rounded-md hover:cursor-pointer"
                     >
                        {item.name}
                     </li>
                  ) : null
               )}
               {logutButton && (
                  <li className="flex items-center" onClick={() => setOpen(false)}>
                     <LogoutButton className="py-2" />
                  </li>
               )}
            </ul>
         )}
      </div>
   );
};

export default Hamburger;
