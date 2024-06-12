import { Navigate } from "react-router-dom";
import { useState } from "react";

export default function ProtectedRoute({ Component }) {
  const [token] = useState(localStorage.getItem("token"));
  const [isLoggedIn] = useState(!!token);
//   console.log(isLoggedIn);
  return (<div>{isLoggedIn ? <Component /> : <Navigate to="/" />}</div>);
}

 
