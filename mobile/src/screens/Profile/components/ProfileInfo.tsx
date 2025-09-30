// src/screens/Profile/components/ProfileInfo.tsx
import React from "react";
import { View, Text, StyleSheet, Image, TextInput, Keyboard } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

interface ProfileInfoProps {
  isEditing: boolean;
  name: string;
  tagline: string;
  location: string;
  onChange: (field: string, value: string) => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  isEditing,
  name,
  tagline,
  location,
  onChange,
}) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Image
          source={{
            uri: "https://placehold.co/120x120/7B1FF0/FFFFFF?text=DV",
          }}
          style={styles.avatar}
        />
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(val) => onChange("name", val)}
              placeholder="Name"
              placeholderTextColor="#aaa"
              editable={true}
            />
            <TextInput
              style={styles.input}
              value={tagline}
              onChangeText={(val) => onChange("tagline", val)}
              placeholder="Tagline"
              placeholderTextColor="#aaa"
              editable={true}
            />
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={(val) => onChange("location", val)}
              placeholder="Location"
              placeholderTextColor="#aaa"
              editable={true}
            />
          </>
        ) : (
          <>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.tagline}>{tagline}</Text>
            <Text style={styles.location}>{location}</Text>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", marginVertical: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  name: { fontSize: 22, fontWeight: "700", color: "#fff" },
  tagline: { fontSize: 14, color: "#aaa", marginTop: 4 },
  location: { fontSize: 12, color: "#ccc", marginTop: 2 },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    padding: 8,
    borderRadius: 6,
    marginVertical: 5,
    width: "80%",
  },
});

export default ProfileInfo;
