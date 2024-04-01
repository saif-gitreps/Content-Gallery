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
         <input type={type} className={`${className} `} />
      </div>
   );
});

export default Input;
