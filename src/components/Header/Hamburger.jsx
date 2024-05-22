import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LogoutButton from "../Header/LogoutButton";

const Hamburger = ({ navItems, logutButton }) => {
   const navigate = useNavigate();
   const [open, setOpen] = useState(false);

   const openDropDown = () => {
      setOpen(!open);
   };

   return (
      <div className="flex flex-col justify-center p-2">
         <img
            className={`w-20 p-2 hover:cursor-pointer hover:shadow-md rounded-full ${
               open ? "rotate-90" : "rotate-0"
            }`}
            onClick={openDropDown}
            src="/hamburger-icon.png"
            alt="Burger"
         />
         <ul>
            {open &&
               navItems.map((item) =>
                  item.active ? (
                     <li key={item.name} className="flex items-center">
                        <button
                           onClick={() => navigate(item.slug)}
                           className="text-lg inline-bock px-3 py-4 duration-300 hover:shadow-md rounded-xl"
                        >
                           {item.name}
                        </button>
                     </li>
                  ) : null
               )}
            {open && logutButton && (
               <li className="flex items-center">
                  <LogoutButton className="text-lg inline-bock px-3 py-4 duration-300 hover:shadow-md hover:bg-red-100 rounded-xl" />
               </li>
            )}
         </ul>
      </div>
   );
};

export default Hamburger;
