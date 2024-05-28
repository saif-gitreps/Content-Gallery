import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";

function LogoutButton({ className = "" }) {
   const dispatch = useDispatch();
   const logoutHandler = () => {
      authService
         .logout()
         .then(() => {
            dispatch(logout());
         })
         .catch((error) => {
            console.log("Logout error:", error);
         });
   };

   return (
      <button
         onClick={logoutHandler}
         className={`block w-full px-4 py-2 text-left duration-300 hover:bg-red-700 hover:cursor-pointer hover:text-white hover:shadow-md rounded-md ${className}`}
      >
         Logout
      </button>
   );
}

export default LogoutButton;
