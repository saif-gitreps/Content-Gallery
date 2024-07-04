function Container({ children, className = "" }) {
   return (
      <div className={`bg-back w-full max-w-4xl mx-auto px-2 ${className}`}>
         {children}
      </div>
   );
}

export default Container;
