import React from "react";
import { Container, Logo, LogoutButton } from "../index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
   // auth is the name we gave in the slice folder.
   const authStatus = useSelector((state) => state.auth.status);
   return <div>Header</div>;
}

export default Header;
