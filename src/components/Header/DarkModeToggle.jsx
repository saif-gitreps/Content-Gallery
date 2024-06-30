import { toggleTheme } from "../../store/themeSlice";
import { useDispatch, useSelector } from "react-redux";

function DarkModeToggle() {
   const dispatch = useDispatch();
   const theme = useSelector((state) => state.theme.theme);

   return (
      <div className="py-2 px-4 w-full flex justify-between items-center hover:cursor-pointer duration-300 hover:shadow-md ">
         <p className="text-xs lg:text-base text-left rounded-md">Dark Mode</p>
         <label className="switch-container">
            <input
               type="checkbox"
               checked={theme === "dark"}
               onChange={() => dispatch(toggleTheme())}
            />
            <span className="slider"></span>
         </label>
      </div>
   );
}

export default DarkModeToggle;
