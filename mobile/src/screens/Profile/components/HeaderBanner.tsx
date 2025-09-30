// src/screens/Profile/components/HeaderBanner.tsx
import React from "react";
import {
  View,
  Text,
  Pressable,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

interface HeaderBannerProps {
  isEditing: boolean;
  bannerUrl?: string;
  onBannerChange?: (url: string) => void;
  onLogout: () => void; // 🛑 Added Logout prop
}

const BRAND_TEXT_LIGHT = '#E0D5FF';
const BRAND_ACCENT_BUTTON = '#7B1FF0';

const HeaderBanner: React.FC<HeaderBannerProps> = ({
  isEditing,
  bannerUrl = "https://placehold.co/600x400/1A0A3A/FFFFFF?text=PRO+BANNER",
  onBannerChange,
  onLogout, // 🛑 Used new prop
}) => {
  const navigation = useNavigation();

  const handleBannerChange = async () => {
    // ... (ImagePicker logic remains the same)
  };

  return (
    <ImageBackground
      source={{ uri: bannerUrl }}
      style={styles.banner}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.6)", "transparent"]}
        style={styles.bannerOverlay}
      >
        <View style={styles.headerButtons}>
          <Pressable style={styles.headerButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          {/* 🛑 LOGOUT BUTTON: Placed according to global standards (top-right menu) */}
          <Pressable style={styles.headerButton} onPress={onLogout}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </Pressable>
        </View>

        {isEditing && (
          <TouchableOpacity style={styles.bannerEditButton} onPress={handleBannerChange}>
            <Ionicons name="camera" size={16} color="#fff" />
            <Text style={styles.bannerEditText}>Change Banner</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  banner: { height: 220, justifyContent: "space-between" },
  bannerOverlay: { flex: 1, padding: 15, justifyContent: "space-between" },
  headerButtons: { flexDirection: "row", justifyContent: "space-between" },
  headerButton: { // Unified style for top-level icon buttons
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerEditButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: BRAND_ACCENT_BUTTON,
  },
  bannerEditText: {
    color: BRAND_TEXT_LIGHT,
    marginLeft: 5,
    fontWeight: '600'
  },
});

export default HeaderBanner;