// this component is a wrapper or a containter which will render the children conditionally
// now that conditionn is authentication related.
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components";

export default function Protected({ children, authentication = true }) {
   const navigate = useNavigate();
   const [loader, setLoader] = useState(true);
   const authStatus = useSelector((state) => state.auth.status);

   useEffect(() => {
      if (authentication && authStatus !== authentication) {
         navigate("/login");
      } else if (!authentication && authStatus !== authentication) {
         navigate("/");
      }
      setLoader(false);
   }, [authStatus, navigate, authentication]);

   return loader ? <Loader /> : <>{children}</>;
}
