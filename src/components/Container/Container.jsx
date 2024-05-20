function Container({ children, className = "" }) {
   return <div className={`w-full max-w-6xl mx-auto px-2 ${className}`}>{children}</div>;
}

export default Container;
