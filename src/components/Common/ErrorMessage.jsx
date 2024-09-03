function ErrorMessage({ error }) {
   return (
      error && (
         <h2 className="text-sm text-center text-red-600 font-medium mt-1 dark:text-red-500">
            {error}
         </h2>
      )
   );
}

export default ErrorMessage;
