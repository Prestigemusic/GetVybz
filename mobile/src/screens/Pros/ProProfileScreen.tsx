// src/screens/Pros/ProProfileScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebaseConfig";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
  getDoc,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";

import CalendarSection from "../Profile/components/CalendarSection";

// helper: slugify
const slugify = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

const ProProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { token, user } = useAuth();
  const route = useRoute<any>();
  const proId = route.params?.proId || user?.uid;

  const [pro, setPro] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");

  // Subscribe to Firestore pro doc
  useEffect(() => {
    if (!proId) {
      setLoading(false);
      return;
    }
    const ref = doc(db, "pros", proId);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setPro({ id: snap.id, ...snap.data() });
        } else {
          setPro(null);
        }
        setLoading(false);
      },
      (err) => {
        console.warn("ProProfile doc error:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [proId]);

  useEffect(() => {
    if (pro && user && proId === user.uid) setIsOwner(true);
    else setIsOwner(false);
  }, [pro, user]);

  const requireAuth = (action: string, cb: () => void) => {
    if (!token) {
      Alert.alert("Sign up required", `Please sign up or log in to ${action}.`, [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Up", onPress: () => navigation.navigate("SignUp") },
      ]);
      return;
    }
    cb();
  };

  const handleSaveField = async (field: string, value: any) => {
    if (!isOwner || !proId) return;
    try {
      const ref = doc(db, "pros", proId);
      await updateDoc(ref, { [field]: value });
    } catch (err) {
      console.error("Update failed:", err);
      Alert.alert("Error", "Could not save changes.");
    }
  };

  const handleAvatarChange = async () => {
    if (!isOwner) return;
    const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (res.status !== "granted") {
      Alert.alert("Permissions", "Allow photo access to change avatar.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.length) {
      const uri = result.assets[0].uri;
      await handleSaveField("avatarUri", uri);
    }
  };

  const handleAddService = async () => {
    const name = newServiceName.trim();
    if (!name) return Alert.alert("Add service", "Enter a service name first.");
    if (!proId) return;

    try {
      // Add to pro.services array
      const ref = doc(db, "pros", proId);
      await updateDoc(ref, { services: arrayUnion(name) });

      // Ensure categories collection has this service (use slug id)
      const slug = slugify(name);
      await setDoc(doc(db, "categories", slug), { name }, { merge: true });

      setNewServiceName("");
      Alert.alert("Added", `${name} added to your services.`);
    } catch (err) {
      console.error("Add service failed:", err);
      Alert.alert("Error", "Could not add service.");
    }
  };

  if (loading) return <View style={styles.loading}><ActivityIndicator color="#6A0DFF" size="large" /></View>;
  if (!pro) return <View style={styles.loading}><Text style={{ color: "#fff" }}>Pro not found</Text></View>;

  const avgRating =
    pro.reviews && pro.reviews.length
      ? (pro.reviews.reduce((a: number, r: any) => a + (r.rating || 0), 0) / pro.reviews.length).toFixed(1)
      : "—";

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: pro.bannerUri || pro.image || "https://placehold.co/600x200" }} style={styles.heroImage} />

      <LinearGradient colors={["#12003D", "#6A0DFF"]} style={styles.headerCard}>
        <TouchableOpacity onPress={isOwner ? handleAvatarChange : undefined}>
          <Image source={{ uri: pro.avatarUri || pro.image }} style={styles.avatar} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          {isEditing && isOwner ? (
            <TextInput
              style={styles.editName}
              value={pro.name}
              onChangeText={(t) => handleSaveField("name", t)}
            />
          ) : (
            <Text style={styles.proName}>{pro.name}</Text>
          )}

          <View style={styles.row}>
            <Ionicons name="musical-notes" size={18} color="#fff" />
            <Text style={styles.proService}>{(pro.services && pro.services.join(", ")) || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="location" size={18} color="#fff" />
            <Text style={styles.proLocation}>{pro.location || "—"}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="star" size={18} color="#FFD700" />
            <Text style={styles.proRating}>{avgRating} / 5</Text>
          </View>
        </View>
        {isOwner && (
          <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(!isEditing)}>
            <Ionicons name="create" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rates</Text>
        {(pro.rateCard || []).map((r: any, idx: number) => (
          <View key={idx} style={styles.rateCard}>
            <Text style={styles.rateText}>{`${r.label || "Service"} — ₦${r.price}`}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        {isEditing && isOwner ? (
          <TextInput style={styles.bioInput} value={pro.bio} onChangeText={(text) => handleSaveField("bio", text)} multiline />
        ) : (
          <Text style={styles.bioText}>{pro.bio || "No bio yet."}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services</Text>

        <FlatList
          data={pro.services || []}
          keyExtractor={(s: string, i: number) => String(i) + s}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={[styles.serviceChip, { backgroundColor: "#1A0A3A" }]}>
              <Text style={styles.serviceChipText}>{item}</Text>
            </View>
          )}
        />

        {isOwner && (
          <View style={{ marginTop: 12 }}>
            <TextInput
              placeholder="Add a new service (e.g., 'Live Saxophonist')"
              placeholderTextColor="#bbb"
              style={styles.inputNewService}
              value={newServiceName}
              onChangeText={setNewServiceName}
            />
            <TouchableOpacity style={styles.addServiceBtn} onPress={handleAddService}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>Add service</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Availability</Text>
        <CalendarSection isEditing={isOwner} bookingDates={pro.bookingDates || {}} setBookingDates={(dates) => handleSaveField("bookingDates", dates)} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gallery</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(pro.gallery || []).map((uri: string, idx: number) => (
            <Image key={idx} source={{ uri }} style={styles.galleryImage} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => requireAuth("chat", () => navigation.navigate("Messaging", { proId: pro.id }))}>
          <Ionicons name="chatbubbles" size={20} color="#fff" />
          <Text style={styles.actionText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#FF00C7" }]} onPress={() => requireAuth("book", () => navigation.navigate("CreateBooking", { proId: pro.id }))}>
          <Ionicons name="calendar" size={20} color="#fff" />
          <Text style={styles.actionText}>Book</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F0220" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  heroImage: { width: "100%", height: 220 },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  editBtn: { marginLeft: 10, padding: 8 },
  proName: { fontSize: 22, fontWeight: "700", color: "#fff" },
  editName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    backgroundColor: "#1A0A3A",
    borderRadius: 6,
    paddingHorizontal: 6,
  },
  row: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  proService: { color: "#fff", marginLeft: 6, fontSize: 14 },
  proLocation: { color: "#fff", marginLeft: 6, fontSize: 14 },
  proRating: { color: "#FFD700", marginLeft: 6, fontSize: 14 },
  section: { padding: 16 },
  sectionTitle: { color: "#fff", fontWeight: "700", fontSize: 16, marginBottom: 8 },
  rateCard: { backgroundColor: "#1A0A3A", borderRadius: 12, padding: 12, marginBottom: 8 },
  rateText: { color: "#fff" },
  bioText: { color: "#ccc" },
  bioInput: { backgroundColor: "#1A0A3A", color: "#fff", borderRadius: 8, padding: 8, minHeight: 60 },
  serviceChip: { backgroundColor: "#1A0A3A", padding: 10, borderRadius: 8, margin: 4, flex: 1 },
  serviceChipText: { color: "#ccc", textAlign: "center" },
  galleryImage: { width: 140, height: 100, borderRadius: 10, marginRight: 8 },
  actions: { flexDirection: "row", justifyContent: "space-between", padding: 16 },
  actionButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 12, borderRadius: 10, marginHorizontal: 6, backgroundColor: "#6A0DFF" },
  actionText: { color: "#fff", marginLeft: 6, fontWeight: "600" },
  inputNewService: { backgroundColor: "#1A0A3A", color: "#fff", borderRadius: 8, padding: 10, marginBottom: 8 },
  addServiceBtn: { backgroundColor: "#00E0FF", padding: 12, borderRadius: 10, alignItems: "center" },
});

export default ProProfileScreen;
