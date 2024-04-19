function Button({
   children,
   type = "button",
   bgColor = "bg-blue-600",
   textColor = "white",
   className = "",
   ...props
}) {
   // here children is basically the text part.
   // adding a spread of props basically allows a user to add infinte amount of properties
   // in the Component. Example a user may want to put a placeholder.
   return (
      <button
         type={type}
         className={`py-4 px-2 rounded-lg ${textColor} ${bgColor} ${className} `}
         {...props}
      >
         {children}
      </button>
   );
}

export default Button;
