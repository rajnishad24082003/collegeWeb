import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignInUp from "./components/SignInUp";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { ProfileProvider } from "./context/profile.context";
import "./assets/bootstrap-icons/bootstrap-icons.css";
import "./assets/output.css";
import "rsuite/dist/rsuite.min.css";

function App() {
  return (
    <>
      <ProfileProvider>
        <Routes>
          <Route
            exact={true}
            path={"/"}
            element={
              <PrivateRoute>
                <Home></Home>
              </PrivateRoute>
            }
          ></Route>

          <Route
            path={"/signinup"}
            element={
              <PublicRoute>
                <SignInUp></SignInUp>
              </PublicRoute>
            }
          ></Route>
        </Routes>
      </ProfileProvider>
    </>
  );
}

export default App;
