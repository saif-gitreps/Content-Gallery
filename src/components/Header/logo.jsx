function Logo({ className = "" }) {
   return (
      <div className={`w-14 flex justify-center items-center ${className}`}>
         <img src="/logo-bw.png" alt="logo" />
      </div>
   );
}

export default Logo;
