import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice";
import authService from "./appwrite/auth";
import { Header, Footer } from "./components/index";

import "./App.css";

function App() {
   const [loading, setLoading] = useState(true);
   const dispatch = useDispatch();

   useEffect(() => {
      authService
         .getCurrentUser()
         .then((userData) => {
            console.log(userData);
            if (userData) {
               dispatch(login({ userData }));
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
   }, []);

   if (loading) {
      // will ad a loading component
   } else {
      return (
         <div className="min-h-screen flex flex-wrap content-between bg-gray-400">
            <div className="w-full block text">
               <Header />
               <main>Todo{/* <Outlet/> */}</main>
               <Footer />
            </div>
         </div>
      );
   }
}

export default App;
