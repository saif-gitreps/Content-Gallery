import { useId, forwardRef } from "react";

/*
The parent component's useRef is used for creating a reference that will be passed to the child component.
The child component's useRef is used for internal DOM manipulation or access to a DOM element within the child component itself.
*/

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
         <input
            type={type}
            className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
            ref={ref}
            {...props}
            id={id}
         />
      </div>
   );
});

export default Input;
