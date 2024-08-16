function Container({ children, className = "" }) {
   return (
      <div
         className={`w-full max-w-4xl rounded-2xl mx-auto
         ounded-2xl 
         ${className}`}
      >
         {children}
      </div>
   );
}

export default Container;
