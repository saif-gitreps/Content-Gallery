import { Container, Logo, Hamburger, DpDropdownMenuButton, SearchBar } from "../index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import getNavItems from "./navItems";

function Header() {
   const { status: authStatus, userData } = useSelector((state) => state.auth);
   const navigate = useNavigate();
   const [dp, setDp] = useState("/blank-dp.png");

   const navItems = getNavItems(authStatus, userData);

   useEffect(() => {
      if (userData && authStatus) {
         setDp(userData.prefs?.profilePicture);
      } else {
         setDp("/blank-dp.png");
      }
   }, [userData, authStatus]);

   return (
      <header className="py-2 shadow bg-background-lightWhite dark:bg-background-darkBlack font-medium">
         <Container className="max-w-7xl">
            <nav className="flex">
               {authStatus && (
                  <div className="hidden items-center sm:flex mx-4">
                     <DpDropdownMenuButton
                        src={dp}
                        navItems={navItems}
                        authStatus={authStatus}
                     />
                  </div>
               )}

               <SearchBar />

               <ul className={`ml-auto hidden sm:flex`}>
                  {navItems.map((item) =>
                     item.active && !item.forDropDownMenu ? (
                        <li key={item.name} className="flex items-center">
                           <button
                              onClick={() => navigate(item.slug)}
                              className="text-sm md:text-base xl:text-lg inline-bock p-2 duration-300 hover:shadow-md rounded-lg dark:hover:bg-background-darkHover dark:hover:text-text-dark dark:text-text-dark"
                           >
                              {item.name}
                           </button>
                        </li>
                     ) : null
                  )}
               </ul>
               <div className="mx-2 flex justify-center items-center">
                  <Link to="/">
                     <Logo className="p-1 rounded-full duration-300 hover:shadow-md lg:w-16 dark:invert" />
                  </Link>
               </div>
               <div className="sm:hidden ml-auto">
                  <Hamburger navItems={navItems} logutButton={authStatus} />
               </div>
            </nav>
         </Container>
      </header>
   );
}

export default Header;
