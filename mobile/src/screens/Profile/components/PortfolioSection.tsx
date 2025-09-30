// src/screens/Profile/components/PortfolioSection.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import SectionWrapper from "./SectionWrapper";
import PortfolioCard from "./PortfolioCard"; // Assuming this is imported

interface PortfolioItem {
  id: string;
  type: "image" | "video";
  uri: string;
}

interface PortfolioSectionProps {
  isEditing: boolean;
  portfolio: PortfolioItem[];
  onSave?: (portfolio: PortfolioItem[]) => void;
}

const BRAND_TEXT_LIGHT = '#E0D5FF';
const BRAND_TEXT_GREY = '#AAAAAA';
const BRAND_ACCENT_BUTTON = '#7B1FF0';
const CARD_SIZE = 120;

const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  isEditing,
  portfolio,
  onSave,
}) => {
  const [items, setItems] = useState<PortfolioItem[]>(portfolio || []);

  useEffect(() => {
    setItems(portfolio);
  }, [portfolio]);

  const addMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Grant photo access to upload media.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    const type = result.assets[0].type === "video" ? "video" : "image";

    // --- MOCK FIREBASE UPLOAD FIX ---
    // In a real app, this is where you'd upload the file and get the download URL.
    // For now, we use the local URI as the mock URL to maintain the structure.
    // --------------------------------

    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      type: type as "image" | "video",
      uri: uri, // Mocked download URL
    };

    const newPortfolio = [...items, newItem];
    setItems(newPortfolio);
    onSave && onSave(newPortfolio); // Sync state back to ProfileScreen
  };

  const deleteMedia = (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to remove this item from your portfolio?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            const newPortfolio = items.filter((item) => item.id !== id);
            setItems(newPortfolio);
            onSave && onSave(newPortfolio); // Sync state back to ProfileScreen
          } 
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: PortfolioItem }) => (
    <PortfolioCard
      uri={item.uri}
      type={item.type}
      isEditing={isEditing}
      onDelete={() => deleteMedia(item.id)}
    />
  );

  const AddButton = () => (
    <TouchableOpacity style={styles.addButton} onPress={addMedia}>
      <Ionicons name="add-circle-outline" size={40} color={BRAND_ACCENT_BUTTON} />
      <Text style={styles.addButtonText}>Add Media</Text>
    </TouchableOpacity>
  );

  return (
    <SectionWrapper title="Portfolio">
      <View style={styles.contentContainer}>
        {items.length === 0 && !isEditing ? (
          <Text style={styles.emptyText}>This user hasn’t uploaded a portfolio yet.</Text>
        ) : (
          <FlatList
            data={isEditing ? [...items, { id: 'add', type: 'image', uri: '' }] : items}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => item.id === 'add' ? <AddButton /> : renderItem({ item })}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </SectionWrapper>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 10,
  },
  list: {
    paddingVertical: 5,
    paddingRight: 20, // To make sure the last item scrolls fully into view
  },
  emptyText: {
    color: BRAND_TEXT_GREY,
    fontStyle: "italic",
    textAlign: "center",
    padding: 15,
  },
  addButton: {
    width: CARD_SIZE,
    height: CARD_SIZE * 0.7, // Match the expected card ratio
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BRAND_ACCENT_BUTTON,
    borderRadius: 12,
    borderStyle: 'dashed',
    marginRight: 10,
    backgroundColor: 'rgba(123, 31, 240, 0.1)',
  },
  addButtonText: {
    color: BRAND_ACCENT_BUTTON,
    fontSize: 12,
    marginTop: 5,
  }
});

export default PortfolioSection;