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
      <button onClick={logoutHandler} className={`py-4 px-2 rounded-r-lg ${className}`}>
         Logout
      </button>
   );
}

export default LogoutButton;
