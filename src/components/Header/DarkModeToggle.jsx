import { toggleTheme } from "../../store/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { ListItem } from "../index";

function DarkModeToggle() {
   const dispatch = useDispatch();
   const theme = useSelector((state) => state.theme.theme);

   return (
      <ListItem
         children={
            <div className="flex justify-between">
               <p>Dark Mode</p>
               <label className="switch-container">
                  <input
                     type="checkbox"
                     checked={theme === "dark"}
                     onChange={() => dispatch(toggleTheme())}
                  />
                  <span className="slider"></span>
               </label>
            </div>
         }
      />
   );
}

export default DarkModeToggle;
