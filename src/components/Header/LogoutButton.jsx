import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";
import { ListItem } from "../index";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function LogoutButton({ className = "" }) {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const location = useLocation();
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
      <ListItem
         onClick={logoutHandler}
         children="Logout"
         className={`hover:bg-red-800 hover:text-white dark:hover:bg-red-800 
            dark:hover:text-white ${className}`}
      />
   );
}

export default LogoutButton;
