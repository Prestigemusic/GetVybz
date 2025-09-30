import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type WelcomeNav = NativeStackNavigationProp<RootStackParamList, "Welcome">;

export default function WelcomeScreen() {
  const navigation = useNavigation<WelcomeNav>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to GetVybz</Text>
      <Text style={styles.subtitle}>Book creative professionals in just a few taps</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonOutline}
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={styles.buttonOutlineText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0a22",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: { fontSize: 32, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#aaa", marginBottom: 40, textAlign: "center" },
  button: {
    backgroundColor: "#6e44ff",
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
    width: "80%",
  },
  buttonText: { color: "#fff", fontSize: 18, textAlign: "center" },
  buttonOutline: {
    borderWidth: 2,
    borderColor: "#6e44ff",
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
    width: "80%",
  },
  buttonOutlineText: { color: "#6e44ff", fontSize: 18, textAlign: "center" },
});