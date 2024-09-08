import { useId, forwardRef } from "react";

const Input = forwardRef(function Input(
   { label, type = "text", className = "", ...props },
   ref
) {
   const id = useId();
   return (
      <div className="w-full">
         {label && (
            <label className="inline-block mb-1 pl -1" htmlFor={id}>
               {label}
            </label>
         )}
         {type === "textarea" ? (
            <textarea
               rows={3}
               className={`w-full px-3 py-2 text-black outline-none duration-200 dark:text-text-dark  bg-white dark:bg-gray-700 border rounded-md p-2 focus:ring-2 focus:ring-blue-500 ${className}`}
               ref={ref}
               id={id}
               {...props}
            ></textarea>
         ) : (
            <input
               type={type}
               className={`px-3 py-2 text-black outline-none duration-200 w-full dark:text-text-dark  bg-white dark:bg-gray-700 border rounded-md p-2 focus:ring-2 focus:ring-blue-500 ${className}`}
               ref={ref}
               id={id}
               {...props}
            />
         )}
      </div>
   );
});

export default Input;
