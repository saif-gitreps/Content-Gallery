import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogoutButton } from "../index";

function DpDropdownMenuButton({ src, authStatus, navItems }) {
   const [open, setOpen] = useState(false);
   const navigate = useNavigate();
   const dropdownRef = useRef(null);
   const dpRef = useRef(null);

   useEffect(() => {
      /*
          event.target is the MOUSE CLICK on a dom.
          
          The reason i had to use !dpRef.current.contains(event.target) is so that the onClick() method on the dp which toggles "open" variable to work. Previously without it, when we clicked the dp, the onClick and the event listen for click outside the dropDown dom caused a conflict , so now we eliminate that conflict by including the dp element along with dropDown element to not react to a click. 
          It also prevent the dropdown from immediately closing due to the click listener that listens for clicks outside of the dropdown.
      */
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
   }, []);

   return (
      <>
         <div
            className="flex row px-2 py-2 rounded-xl duration-300 hover:shadow-md hover:cursor-pointer"
            onClick={() => setOpen(!open)}
            ref={dpRef}
         >
            <img src={src} alt="profile" className="w-12 h-12 rounded-2xl" />
            {open ? (
               <p className="ml-2 flex items-center">▲</p>
            ) : (
               <p className="ml-2 flex items-center">▼</p>
            )}
         </div>

         {open && (
            <div
               className="absolute top-20 right-32 w-48 bg-white shadow-lg rounded-xl"
               ref={dropdownRef}
            >
               {navItems.map(
                  (item) =>
                     item.active &&
                     item.forDropDownMenu && (
                        <button
                           key={item.name}
                           onClick={() => navigate(item.slug)}
                           className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                           {item.name}
                        </button>
                     )
               )}
               {authStatus && (
                  <li className="flex items-center">
                     <LogoutButton className="block w-full px-4 py-2 text-left hover:bg-gray-100" />
                  </li>
               )}
            </div>
         )}
      </>
   );
}

export default DpDropdownMenuButton;
