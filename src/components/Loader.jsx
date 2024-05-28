function LoadingSpinner() {
   return (
      <div className="mt-6 ">
         <div className="spinner w-100 h-100 flex justify-center items-center gap-6">
            <span className="spinner-circle w-8 h-8 rounded-full bg-blue-600 opacity-0 animate-fade"></span>
            <span className="spinner-circle w-10 h-10 rounded-full bg-blue-600 opacity-0 animate-fade animation-delay-300"></span>
            <span className="spinner-circle w-10 h-10 rounded-full bg-blue-600 opacity-0 animate-fade animation-delay-600"></span>
            <span className="spinner-circle w-8 h-8 rounded-full bg-blue-600 opacity-0 animate-fade animation-delay-900"></span>
         </div>
      </div>
   );
}

function LoaderMini() {
   return (
      <div className="flex flex-row gap-2">
         <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce [animation-delay:.7s]"></div>
         <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce [animation-delay:.3s]"></div>
         <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce [animation-delay:.7s]"></div>
      </div>
   );
}

export default LoadingSpinner;
export { LoaderMini };
