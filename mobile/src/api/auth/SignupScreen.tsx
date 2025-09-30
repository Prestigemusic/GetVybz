// FILE: src/screens/Auth/SignupScreen.tsx
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { apiPost } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

// Wrapper for neon glow input
const InputGlowWrapper = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.inputGlowWrapper}>
    <LinearGradient
      colors={["#00F5FF", "#B400FF", "#6A0DFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.inputGlowBorder}
    />
    {children}
  </View>
);

const SignupScreen: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { login } = useAuth();

  // Default role is customer, unless overridden by navigation params
  const role: "pro" | "customer" = route.params?.role ?? "customer";

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiPost("/auth/signup", {
        name,
        email: email.trim().toLowerCase(),
        password,
        role, // 👈 attach correct role
      });

      if (response?.token) {
        await login(response.token, response.user ?? null, role);
        Alert.alert("Success", "Account created successfully!");
        // After signup, user goes straight to dashboard (not back to login)
        return;
      }

      Alert.alert("Signup Failed", "No token received. Please try again.");
    } catch (error: any) {
      console.error("Signup error:", error);
      Alert.alert(
        "Signup Failed",
        error.response?.data?.error || "Unexpected error. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#12003D", "#6A0DFF", "#B400FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardContainer}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>
              {role === "pro"
                ? "Join GetVybz as a Pro and get hired"
                : "Create your GetVybz account to hire pros"}
            </Text>

            {/* Full Name */}
            <InputGlowWrapper>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#BBB"
                value={name}
                onChangeText={setName}
              />
            </InputGlowWrapper>

            {/* Email */}
            <InputGlowWrapper>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#BBB"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </InputGlowWrapper>

            {/* Password */}
            <InputGlowWrapper>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#BBB"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </InputGlowWrapper>

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={handleSignup}
              disabled={isLoading}
              style={[
                styles.gradientButtonWrapper,
                isLoading && { opacity: 0.7 },
              ]}
            >
              <LinearGradient
                colors={["#FFFFFF", "#F0F0F0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonInner}
              >
                {isLoading ? (
                  <ActivityIndicator color="#6A0DFF" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Already have an account? */}
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate("Login")}
              disabled={isLoading}
            >
              <Text style={styles.linkText}>
                Already have an account?{" "}
                <Text style={styles.linkTextBold}>Log In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  keyboardContainer: { flex: 1 },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#DDD",
    textAlign: "center",
    marginBottom: 40,
  },
  inputGlowWrapper: {
    marginBottom: 16,
    borderRadius: 14,
    padding: 2,
    position: "relative",
    overflow: "hidden",
  },
  inputGlowBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 14,
    zIndex: -1,
  },
  input: {
    backgroundColor: "#20004A",
    color: "#fff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    width: "100%",
  },
  gradientButtonWrapper: {
    borderRadius: 12,
    padding: 2,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  buttonInner: {
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  buttonText: { color: "#6A0DFF", fontSize: 18, fontWeight: "bold" },
  linkButton: { alignItems: "center" },
  linkText: { color: "#DDD" },
  linkTextBold: { fontWeight: "bold", color: "#00F5FF" },
});

export default SignupScreen;
