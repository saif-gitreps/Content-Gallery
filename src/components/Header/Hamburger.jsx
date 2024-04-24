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
         <button onClick={openDropDown}>
            <ul className="w-24 duration-300 hover:shadow-lg rounded-lg flex flex-col">
               <li className="font-black">-------</li>
               <li className="font-black">-------</li>
               <li className="font-black">-------</li>
            </ul>
         </button>
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
