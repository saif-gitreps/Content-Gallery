import { useState, useEffect } from "react";
import { Input } from "../index";
import { useNavigate } from "react-router-dom";

function SearchBar() {
   const [searchQuery, setSearchQuery] = useState("");
   const navigate = useNavigate();

   useEffect(() => {
      if (searchQuery.trim() !== "") {
         navigate(`/search?q=${searchQuery.trim()}`);
      }
   }, [searchQuery, navigate]);

   return (
      <div className="flex justify-center relative items-center">
         <Input
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            className="input"
            placeholder="Search"
            value={searchQuery}
         />
         {searchQuery && (
            <p
               className="absolute right-1 rounded-lg text-bold px-3 py-1 hover:shadow-md   hover:cursor-pointer"
               onClick={() => {
                  setSearchQuery("");
                  navigate("/");
               }}
            >
               X
            </p>
         )}
      </div>
   );
}

export default SearchBar;
