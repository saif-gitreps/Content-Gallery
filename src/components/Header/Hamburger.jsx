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
         <div className="flex justify-end">
            <img
               className={`w-20 p-2 hover:cursor-pointer hover:shadow-md duration-300 rounded-full ${
                  open ? "rotate-90" : "rotate-0"
               }`}
               onClick={openDropDown}
               src="/hamburger-icon.png"
               alt="Burger"
            />
         </div>
         <ul>
            {open &&
               navItems.map((item) =>
                  item.active ? (
                     <li
                        key={item.name}
                        onClick={() => navigate(item.slug)}
                        className="w-full px-4 py-2 text-left duration-300 hover:shadow-md rounded-md hover:cursor-pointer"
                     >
                        {item.name}
                     </li>
                  ) : null
               )}
            {open && logutButton && (
               <li className="flex items-center">
                  <LogoutButton className="py-2" />
               </li>
            )}
         </ul>
      </div>
   );
};

export default Hamburger;
