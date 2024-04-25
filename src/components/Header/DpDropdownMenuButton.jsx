import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DpDropdownMenuButton({ src, navItems }) {
   const [open, setOpen] = useState(false);
   const navigate = useNavigate();
   const dropdownRef = useRef(null);

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
         >
            <img src={src} alt="profile" className="w-12 h-12 rounded-2xl" />
            <p className="flex items-center">▼</p>
         </div>

         {open && (
            <div
               className="absolute top-20 right-32 w-48 bg-white shadow-lg rounded-xl"
               ref={dropdownRef}
            >
               {navItems.map((item) => (
                  <button
                     key={item.name}
                     onClick={() => navigate(item.slug)}
                     className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                     {item.name}
                  </button>
               ))}
            </div>
         )}
      </>
   );
}

export default DpDropdownMenuButton;
