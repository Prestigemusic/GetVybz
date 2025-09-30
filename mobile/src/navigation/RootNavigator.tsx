// src/navigation/RootNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";

// Auth Screens
import WelcomeScreen from "../screens/Auth/WelcomeScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import SignupScreen from "../screens/Auth/SignupScreen";

// App Screens
import TabNavigator from "./TabNavigator";
import FindProScreen from "../screens/Pros/FindProScreen";
import ProProfileScreen from "../screens/Pros/ProProfileScreen";
import EditProfileScreen from "../screens/Profile/EditProfileScreen";
import MessagingScreen from "../screens/Messaging/MessagingScreen";

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  AppTabs: undefined;
  FindPro: undefined;
  EditProfile: undefined;
  Messaging: { conversationId?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { token } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#6A0DFF" },
      }}
    >
      {!token ? (
        // Unauthenticated flows
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignupScreen} />
          <Stack.Screen name="FindPro" component={FindProScreen} />
        </>
      ) : (
        // Authenticated flows
        <>
          <Stack.Screen name="AppTabs" component={TabNavigator} />
          <Stack.Screen name="FindPro" component={FindProScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Messaging" component={MessagingScreen} />
          <Stack.Screen name="ProProfile" component={ProProfileScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
