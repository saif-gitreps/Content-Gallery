import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DarkModeToggle, ListItem, LogoutButton } from "../index";
import useClickOutSide from "../../hooks/useClickOutside";
import { LazyLoadImage } from "react-lazy-load-image-component";

function DpDropdownMenuButton({ src, authStatus, navItems }) {
   const [open, setOpen] = useState(false);
   const navigate = useNavigate();
   const dropdownRef = useRef(null);
   const dpRef = useRef(null);

   useClickOutSide([dropdownRef, dpRef], () => setOpen(false));

   return (
      <>
         <div
            className="flex p-1 rounded-lg duration-300 hover:shadow-md dark:hover:bg-background-darkHover hover:cursor-pointer"
            onClick={() => setOpen(!open)}
            ref={dpRef}
         >
            <LazyLoadImage
               src={src}
               alt="Dp"
               className="w-11 h-11 lg:w-12 lg:h-12 rounded-full"
               effect="blur"
               onError={(e) => (e.target.src = "/blank-dp.png.jpg")}
            />

            <p
               className={`ml-1 flex items-center text-xs dark:text-white ${
                  !open && "rotate-180"
               }`}
            >
               ▲
            </p>
         </div>

         {open && (
            <ul className="dropdown-menu border top-14 lg:top-14" ref={dropdownRef}>
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
               {authStatus && <LogoutButton />}
               <DarkModeToggle />
            </ul>
         )}
      </>
   );
}

export default DpDropdownMenuButton;
