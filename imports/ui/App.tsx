import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";

import { NavigationBar } from "/imports/ui/components";
import { RequireNotAuth, RequireAuth } from "/imports/ui/providers";
import {
  Login,
  Dashboard,
  Register,
  Map,
  Settings,
  OtherUsers,
} from "/imports/ui/pages";
import { Color } from "/imports/constants";
import { MOTION_PRESET } from "/imports/constants/motion";

export const App = () => {
  useEffect(() => {
    document.body.style.backgroundColor = Color.ORANGE;
  }, []);

  const location = useLocation();

  return (
    <Box padding="10px">
      <NavigationBar />
      <AnimatePresence>
        <Box paddingTop="10px">
          <Routes location={location} key={location.pathname}>
            <Route path="/">
              <Route
                index
                element={
                  <RequireAuth>
                    <motion.div {...MOTION_PRESET} key="Dashboard">
                      <Dashboard />
                    </motion.div>
                  </RequireAuth>
                }
              />
              <Route
                path="/:id"
                element={
                  <RequireAuth>
                    <motion.div {...MOTION_PRESET} key="OtherUserDashboard">
                      <Dashboard />
                    </motion.div>
                  </RequireAuth>
                }
              />
              <Route
                path="/other-users"
                element={
                  <RequireAuth>
                    <motion.div {...MOTION_PRESET} key="OtherUsers">
                      <OtherUsers />
                    </motion.div>
                  </RequireAuth>
                }
              />
              <Route
                path="map/:id"
                element={
                  <RequireAuth>
                    <motion.div {...MOTION_PRESET} key="Map">
                      <Map />
                    </motion.div>
                  </RequireAuth>
                }
              />
              <Route
                path="settings"
                element={
                  <RequireAuth>
                    <motion.div {...MOTION_PRESET} key="Settings">
                      <Settings />
                    </motion.div>
                  </RequireAuth>
                }
              />
              <Route
                path="login"
                element={
                  <RequireNotAuth>
                    <motion.div {...MOTION_PRESET} key="Login">
                      <Login />
                    </motion.div>
                  </RequireNotAuth>
                }
              />
              <Route
                path="register"
                element={
                  <RequireNotAuth>
                    <motion.div {...MOTION_PRESET} key="Register">
                      <Register />
                    </motion.div>
                  </RequireNotAuth>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Box>
      </AnimatePresence>
    </Box>
  );
};
