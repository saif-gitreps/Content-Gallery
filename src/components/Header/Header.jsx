import {
   Container,
   Logo,
   Hamburger,
   DpDropdownMenuButton,
   SearchBar,
   ListItem,
} from "../index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import getNavItems from "./navItems";

function Header() {
   const { status: authStatus, userData } = useSelector((state) => state.auth);
   const navigate = useNavigate();

   const navItems = getNavItems(authStatus, userData);

   return (
      <header className="py-2 shadow bg-background-lightWhite dark:bg-background-darkBlack font-medium">
         <Container className="max-w-7xl">
            <nav className="flex">
               {authStatus && (
                  <div className="hidden items-center sm:flex mx-4">
                     <DpDropdownMenuButton
                        src={userData?.profilePicture}
                        navItems={navItems}
                        authStatus={authStatus}
                     />
                  </div>
               )}

               <SearchBar />

               <ul className="ml-auto hidden sm:flex space-x-2">
                  {navItems.map(
                     (item) =>
                        item.active &&
                        !item.forDropDownMenu && (
                           <ListItem
                              key={item.name}
                              className="flex items-center text-nowrap"
                              onClick={() => navigate(item.slug)}
                           >
                              {item.name}
                           </ListItem>
                        )
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
