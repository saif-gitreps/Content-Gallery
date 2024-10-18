import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";
import { ListItem } from "../index";
import { toast } from "react-toastify";

function LogoutButton() {
   const dispatch = useDispatch();
   const logoutHandler = () => {
      authService
         .logout()
         .then(() => {
            toast.success("You have been signed out successfully");
            dispatch(logout());
         })
         .catch(() => {
            toast.error("Something went wrong while signing out, please try again later");
         });
   };

   return (
      <ListItem
         onClick={logoutHandler}
         children="Logout"
         className="text-red-500 dark:text-red-400"
      />
   );
}

export default LogoutButton;
