import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { NavigationBar } from "/imports/ui/components/NavigationBar";
import { RequireNotAuth, RequireAuth } from "./providers/Auth";
import { Login } from "/imports/ui/pages/Login";
import { Dashboard } from "/imports/ui/pages/Dashboard";
import { Register } from "/imports/ui/pages/Register";

export const App = () => {
  useEffect(() => {
    document.body.style.backgroundColor = "orange";
  }, []);

  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="login"
            element={
              <RequireNotAuth>
                <Login />
              </RequireNotAuth>
            }
          />
          <Route
            path="register"
            element={
              <RequireNotAuth>
                <Register />
              </RequireNotAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
};
