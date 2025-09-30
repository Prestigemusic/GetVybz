// src/screens/Dashboard/components/QuickActionsSection.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const actions = [
  { key: "createBooking", icon: "add-circle-outline", label: "Post Gig/Job" },
  { key: "messages", icon: "chatbubbles-outline", label: "Messages" },
  { key: "findPro", icon: "search-outline", label: "Find a Pro" },
  { key: "favorites", icon: "heart-outline", label: "Favorites" },
  { key: "wallet", icon: "wallet-outline", label: "Wallet" },
];

const QuickActionsSection: React.FC<{ onAction?: (key: string) => void }> = ({ onAction }) => {
  return (
    <View style={{ marginTop: 12, paddingHorizontal: 20, marginBottom: 6 }}>
      <Text style={styles.title}>Quick Actions</Text>
      <View style={styles.grid}>
        {actions.map((a) => (
          <LinearGradient key={a.key} colors={["#7B1FF0", "#9D4EDD"]} style={styles.gradientCard}>
            <TouchableOpacity activeOpacity={0.9} style={styles.actionInner} onPress={() => onAction?.(a.key)}>
              <Ionicons name={a.icon as any} size={26} color="#fff" />
              <Text style={styles.label}>{a.label}</Text>
            </TouchableOpacity>
          </LinearGradient>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  gradientCard: {
    width: "47%",
    borderRadius: 12,
    padding: 6,
    marginBottom: 12,
    shadowColor: "#6A0DFF",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  actionInner: { paddingVertical: 18, alignItems: "center", justifyContent: "center" },
  label: { color: "#fff", marginTop: 8, fontWeight: "600", textAlign: "center" },
});

export default React.memo(QuickActionsSection);
