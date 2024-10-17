function Logo({ className = "" }) {
   return (
      <div className={`w-14 flex justify-center items-center ${className}`}>
         <img src="/logo-no-background-new.png" alt="logo" className="object-cover" />
      </div>
   );
}

export default Logo;
