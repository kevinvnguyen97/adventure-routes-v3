import React from "react";
import { createRoot } from "react-dom/client";
import { Meteor } from "meteor/meteor";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider, ThemeConfig, extendTheme } from "@chakra-ui/react";
import { LoadScript } from "@react-google-maps/api";

import { App } from "/imports/ui/App";
import { AuthProvider } from "/imports/ui/providers";
import { SECRETS } from "/imports/constants";

import "./main.css";

Meteor.startup(() => {
  const container = document.getElementById("react-target");
  const root = createRoot(container!);

  const config: ThemeConfig = {
    initialColorMode: "light",
    useSystemColorMode: false,
    disableTransitionOnChange: false,
  };

  const theme = extendTheme({ config });

  root.render(
    <BrowserRouter>
      <AuthProvider>
        <LoadScript
          googleMapsApiKey={SECRETS.public.oauth.googleMapsApiKey}
          libraries={["places"]}
        >
          <ChakraProvider
            theme={theme}
            toastOptions={{
              defaultOptions: {
                duration: 5000,
                isClosable: true,
                position: "top",
              },
            }}
          >
            <App />
          </ChakraProvider>
        </LoadScript>
      </AuthProvider>
    </BrowserRouter>
  );
});
