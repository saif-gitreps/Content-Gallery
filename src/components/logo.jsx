function Logo({ className = "" }) {
   return (
      <div className={`w-20 ${className}`}>
         <img src="/logo-bw.png" alt="logo" />
      </div>
   );
}

export default Logo;
