import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";
import { ListItem } from "../index";

function LogoutButton() {
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

   return <ListItem onClick={logoutHandler} children="Logout" />;
}

export default LogoutButton;
