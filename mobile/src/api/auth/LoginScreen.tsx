// FILE: src/screens/Auth/LoginScreen.tsx
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
import { LinearGradient } from "expo-linear-gradient";
import { apiPost } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

// Glow Wrapper
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

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await apiPost("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      if (response?.token) {
        const userRole = response.user?.role ?? "customer"; // default = customer
        await login(response.token, response.user ?? null, userRole);
      } else {
        Alert.alert("Login Failed", "No token received.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      const errorMessage =
        err.response?.data?.error || "Invalid email or password.";
      Alert.alert("Login Failed", errorMessage);
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>

            <View style={styles.form}>
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
            </View>

            <TouchableOpacity
              onPress={handleLogin}
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
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </LinearGradient>
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
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#DDD",
    marginBottom: 40,
    textAlign: "center",
  },
  form: { marginBottom: 24 },

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
  },
  buttonInner: {
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  buttonText: { color: "#6A0DFF", fontSize: 18, fontWeight: "bold" },
});

export default LoginScreen;
