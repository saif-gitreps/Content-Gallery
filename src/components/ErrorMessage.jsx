function ErrorMessage({ error }) {
   return (
      error && (
         <h2 className="text-sm text-center text-red-600 font-medium mt-1 bg-background-lightWhite dark:bg-background-darkBlack dark:text-red-500">
            {error}
         </h2>
      )
   );
}

export default ErrorMessage;
