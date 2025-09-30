// src/components/RoleSwitcherButton.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

const RoleSwitcherButton: React.FC = () => {
  const { role, switchRole } = useAuth();

  const handleSwitch = async () => {
    try {
      const newRole = role === "customer" ? "pro" : "customer";
      await switchRole(newRole);
    } catch (err) {
      console.warn("Role switch failed", err);
      Alert.alert("Error", "Could not switch role. Try again.");
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleSwitch}>
      <View style={styles.content}>
        <Ionicons
          name={role === "customer" ? "briefcase-outline" : "person-outline"}
          size={18}
          color="#7B1FF0"
        />
        <Text style={styles.text}>
          Switch to {role === "customer" ? "Pro" : "Customer"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#7B1FF0",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
  },
});

export default RoleSwitcherButton;
