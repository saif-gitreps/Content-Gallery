import { useId, forwardRef } from "react";

function Select({ options, label, className, ...props }, ref) {
   const id = useId();
   return (
      <div className="w-full">
         {label && (
            <label className="inline-block" htmlFor={id}>
               {label}
            </label>
         )}
         <select
            {...props}
            id={id}
            ref={ref}
            className={`p-2 ml-1 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-300 border border-gray-200  ${className}`}
         >
            {options?.map((option) => (
               <option key={option} value={option} className="sm:text-lg text-xs">
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
