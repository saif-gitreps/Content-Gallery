function Button({ text, type = "button", className = "", bgNumber = 0, ...props }) {
   const bgColor = [
      "bg-green-600 hover:bg-green-800",
      "bg-blue-700 hover:bg-blue-900",
      "bg-red-700 hover:bg-red-900",
   ];
   return (
      <button
         type={type}
         className={`text-sm py-3 w-16 font-medium text-white flex items-center justify-center duration-300  rounded-lg ${bgColor[bgNumber]} ${className} `}
         {...props}
      >
         {text}
      </button>
   );
}

export default Button;
