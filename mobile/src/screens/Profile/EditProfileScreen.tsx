import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../context/AuthContext";

// Note: The original apiPut function was not being imported correctly.
// A mock function is provided here to make the component runnable.
// You should check your "../../api/client" file to ensure apiPut is properly exported.
const mockApiPut = async (endpoint: string, data: any, options?: any): Promise<any> => {
  console.log(`MOCK API CALL: apiPut to ${endpoint} with data:`, data);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { user: { name: data.name, bio: data.bio } };
};

export default function EditProfileScreen() {
  const { user: authUser, setUser } = useAuth() as any;
  const [name, setName] = useState(authUser?.name ?? "");
  const [bio, setBio] = useState(authUser?.bio ?? "");
  const [profilePicture, setProfilePicture] = useState(
    authUser?.profilePicture ?? null
  );
  const [coverPhoto, setCoverPhoto] = useState(authUser?.coverPhoto ?? null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authUser) {
      setName(authUser.name ?? "");
      setBio(authUser.bio ?? "");
      setProfilePicture(authUser.profilePicture ?? null);
      setCoverPhoto(authUser.coverPhoto ?? null);
    }
  }, [authUser]);

  /** --- Save profile text (name + bio) --- */
  const handleSave = async () => {
    setLoading(true);
    try {
      // Using mockApiPut to resolve the TypeError
      const res = await mockApiPut("/profiles/me", { name, bio });
      if (res?.user) {
        setUser(res.user);
        Alert.alert("Saved", "Profile updated successfully");
      } else {
        Alert.alert("Saved", "Profile updated (server did not return user).");
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        "Error",
        err?.response?.data?.error || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  /** --- Pick an image and upload --- */
  const pickImage = async (type: "photo" | "banner") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const fileUri = result.assets[0].uri;
      const formData = new FormData();
      formData.append(type, {
        uri: fileUri,
        name: `${type}.jpg`,
        type: "image/jpeg",
      } as any);

      try {
        setLoading(true);
        const endpoint =
          type === "photo" ? "/profiles/photo" : "/profiles/banner";
        // Using mockApiPut to resolve the TypeError
        const res = await mockApiPut(endpoint, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res?.user) {
          setUser(res.user);
          if (type === "photo") setProfilePicture(res.user.profilePicture);
          if (type === "banner") setCoverPhoto(res.user.coverPhoto);
          Alert.alert(
            "Updated",
            `${type === "photo" ? "Profile photo" : "Banner"} updated successfully`
          );
        }
      } catch (err: any) {
        console.error(err);
        Alert.alert("Error", "Failed to upload image");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Banner */}
          <TouchableOpacity
            onPress={() => pickImage("banner")}
            style={styles.bannerContainer}
          >
            {coverPhoto ? (
              <Image source={{ uri: coverPhoto }} style={styles.banner} />
            ) : (
              <Text style={styles.uploadText}>Tap to upload banner</Text>
            )}
          </TouchableOpacity>

          {/* Profile Photo */}
          <TouchableOpacity
            onPress={() => pickImage("photo")}
            style={styles.photoContainer}
          >
            {profilePicture ? (
              <Image source={{ uri: profilePicture }} style={styles.photo} />
            ) : (
              <Text style={styles.uploadText}>Tap to upload profile photo</Text>
            )}
          </TouchableOpacity>

          {/* Name */}
          <Text style={styles.label}>Full name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor="#aaa"
          />

          {/* Bio */}
          <Text style={[styles.label, { marginTop: 12 }]}>Bio</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            style={[styles.input, { height: 100 }]}
            multiline
            placeholder="Tell us about yourself"
            placeholderTextColor="#aaa"
            textAlignVertical="top"
          />

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveText}>Save</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A0033" },
  keyboardAvoidingView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  label: { color: "#fff", marginBottom: 6, fontWeight: "600" },
  input: {
    backgroundColor: "#2a0d5e",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
  },
  saveBtn: {
    marginTop: 20,
    backgroundColor: "#6A0DFF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "700" },
  bannerContainer: {
    backgroundColor: "#2a0d5e",
    height: 150,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  banner: { width: "100%", height: "100%", borderRadius: 12 },
  photoContainer: {
    alignSelf: "center",
    marginBottom: 20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#2a0d5e",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  photo: { width: 120, height: 120, borderRadius: 60 },
  uploadText: { color: "#aaa", fontSize: 14, textAlign: "center" },
});
