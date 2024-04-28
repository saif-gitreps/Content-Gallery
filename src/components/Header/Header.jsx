import { Container, Logo, Hamburger, DpDropdownMenuButton } from "../index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Header() {
   const authStatus = useSelector((state) => state.auth.status);
   const profilePicture = useSelector((state) => state.auth.userData?.profilePicture);
   const navigate = useNavigate();
   const [dp, setDp] = useState("/blank-dp.png");
   useEffect(() => {
      if (authStatus && profilePicture) {
         setDp(profilePicture);
      }
   }, [authStatus, profilePicture]);

   const navItems = [
      {
         name: "Home",
         slug: "/",
         active: true,
      },
      {
         name: "Login",
         slug: "/login",
         active: !authStatus,
      },
      {
         name: "Signup",
         slug: "/signup",
         active: !authStatus,
      },
      {
         name: "My Posts",
         slug: "/my-posts",
         active: authStatus,
      },
      {
         name: "Add Post",
         slug: "/add-post",
         active: authStatus,
      },
   ];

   return (
      <header className="py-3 shadow bg-white font-medium">
         <Container>
            <nav className="flex ">
               <div className="mx-4">
                  <Link to="/">
                     <Logo className="p-2 rounded-full duration-300 hover:shadow-lg" />
                  </Link>
               </div>
               {/* Use the HamburgerButton component for mobile */}
               <div className="sm:hidden ml-auto">
                  <Hamburger navItems={navItems} logutButton={authStatus} />
               </div>
               <ul className={`ml-auto hidden sm:flex`}>
                  {navItems.map((item) =>
                     item.active ? (
                        <li key={item.name} className="flex items-center">
                           <button
                              onClick={() => navigate(item.slug)}
                              className="text-xl inline-bock px-3 py-4 duration-300 hover:shadow-md rounded-xl"
                           >
                              {item.name}
                           </button>
                        </li>
                     ) : null
                  )}
                  {authStatus && (
                     <li className="flex items-center">
                        <DpDropdownMenuButton
                           src={dp}
                           navItems={navItems}
                           authStatus={authStatus}
                        />
                     </li>
                  )}
               </ul>
            </nav>
         </Container>
      </header>
   );
}

export default Header;
