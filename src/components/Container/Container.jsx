function Container({ children, className = "" }) {
   return <div className={`w-full max-w-4xl mx-auto px-2 ${className}`}>{children}</div>;
}

export default Container;
