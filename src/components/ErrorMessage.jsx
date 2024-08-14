import { useContext } from "react";
import { ErrorContext } from "../context/ErrorContext";

function ErrorMessage({ error }) {
   const { error: errorFromContext } = useContext(ErrorContext);
   console.log(errorFromContext);
   const displayError = errorFromContext || error;
   return (
      <h2 className="text-sm text-center text-red-600 font-medium mt-1 dark:text-red-500">
         {displayError}
      </h2>
   );
}

export default ErrorMessage;
