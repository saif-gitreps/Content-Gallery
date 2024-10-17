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
      <header className="py-1 shadow bg-background-lightWhite dark:bg-background-darkBlack font-medium">
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

               <ul className="ml-auto hidden md:flex space-x-1">
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

               <div className="ml-auto md:mx-2 flex justify-center items-center">
                  <Link to="/">
                     <Logo className="duration-300 hover:opacity-70 w-24 dark:invert" />
                  </Link>
                  <Hamburger navItems={navItems} logutButton={authStatus} />
               </div>
            </nav>
         </Container>
      </header>
   );
}

export default Header;
