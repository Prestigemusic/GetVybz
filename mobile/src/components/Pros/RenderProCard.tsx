// src/components/Pros/RenderProCard.tsx
import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

type ProCardProps = {
  name: string;
  specialty: string;
  rating: number;
  distance: string;
  image?: string;
  onPress?: () => void;
};

export default function RenderProCard({
  name,
  specialty,
  rating,
  distance,
  image,
  onPress,
}: ProCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.cardWrapper}>
      <LinearGradient
        colors={["#6A0DFF", "#7B1FF0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <Image
          source={
            image
              ? { uri: image }
              : require("../../../assets/images/default-avatar.png")
          }
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.specialty}>{specialty}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{rating.toFixed(1)}</Text>
            <Ionicons
              name="location-outline"
              size={16}
              color="rgba(255,255,255,0.8)"
              style={{ marginLeft: 10 }}
            />
            <Text style={styles.distance}>{distance}</Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#fff",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  specialty: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 4,
  },
  distance: {
    color: "#fff",
    marginLeft: 4,
    fontSize: 14,
  },
});
