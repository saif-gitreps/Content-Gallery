import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header, Footer, Loader } from "./components/index";
import { login, logout } from "./store/authSlice";
import authService from "./appwrite/auth";
import { Outlet } from "react-router-dom";

import "./App.css";

const queryClient = new QueryClient();

function App() {
   const [loading, setLoading] = useState(true);
   const dispatch = useDispatch();
   const theme = useSelector((state) => state.theme.theme);

   useEffect(() => {
      document.documentElement.classList.toggle("dark", theme === "dark");

      authService
         .getCurrentUser()
         .then((userData) => {
            if (userData) {
               dispatch(login(userData));
            } else {
               dispatch(logout());
            }
         })
         .catch((error) => {
            console.log(error);
         })
         .finally(() => {
            setLoading(false);
         });
   }, [dispatch, theme]);

   if (loading) {
      return <Loader />;
   }
   return (
      <QueryClientProvider client={queryClient}>
         <div className="min-h-screen flex flex-wrap content-between ">
            <div className="w-full block">
               <Header />
               <main className="min-h-screen bg-background-lightGray dark:bg-background-darkGray  dark:text-text-dark">
                  <Outlet />
               </main>
               <Footer />
            </div>
         </div>
      </QueryClientProvider>
   );
}

export default App;
