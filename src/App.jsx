import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice";
import authService from "./appwrite/auth";
import { Header, Footer, Loader } from "./components/index";
import { Outlet } from "react-router-dom";

import "./App.css";

function App() {
   const [loading, setLoading] = useState(true);
   const dispatch = useDispatch();

   useEffect(() => {
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
   }, [dispatch]);

   if (loading) {
      return <Loader />;
   }
   return (
      <div className="min-h-screen flex flex-wrap content-between bg-gray-100">
         <div className="w-full block">
            <Header />
            <main className="min-h-screen">
               <Outlet />
            </main>
            <Footer />
         </div>
      </div>
   );
}

export default App;
