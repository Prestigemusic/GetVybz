// src/screens/Profile/components/ReviewsSection.tsx
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date?: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
}

const BRAND_TEXT_LIGHT = '#E0D5FF';
const BRAND_TEXT_GREY = '#AAAAAA';
const BRAND_ACCENT_BUTTON = '#7B1FF0';
const STAR_COLOR = '#FFD700';
const CARD_BACKGROUND = 'rgba(26, 10, 58, 0.5)'; // Dark, slightly translucent background

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.title}>Reviews</Text>
        <Text style={styles.emptyText}>No reviews yet.</Text>
      </View>
    );
  }

  const renderReviewItem = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
        <View style={styles.header}>
            <Ionicons name="person-circle" size={32} color={BRAND_ACCENT_BUTTON} style={styles.userIcon} />
            <View style={styles.userInfo}>
                <Text style={styles.user}>{item.user}</Text>
                <Text style={styles.date}>{item.date || 'Recent'}</Text>
            </View>
            <View style={styles.ratingRow}>
                {Array.from({ length: 5 }).map((_, index) => (
                <Ionicons
                    key={index}
                    name={index < item.rating ? "star" : "star-outline"}
                    size={16}
                    color={STAR_COLOR}
                />
                ))}
            </View>
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
        scrollEnabled={false} // Reviews are rendered inside the main FlatList, so we disable nested scrolling
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 15,
  },
  title: {
    color: BRAND_TEXT_LIGHT,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  reviewCard: {
    backgroundColor: CARD_BACKGROUND,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: BRAND_ACCENT_BUTTON,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    justifyContent: 'space-between'
  },
  userIcon: {
      marginRight: 10,
  },
  userInfo: {
      flex: 1,
  },
  user: {
    color: BRAND_TEXT_LIGHT,
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    color: BRAND_TEXT_GREY,
    fontSize: 12,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
  },
  comment: {
    color: BRAND_TEXT_GREY,
    fontSize: 14,
    lineHeight: 20,
  },
  emptyContainer: {
    marginHorizontal: 20,
    marginVertical: 15,
  },
  emptyText: { 
    color: BRAND_TEXT_GREY, 
    fontStyle: "italic", 
    textAlign: "center", 
    padding: 20 
  },
});

export default ReviewsSection;