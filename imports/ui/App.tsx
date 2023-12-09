import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";

import { NavigationBar } from "/imports/ui/components";
import { RequireNotAuth, RequireAuth } from "/imports/ui/providers";
import { Login, Dashboard, Register, Map, Settings } from "/imports/ui/pages";

export const App = () => {
  useEffect(() => {
    document.body.style.backgroundColor = "orange";
  }, []);

  return (
    <Box padding="10px">
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
            path="map/:id"
            element={
              <RequireAuth>
                <Map />
              </RequireAuth>
            }
          />
          <Route
            path="settings"
            element={
              <RequireAuth>
                <Settings />
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
    </Box>
  );
};
