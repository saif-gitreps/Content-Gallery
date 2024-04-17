import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";

// for log out we have to change the state of status in store
// We will take the logout reducer.

function LogoutButton({ className = "" }) {
   const dispatch = useDispatch();
   const logoutHandler = () => {
      authService
         .logout()
         .then(() => {
            // this logout is reducer
            dispatch(logout());
         })
         .catch((error) => {
            console.log("Logout error:", error);
         });
   };

   return (
      <button
         onClick={logoutHandler}
         className={`inline-bock px-4 duration-200 text-black hover:bg-blue-100 rounded-full ${className}`}
      >
         Logout
      </button>
   );
}

export default LogoutButton;
