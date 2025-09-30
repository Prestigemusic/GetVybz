// src/screens/Pros/FindProScreen.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Image,
  Alert,
  SafeAreaView,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebaseConfig";
import {
  collection,
  onSnapshot,
  query as fsQuery,
  orderBy,
  getDocs,
  limit,
} from "firebase/firestore";
import axios from "axios";

/**
 * FindProScreen (updated for seeded data)
 */

const DEFAULT_CATEGORIES = [
  "All","DJs","MCs","Musicians","Live Bands","Comedians","Dancers","Choreographers",
  "Photographers","Videographers","Content Creators","Make-Up Artistes","Gele Experts",
  "Event Planners","Decorators","Stage Designers","Caterers",
  "Sound Engineers","Lighting Technicians","Event Security/Bouncers","Power/Generator Rentals","Furniture/Tent Rentals",
  "Music Producers","Music Instructors"
];

const MOCK_PROS = [
  { id: "1", name: "DJ Zedd", services: ["DJs"], profilePictureUrl: "https://placehold.co/250x250/5B21B6/FFFFFF?text=DJ+Zedd", bio: "High energy DJ.", rateCard: [{ label: "4hr set", price: 500 }], gallery: [], availability: [] },
  { id: "2", name: "Maria Jones", services: ["Comedians"], profilePictureUrl: "https://placehold.co/250x250/FACC15/000000?text=Maria", bio: "Laughs for days.", rateCard: [{ label: "Show", price: 400 }], gallery: [], availability: [] },
];

const FindProScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { token } = useAuth();

  const [pros, setPros] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState<string>("");

  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

  // Subscribe to pros collection
  useEffect(() => {
    let unsub: (() => void) | null = null;
    try {
      const coll = collection(db, "pros");
      const q = fsQuery(coll, orderBy("name", "asc"));
      unsub = onSnapshot(
        q,
        (snap) => {
          const results: any[] = [];
          snap.forEach((doc) => {
            results.push({ id: doc.id, ...(doc.data() as any) });
          });
          setPros(results);
          setLoading(false);
        },
        async () => {
          const docs = await getDocs(q);
          const results: any[] = [];
          docs.forEach((d) => results.push({ id: d.id, ...(d.data() as any) }));
          setPros(results.length ? results : MOCK_PROS);
          setLoading(false);
        }
      );
    } catch (err) {
      console.warn("FindPro: Firestore not available", err);
      setPros(MOCK_PROS);
      setLoading(false);
    }

    return () => {
      if (unsub) unsub();
    };
  }, []);

  // Subscribe to categories collection
  useEffect(() => {
    let unsub: (() => void) | null = null;
    try {
      const coll = collection(db, "categories");
      const q = fsQuery(coll, orderBy("name", "asc"), limit(200));
      unsub = onSnapshot(
        q,
        (snap) => {
          const cats: string[] = [];
          snap.forEach((d) => {
            const data = d.data() as any;
            if (data?.name) cats.push(data.name);
          });
          if (cats.length) setCategories(["All", ...cats]);
        },
        () => {}
      );
    } catch (err) {
      console.warn("categories listener failed:", err);
    }
    return () => {
      if (unsub) unsub();
    };
  }, []);

  const filtered = useMemo(() => {
    const qLower = query.trim().toLowerCase();
    return pros.filter((p) => {
      const matchesCategory =
        category === "All" ||
        (p.services || []).some((s: string) => s.toLowerCase().includes(category.toLowerCase()));
      const matchesQuery =
        !qLower ||
        (p.name || "").toLowerCase().includes(qLower) ||
        (p.bio || "").toLowerCase().includes(qLower);
      return matchesCategory && matchesQuery;
    });
  }, [pros, category, query]);

  const requireAuth = (action: string, pro: any) => {
    if (!token) {
      Alert.alert(
        "Sign up required",
        `You need to sign up or log in to ${action} ${pro.name}`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Sign Up",
            onPress: () => navigation.navigate("SignUp"),
          },
        ]
      );
      return false;
    }
    return true;
  };

  const renderPro = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.92}
      onPress={() => navigation.navigate("ProProfile", { proId: item.id })}
    >
      <Image
        source={{ uri: item.profilePictureUrl || item.avatarUri || "https://placehold.co/250" }}
        style={styles.avatar}
      />
      <View style={{ flex: 1 }}>
        <View style={styles.cardHeader}>
          <Text style={styles.proName}>{item.name}</Text>
          <View style={styles.serviceBadge}>
            <Text style={styles.serviceBadgeText}>{(item.services && item.services[0]) || "Pro"}</Text>
          </View>
        </View>
        <Text style={styles.bioText} numberOfLines={2}>
          {item.bio || "No bio yet"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#12003D", "#6A0DFF", "#B400FF"]} style={styles.hero}>
        <Text style={styles.heroTitle}>Find the Best Pros</Text>
        <View style={styles.searchRow}>
          <TextInput
            placeholder="Search for DJs, MCs, photographers..."
            placeholderTextColor="#ddd"
            style={styles.searchInput}
            value={query}
            onChangeText={(t) => setQuery(t)}
          />
        </View>
      </LinearGradient>

      <View style={styles.filterRow}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(c) => c}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterToken, item === category && styles.filterActive]}
              onPress={() => setCategory(item)}
            >
              <Text style={[styles.filterText, item === category && styles.filterTextActive]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={{ flex: 1 }}>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 32 }} color="#fff" size="large" />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(p) => p.id}
            renderItem={renderPro}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={() => (
              <Text style={{ color: "#aaa", textAlign: "center", marginTop: 40 }}>No pros found.</Text>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F0220" },
  hero: { padding: 16, borderBottomLeftRadius: 14, borderBottomRightRadius: 14 },
  heroTitle: { color: "#fff", fontWeight: "700", fontSize: 18 },
  searchRow: { flexDirection: "row", marginTop: 12, backgroundColor: "#00000040", borderRadius: 12 },
  searchInput: { flex: 1, color: "#fff", paddingHorizontal: 12, paddingVertical: 10 },
  filterRow: { paddingVertical: 12 },
  filterToken: { backgroundColor: "#1A0A3A", marginLeft: 12, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  filterActive: { backgroundColor: "#6A0DFF" },
  filterText: { color: "#ccc" },
  filterTextActive: { color: "#fff", fontWeight: "700" },
  card: { backgroundColor: "#1A0A3A", borderRadius: 12, padding: 12, marginBottom: 12, flexDirection: "row" },
  avatar: { width: 72, height: 72, borderRadius: 10, marginRight: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  proName: { fontSize: 16, color: "#fff", fontWeight: "700" },
  serviceBadge: { backgroundColor: "#6A0DFF", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  serviceBadgeText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  bioText: { color: "#ccc", marginTop: 6, fontSize: 13 },
});

export default FindProScreen;
