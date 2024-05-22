import { Container, Logo, Hamburger, DpDropdownMenuButton, Input } from "../index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import getNavItems from "./navItems";

function Header() {
   const authStatus = useSelector((state) => state.auth.status);
   let userData = useSelector((state) => state.auth.userData);
   const navigate = useNavigate();
   const [dp, setDp] = useState("/blank-dp.png");
   const { register, handleSubmit, setValue } = useForm();

   const navItems = getNavItems(authStatus, userData);

   useEffect(() => {
      if (userData) {
         setDp(userData.prefs?.profilePicture || "/blank-dp.png");
      }
   }, [userData]);

   const onSearch = (data) => {
      navigate(`/search?q=${data.query.trim()}`);
      setValue("query", "");
   };

   return (
      <header className="py-3 shadow bg-white font-medium">
         <Container>
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

               <form
                  onSubmit={handleSubmit(onSearch)}
                  className="flex justify-center items-center"
               >
                  <Input
                     {...register("query", { required: true })}
                     type="text"
                     className="input"
                     placeholder="Search"
                  />
                  <button
                     type="submit"
                     className="text-2xl w-14 h-12 duration-300 hover:shadow-md rounded-full"
                  >
                     🔍
                  </button>
               </form>

               <div className="sm:hidden ml-auto">
                  <Hamburger navItems={navItems} logutButton={authStatus} />
               </div>
               <ul className={`ml-auto hidden sm:flex`}>
                  {navItems.map((item) =>
                     item.active && !item.forDropDownMenu ? (
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
                  <li className="mx-4">
                     <Link to="/">
                        <Logo className="p-2 rounded-full duration-300 hover:shadow-lg" />
                     </Link>
                  </li>
               </ul>
            </nav>
         </Container>
      </header>
   );
}

export default Header;
