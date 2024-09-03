// this component is a wrapper or a containter which will render the children conditionally
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Protected({ children, authentication = true }) {
   const navigate = useNavigate();
   const authStatus = useSelector((state) => state.auth.status);

   useEffect(() => {
      if (authentication && authStatus !== authentication) {
         navigate("/login");
      } else if (!authentication && authStatus !== authentication) {
         navigate("/");
      }
   }, [authStatus, navigate, authentication]);

   return <>{children}</>;
}
