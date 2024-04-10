import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";

// for log out we have to change the state of status in store
// We will take the logout reducer.

function LogoutButton() {
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
         className="inline-bock px-6 py-2 duration-200 text-black hover:bg-blue-100 rounded-full"
      >
         Logout
      </button>
   );
}

export default LogoutButton;
