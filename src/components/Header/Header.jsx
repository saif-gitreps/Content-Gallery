import { Container, Logo, Hamburger, DpDropdownMenuButton, Input } from "../index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import getNavItems from "./navItems";

function Header() {
   const authStatus = useSelector((state) => state.auth.status);
   const userData = useSelector((state) => state.auth.userData);
   const navigate = useNavigate();
   const [dp, setDp] = useState("/blank-dp.png");
   const { register, handleSubmit, setValue } = useForm();

   const navItems = getNavItems(authStatus, userData);

   useEffect(() => {
      if (userData && authStatus) {
         setDp(userData.prefs?.profilePicture);
      } else {
         setDp("/blank-dp.png");
      }
   }, [userData, authStatus]);

   const onSearch = (data) => {
      navigate(`/search?q=${data.query.trim()}`);
      setValue("query", "");
   };

   return (
      <header className="py-1 shadow bg-white font-medium">
         <Container className="max-w-full">
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
                              className="text-base lg:text-lg inline-bock p-2 duration-300 hover:shadow-md rounded-xl"
                           >
                              {item.name}
                           </button>
                        </li>
                     ) : null
                  )}
                  <li className="mx-2">
                     <Link to="/">
                        <Logo className="p-1 rounded-full duration-300 hover:shadow-md lg:w-20" />
                     </Link>
                  </li>
               </ul>
            </nav>
         </Container>
      </header>
   );
}

export default Header;
