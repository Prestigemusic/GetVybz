// src/screens/Profile/components/AboutSection.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
// Removed TouchableOpacity and Ionicons save button

interface AboutSectionProps {
  isEditing: boolean;
  about: string;
  setAbout: (text: string) => void; // Changed onSave to setAbout for real-time state sync
}

const BRAND_TEXT_LIGHT = '#E0D5FF';
const BRAND_TEXT_GREY = '#AAAAAA';
const BRAND_BACKGROUND_DARK = '#0D0B1F';

const AboutSection: React.FC<AboutSectionProps> = ({ isEditing, about, setAbout }) => {
  // We use the prop 'about' directly and sync changes back via 'setAbout'
  // No need for local state if we use the prop directly for the value

  return (
    <View style={styles.container}>
      {isEditing ? (
        <TextInput
          style={styles.textInput}
          value={about}
          onChangeText={setAbout} // Syncs directly to ProfileScreen state
          placeholder="Tell us about yourself..."
          placeholderTextColor="#A9A9A9"
          multiline
        />
      ) : (
        <Text style={styles.aboutText}>
          {about || "This user hasn’t added an about section yet."}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10, // Adjust from original for cleaner look within ProfileScreen's flow
  },
  textInput: {
    minHeight: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: BRAND_TEXT_LIGHT,
    padding: 15,
    borderRadius: 8,
    textAlignVertical: 'top',
    fontSize: 15,
  },
  aboutText: {
    fontSize: 14,
    color: BRAND_TEXT_GREY,
    lineHeight: 22,
    textAlign: 'left',
  },
});

export default AboutSection;