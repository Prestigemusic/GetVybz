import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";

import { useAuth } from "../context/AuthContext";

// Screens
import ProDashboardScreen from "../screens/Dashboard/ProDashboardScreen";
import CustomerDashboardScreen from "../screens/Dashboard/CustomerDashboardScreen";
import BookingScreen from "../screens/Booking/BookingScreen";
import ConversationsScreen from "../screens/Messaging/ConversationsScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import FindProScreen from "../screens/Pros/FindProScreen";
import ProProfileScreen from "../screens/Pros/ProProfileScreen"; // 👈 new

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// -----------------------------
// Glassmorphism Background
// -----------------------------
function GlassBackground() {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    opacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(200, withTiming(0, { duration: 600 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
      <LinearGradient
        colors={["#6A0DFF", "#7B1FF0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
    </Animated.View>
  );
}

// -----------------------------
// Animated Tab Icon
// -----------------------------
function AnimatedTabIcon({
  name,
  color,
  size,
  focused,
}: {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
  focused: boolean;
}) {
  const scale = useSharedValue(focused ? 1.2 : 1);
  const opacity = useSharedValue(focused ? 1 : 0.6);

  useEffect(() => {
    scale.value = withTiming(focused ? 1.2 : 1, { duration: 300 });
    opacity.value = withTiming(focused ? 1 : 0.6, { duration: 300 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
}

// -----------------------------
// Tab Navigator (bottom bar)
// -----------------------------
function MainTabs() {
  const { role } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: "#6A0DFF" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "rgba(255,255,255,0.6)",
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          position: "absolute",
          bottom: 16,
          left: 16,
          right: 16,
          borderRadius: 30,
          height: 70,
          overflow: "hidden",
        },
        tabBarBackground: () => <GlassBackground />,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "Dashboard") iconName = "home";
          else if (route.name === "FindPro") iconName = "search";
          else if (route.name === "Bookings") iconName = "calendar";
          else if (route.name === "Messages") iconName = "chatbubbles";
          else if (route.name === "Profile") iconName = "person";

          return (
            <AnimatedTabIcon
              name={iconName}
              color={color}
              size={size}
              focused={focused}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={role === "pro" ? ProDashboardScreen : CustomerDashboardScreen}
      />
      <Tab.Screen name="FindPro" component={FindProScreen} />
      <Tab.Screen name="Bookings" component={BookingScreen} />
      <Tab.Screen name="Messages" component={ConversationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// -----------------------------
// Root Stack (Tabs + ProProfile)
// -----------------------------
export default function TabNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProProfile"
        component={ProProfileScreen}
        options={{ title: "Pro Profile", headerBackTitle: "Back" }}
      />
    </Stack.Navigator>
  );
}
