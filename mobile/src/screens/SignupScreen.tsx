// src/screens/Auth/SignupScreen.tsx

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
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { apiPost } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { gradients } from "../../theme";

const SignupScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiPost("/api/auth/signup", { name, email, password });

      if (response.token) {
        await AsyncStorage.setItem("jwt", response.token);
      }

      Alert.alert("Success", "Account created successfully!");
      setIsLoading(false);

      navigation.navigate("Profile" as never);
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Signup Failed", "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <LinearGradient
      colors={gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardContainer}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>Create your new GetVybz account</Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.button, isLoading && { opacity: 0.5 }]}
              onPress={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate("Login" as never)}
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
  keyboardContainer: { flex: 1 },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 20 },
  title: { fontSize: 32, fontWeight: "bold", color: "#fff", textAlign: "center", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#eee", textAlign: "center", marginBottom: 40 },
  input: { backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", borderRadius: 10, padding: 15, fontSize: 16, marginBottom: 15 },
  button: { backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 10, padding: 15, alignItems: "center", marginBottom: 20 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  linkButton: { alignItems: "center" },
  linkText: { color: "#eee" },
  linkTextBold: { fontWeight: "bold", color: "#fff" },
});

export default SignupScreen;
