// src/screens/Profile/components/SectionWrapper.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SectionWrapperProps {
  title: string;
  isEditing?: boolean;
  isOwner?: boolean;
  onEdit?: () => void;
  children: React.ReactNode;
}

const BRAND_TEXT_LIGHT = '#E0D5FF';
const BRAND_TEXT_GREY = '#AAAAAA';
const BRAND_ACCENT_BUTTON = '#7B1FF0';

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  title,
  isEditing,
  isOwner,
  onEdit,
  children,
}) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {/* Removed internal 'Edit' button to centralize control in ProfileScreen */}
        {isOwner && isEditing && (
            <Text style={styles.editingIndicator}>EDIT MODE</Text>
        )}
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: { 
    marginTop: 30, 
    paddingHorizontal: 20 
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: BRAND_TEXT_LIGHT 
  },
  editingIndicator: {
    fontSize: 12,
    fontWeight: '600',
    color: BRAND_ACCENT_BUTTON,
    borderWidth: 1,
    borderColor: BRAND_ACCENT_BUTTON,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
});

export default SectionWrapper;