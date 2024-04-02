import { useId, forwardRef } from "react";

function Select({ options, label, className = "", ...props }, ref) {
   const id = useId();
   return (
      <div className="w-full">
         {label ? (
            <label htmlFor={id} className="">
               {label}
            </label>
         ) : null}
         <select
            id={id}
            className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
            {...props}
            ref={ref}
         >
            {options?.map((option) => (
               <option key={option} value={option}>
                  {option}
               </option>
            ))}
         </select>
      </div>
   );
}

// second way of using forwardRef, the first one is in Input.jsx
const SelectWithRef = forwardRef(Select);
export default SelectWithRef;
