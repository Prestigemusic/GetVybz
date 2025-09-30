// FILE: src/screens/HomeScreen.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiGet } from "../../api/client";


const MOCK_FEATURES = [
  { id: "1", title: "Find DJs" },
  { id: "2", title: "Book Photographers" },
  { id: "3", title: "Hire MCs" }
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Discover Creatives</Text>
      <FlatList
        data={MOCK_FEATURES}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSub}>Top rated near you</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A0033" },
  header: { fontSize: 22, color: "#fff", fontWeight: "800", margin: 16 },
  card: { backgroundColor: "#2a0d5e", padding: 16, borderRadius: 12, marginBottom: 12 },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  cardSub: { color: "#EAD7FF", marginTop: 6 }
});
