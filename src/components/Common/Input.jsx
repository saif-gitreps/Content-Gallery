import { useId, forwardRef } from "react";

const Input = forwardRef(function Input(
   { label, type = "text", className = "", ...props },
   ref
) {
   const id = useId();
   return (
      <div className="w-full">
         {label ? (
            <label className="inline-block mb-1 pl -1" htmlFor={id}>
               {label}
            </label>
         ) : null}
         {type === "textarea" ? (
            <textarea
               rows={3}
               className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full dark:bg-background-darkGray dark:text-text-dark ${className}`}
               ref={ref}
               id={id}
               {...props}
            ></textarea>
         ) : (
            <input
               type={type}
               className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full dark:bg-background-darkGray dark:text-text-dark ${className}`}
               ref={ref}
               id={id}
               {...props}
            />
         )}
      </div>
   );
});

export default Input;