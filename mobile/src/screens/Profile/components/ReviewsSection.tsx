// src/screens/Profile/components/ReviewsSection.tsx
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.title}>User Reviews</Text>
        <Text style={styles.emptyText}>No reviews yet.</Text>
      </View>
    );
  }

  const renderReviewItem = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <Text style={styles.reviewer}>{item.user}</Text>
      <View style={styles.ratingRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Ionicons
            key={i}
            name={i < item.rating ? "star" : "star-outline"}
            size={16}
            color="#FFD700"
          />
        ))}
      </View>
      <Text style={styles.comment}>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Reviews</Text>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={renderReviewItem}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15 },
  title: { fontSize: 18, fontWeight: "700", color: "#fff", marginBottom: 10 },
  reviewCard: {
    backgroundColor: "rgba(26, 10, 58, 0.6)",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  reviewer: { color: "#fff", fontWeight: "bold", marginBottom: 5 },
  ratingRow: { flexDirection: "row", marginBottom: 5 },
  comment: { color: "#ddd", fontSize: 14 },
  emptyContainer: { alignItems: "center", padding: 20 },
  emptyText: { color: "#aaa", fontStyle: "italic" },
});

export default ReviewsSection;
