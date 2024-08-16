import { useQuery } from "@tanstack/react-query";
import { Header, Footer, Loader, ParentContainer } from "./components/index";
import appwriteUserService from "./appwrite/config-user";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./store/authSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import authService from "./appwrite/auth";

import "./App.css";

function App() {
   const dispatch = useDispatch();
   const theme = useSelector((state) => state.theme.theme);

   const {
      data: userData,
      isLoading,
      isError,
   } = useQuery({
      queryKey: ["user"],
      queryFn: async () => {
         const currUser = await authService.getCurrentUser();
         if (!currUser) {
            dispatch(logout());
            return null;
         }

         const profileData = await appwriteUserService.getUserProfile(currUser.$id);
         if (!profileData) {
            dispatch(logout());
            return null;
         }

         currUser.profilePicture = profileData.profilePicture;
         currUser.bio = profileData.bio;

         return currUser;
      },
      enabled: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
   });

   if (userData) {
      dispatch(login(userData));
   }

   useEffect(() => {
      document.documentElement.classList.toggle("dark", theme === "dark");
   }, [theme]);

   if (isError)
      return (
         <h1 className="text-xl text-center font-bold">Sorry something went wrong.</h1>
      );

   return (
      <div className="min-h-screen flex flex-wrap justify-center bg-background-lightGray dark:bg-background-darkGray  dark:text-text-dark">
         {isLoading ? (
            <div className="mt-20">
               <Loader />
            </div>
         ) : (
            <div className="w-full">
               <Header />
               <ParentContainer>
                  <Outlet />
               </ParentContainer>
            </div>
         )}
      </div>
   );
}

export default App;
