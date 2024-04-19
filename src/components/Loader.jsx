function LoadingSpinner() {
   return (
      <div className="mt-6 ">
         <div className="spinner w-100 h-100 flex justify-center items-center gap-6">
            <span className="spinner-circle w-8 h-8 rounded-full bg-blue-500 opacity-0 animate-fade"></span>
            <span className="spinner-circle w-10 h-10 rounded-full bg-blue-500 opacity-0 animate-fade animation-delay-300"></span>
            <span className="spinner-circle w-10 h-10 rounded-full bg-blue-500 opacity-0 animate-fade animation-delay-600"></span>
            <span className="spinner-circle w-8 h-8 rounded-full bg-blue-500 opacity-0 animate-fade animation-delay-900"></span>
         </div>
      </div>
   );
}

export default LoadingSpinner;
