import React from "react";
import { Navigate } from "react-router-dom";
import { useProfile } from "../context/profile.context";
import Loading from "./Loading";

function PrivateRoute({ children }) {
  let { profile, isLoading } = useProfile();
  if (isLoading && !profile) {
    return <Loading></Loading>;
  }

  if (!profile && !isLoading) {
    return <Navigate to="/signinup" />;
  } else {
    return children;
  }
}

export default PrivateRoute;
