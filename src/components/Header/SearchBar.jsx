import { Input, Button } from "../index";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function SearchBar() {
   const navigate = useNavigate();
   const [searchQuery, setSearchQuery] = useState("");

   return (
      <div className="flex justify-center items-center space-x-1">
         <div className="flex justify-between items-center relative">
            <Input
               onChange={(e) => setSearchQuery(e.target.value)}
               type="text"
               className="input bg-background-lightGray dark:bg-background-darkGray dark:text-text-dark"
               value={searchQuery}
            />
            {searchQuery != "" && (
               <p
                  className="absolute right-2 font-bold hover:opacity-50 cursor-pointer dark:text-white"
                  onClick={() => setSearchQuery("")}
               >
                  x
               </p>
            )}
         </div>
         <Button
            onClick={() => {
               navigate(`/search?q=${searchQuery.trim()}`);
            }}
            className="h-9 w-10 flex text-sm"
            bgNumber={1}
            text={"Search"}
         />
      </div>
   );
}

export default SearchBar;
