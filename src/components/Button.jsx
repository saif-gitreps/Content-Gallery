function Button({
   children,
   type = "button",
   bgColor = "bg-blue-600",
   textColor = "white",
   className = "",
   ...props
}) {
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
