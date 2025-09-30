// App.tsx
import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { AuthProvider } from "./src/context/AuthContext";
import { UserProvider } from "./src/context/UserContext";
import { detectBestHost } from "./src/api/client";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  useEffect(() => {
    // Run host detection at startup
    detectBestHost();
  }, []);

  return (
    <AuthProvider>
      <UserProvider>
        <NavigationContainer
          theme={{
            ...DefaultTheme,
            colors: {
              ...DefaultTheme.colors,
              background: "#6A0DFF", // brand purple background
            },
          }}
        >
          <RootNavigator />
        </NavigationContainer>
      </UserProvider>
    </AuthProvider>
  );
}
