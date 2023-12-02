import React from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { createContext, useContext, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface MeteorAuthData {
  user: Meteor.User | null;
  userId: string | null;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  loggedIn: boolean;
}

const AuthContext = createContext<MeteorAuthData>({
  user: null,
  userId: null,
  isLoggingIn: true, // default to true to prevent flashing
  isLoggingOut: false,
  loggedIn: false,
});

export const useMeteorAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const meteorAuthData = useTracker(() => {
    const user = Meteor.user();
    const userId = Meteor.userId();
    const isLoggingIn = Meteor.loggingIn();
    const isLoggingOut = Meteor.loggingOut();

    return {
      user,
      userId,
      isLoggingIn,
      isLoggingOut,
      loggedIn: !!userId,
    };
  }, []);

  return (
    <AuthContext.Provider value={meteorAuthData}>
      {children}
    </AuthContext.Provider>
  );
};

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isLoggingIn, loggedIn } = useMeteorAuth();
  const location = useLocation();
  if (!loggedIn && !isLoggingIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export const RequireNotAuth = ({ children }: { children: JSX.Element }) => {
  const { isLoggingIn, loggedIn } = useMeteorAuth();
  const location = useLocation();
  if (loggedIn || isLoggingIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
};
