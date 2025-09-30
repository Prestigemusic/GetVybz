// src/screens/Profile/components/PortfolioCard.tsx
import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";

// Brand Colors
const BRAND_NEON_GLOW = 'rgba(123, 31, 240, 0.7)';
const CARD_BORDER_COLOR = 'rgba(123, 31, 240, 0.3)';

interface PortfolioCardProps {
  uri: string;
  type: "image" | "video";
  onDelete?: () => void;
  isEditing?: boolean;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({
  uri,
  type,
  onDelete,
  isEditing = false,
}) => {
  // Initialize video player only for videos
  const player = useVideoPlayer(type === "video" ? uri : "", (player) => {
    player.loop = false;
    player.muted = true; // Start muted for better UX
  });

  return (
    <View style={cardStyles.cardWrapper}> 
      <View style={cardStyles.card}>
        {type === "image" ? (
          <Image source={{ uri }} style={cardStyles.media} />
        ) : (
          <VideoView
            style={cardStyles.media}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
            contentFit="cover"
          />
        )}
        {isEditing && (
          <TouchableOpacity style={cardStyles.deleteBtn} onPress={onDelete}>
            <Ionicons name="trash-outline" size={18} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Renamed from 'styles' to 'cardStyles' to avoid conflicts
const cardStyles = StyleSheet.create({
  cardWrapper: {
    marginRight: 10,
    position: "relative",
    shadowColor: BRAND_NEON_GLOW,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8, 
    elevation: 6,
    borderRadius: 10, 
  },
  card: {
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: CARD_BORDER_COLOR, 
  },
  media: {
    width: 120,
    height: 120,
    backgroundColor: "#eee",
  },
  deleteBtn: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(217, 83, 79, 0.8)", 
    borderRadius: 15,
    padding: 5,
    zIndex: 10,
  },
});

export default PortfolioCard;