// FRONTEND: src/screens/Pros/FindProScreen.tsx
import React, { useEffect, useMemo, useState } from "react";
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
  Modal,
  Platform,
  ScrollView,
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
  where,
} from "firebase/firestore";
import axios from "axios";
import { API_BASE } from "../../config";

const DEFAULT_CATEGORIES = [
  "All","DJs","MCs","Musicians","Live Bands","Comedians","Dancers","Choreographers",
  "Photographers","Videographers","Content Creators","Make-Up Artistes","Gele Experts",
  "Event Planners","Decorators","Stage Designers","Caterers",
  "Sound Engineers","Lighting Technicians","Event Security","Power/Generator Rentals","Furniture/Tent Rentals",
  "Music Producers","Music Instructors"
];

const MOCK_PROS = [
  { id: "1", name: "DJ Zedd", services: ["DJs"], avatarUri: "https://placehold.co/250x250/5B21B6/FFFFFF?text=DJ+Zedd", bio: "High energy DJ.", rateCard: [{ label: "4hr set", price: 500 }], gallery: [], bookingDates: {} },
  { id: "2", name: "Maria Jones", services: ["Comedians"], avatarUri: "https://placehold.co/250x250/FACC15/000000?text=Maria", bio: "Laughs for days.", rateCard: [{ label: "Show", price: 400 }], gallery: [], bookingDates: {} },
];

const FindProScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { token } = useAuth();

  const [pros, setPros] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>("All");
  const [queryText, setQueryText] = useState<string>("");
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [aiRunning, setAiRunning] = useState(false);
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [aiConversation, setAiConversation] = useState<Array<{ role: string; text: string }>>([]);

  // Subscribe to pros collection (fallback to users role=pro if empty)
  useEffect(() => {
    let unsub: (() => void) | null = null;
    try {
      const coll = collection(db, "pros");
      const q = fsQuery(coll, orderBy("name", "asc"));
      unsub = onSnapshot(
        q,
        async (snap) => {
          const results: any[] = [];
          snap.forEach((doc) => results.push({ id: doc.id, ...(doc.data() as any) }));

          if (results.length) {
            setPros(results);
            setLoading(false);
            return;
          }

          // fallback: users collection where role == 'pro'
          try {
            const usersColl = collection(db, "users");
            const q2 = fsQuery(usersColl, where("role", "==", "pro"), orderBy("name", "asc"));
            const docs = await getDocs(q2);
            const users: any[] = [];
            docs.forEach((d) => users.push({ id: d.id, ...(d.data() as any) }));
            setPros(users.length ? users : MOCK_PROS);
          } catch (e) {
            console.warn("FindPro fallback users query failed:", e);
            setPros(MOCK_PROS);
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.warn("FindPro: Firestore snapshot error:", err);
          // fallback
          setPros(MOCK_PROS);
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

  // categories listener
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
    const qLower = queryText.trim().toLowerCase();
    return pros.filter((p) => {
      const matchesCategory =
        category === "All" ||
        (p.services || []).some((s: string) => s.toLowerCase().includes(category.toLowerCase()));
      const matchesQuery =
        !qLower ||
        (p.name || "").toLowerCase().includes(qLower) ||
        (p.bio || "").toLowerCase().includes(qLower) ||
        ((p.services || []).join(" ").toLowerCase().includes(qLower));
      return matchesCategory && matchesQuery;
    });
  }, [pros, category, queryText]);

  const requireAuth = (action: string, pro: any, cb?: () => void) => {
    if (!token) {
      Alert.alert(
        "Sign up required",
        `You need to sign up or log in to ${action} ${pro?.name || "this pro"}`,
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
    if (cb) cb();
    return true;
  };

  // ---- Vybz AI: open a modal 'chat-like' Q&A for now ----
  const startAiConversation = () => {
    setAiConversation([{ role: "assistant", text: "Hi! What do you have in mind? Tell me about the event, vibe, date, and budget." }]);
    setAiModalVisible(true);
  };

  const sendAiMessage = async (message: string) => {
    const newConv = [...aiConversation, { role: "user", text: message }];
    setAiConversation(newConv);
    setAiRunning(true);
    try {
      const resp = await axios.post(`${API_BASE}/api/openai/plan`, { query: message, budget: "" });
      const suggestions = resp.data?.suggestions || [];
      // store assistant reply in conversation
      const replyText = (resp.data?.explanation || (Array.isArray(suggestions) ? suggestions.join(", ") : String(suggestions))) || "I couldn't generate a plan.";
      setAiConversation((c) => [...c, { role: "assistant", text: replyText }]);
      // if suggestions exist, merge them into categories (non-destructive)
      if (Array.isArray(suggestions) && suggestions.length) {
        setCategories((prev) => {
          const merged = ["All", ...Array.from(new Set([...suggestions, ...prev.filter(Boolean)]))];
          return merged;
        });
        setCategory(suggestions[0] || "All");
      }
    } catch (err) {
      console.warn("Vybz AI call failed:", err);
      setAiConversation((c) => [...c, { role: "assistant", text: "Sorry — couldn't reach the AI. Try again later." }]);
    } finally {
      setAiRunning(false);
    }
  };

  // helper: compute rating and a primary price (if available)
  const getProPrimaryPrice = (p: any) => {
    if (!p?.rateCard || !Array.isArray(p.rateCard) || p.rateCard.length === 0) return null;
    // find the smallest price as an indicator
    const priced = p.rateCard.filter((r: any) => r?.price != null).sort((a: any, b: any) => a.price - b.price);
    return priced[0];
  };

  const getAvgRating = (p: any) => {
    if (!p?.reviews || !Array.isArray(p.reviews) || p.reviews.length === 0) return null;
    const avg = p.reviews.reduce((a: number, r: any) => a + (r.rating || 0), 0) / p.reviews.length;
    return Number(avg.toFixed(1));
  };

  const isAvailableSoon = (p: any) => {
    // quick heuristic: check bookingDates object for emptiness. If empty => likely available.
    if (!p?.bookingDates) return true;
    const bd = p.bookingDates;
    return Object.keys(bd).length === 0;
  };

  const renderPro = ({ item }: { item: any }) => {
    const price = getProPrimaryPrice(item);
    const rating = getAvgRating(item);
    const available = isAvailableSoon(item);
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.92}
        onPress={() => navigation.navigate("ProProfile", { proId: item.id })}
      >
        <Image
          source={{ uri: item.avatarUri || item.profilePictureUrl || item.avatar || "https://placehold.co/250" }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.proName}>{item.name}</Text>
              <Text style={styles.smallBio} numberOfLines={1}>{item.bio || (item.tagline || "Experienced pro")}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              {rating ? (
                <View style={styles.ratingWrap}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.ratingText}>{rating}</Text>
                </View>
              ) : null}
              {available ? <View style={styles.availBadge}><Text style={styles.availText}>Available</Text></View> : <View style={styles.unavailBadge}><Text style={styles.availText}>Booked</Text></View>}
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.serviceText}>{(item.services && item.services.slice(0, 2).join(", ")) || "Pro services"}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {price ? <Text style={styles.priceText}>₦{price.price}</Text> : <Text style={styles.priceText}>Rates on profile</Text>}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#12003D", "#6A0DFF"]} style={styles.hero}>
        <Text style={styles.heroTitle}>Find the Best Pros</Text>
        <View style={styles.topRow}>
          <View style={styles.searchRow}>
            <Ionicons name="search" size={18} color="#fff" style={{ marginLeft: 6 }} />
            <TextInput
              placeholder="Search DJs, photographers..."
              placeholderTextColor="#ddd"
              style={styles.searchInput}
              value={queryText}
              onChangeText={(t) => setQueryText(t)}
            />
          </View>

          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="filter" size={20} color="#0A0A0A" />
          </TouchableOpacity>
        </View>

        {/* Vybz AI card separated */}
        <TouchableOpacity style={styles.aiCard} activeOpacity={0.95} onPress={startAiConversation}>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiTitle}>Vybz AI</Text>
            <Text style={styles.aiSubtitle}>What do you have in mind? I can plan your event and suggest the pros & budget.</Text>
          </View>
          <View>
            <Ionicons name="robot" size={28} color="#12003D" />
          </View>
        </TouchableOpacity>
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
              <View style={{ padding: 18 }}>
                <Text style={{ color: "#aaa", textAlign: "center", marginTop: 40 }}>
                  No pros found. Try another search, change filters, or use Vybz AI.
                </Text>
              </View>
            )}
          />
        )}
      </View>

      {/* Filter Modal */}
      <Modal visible={filterModalVisible} animationType="slide" transparent>
        <View style={modalStyles.backdrop}>
          <View style={modalStyles.container}>
            <Text style={modalStyles.title}>Refine filters</Text>
            <FlatList
              data={categories}
              keyExtractor={(c) => c}
              numColumns={2}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[modalStyles.token, item === category && modalStyles.tokenActive]}
                  onPress={() => {
                    setCategory(item);
                    setFilterModalVisible(false);
                  }}
                >
                  <Text style={[modalStyles.tokenText, item === category && modalStyles.tokenTextActive]}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={modalStyles.closeBtn} onPress={() => setFilterModalVisible(false)}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* AI Modal (simple chat) */}
      <Modal visible={aiModalVisible} animationType="slide" onRequestClose={() => setAiModalVisible(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#0F0220" }}>
          <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: "#1A0A3A" }}>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>Vybz AI</Text>
            <Text style={{ color: "#aaa", marginTop: 6 }}>Interactive event planner</Text>
          </View>

          <FlatList
            data={aiConversation}
            keyExtractor={(_, i) => String(i)}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <View style={[item.role === "assistant" ? aiStyles.assistant : aiStyles.user]}>
                <Text style={{ color: item.role === "assistant" ? "#000" : "#fff" }}>{item.text}</Text>
              </View>
            )}
          />

          <View style={{ padding: 12, borderTopWidth: 1, borderTopColor: "#1A0A3A", flexDirection: "row", alignItems: "center" }}>
            <TextInput
              placeholder="Describe your event (or ask a question)..."
              placeholderTextColor="#888"
              style={{ flex: 1, backgroundColor: "#1A0A3A", color: "#fff", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}
              onSubmitEditing={(e) => {
                const text = e.nativeEvent.text.trim();
                if (text) sendAiMessage(text);
              }}
            />
            <TouchableOpacity style={{ marginLeft: 12 }} onPress={() => setAiModalVisible(false)}>
              <Text style={{ color: "#00E0FF", fontWeight: "700" }}>Done</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const aiStyles = StyleSheet.create({
  assistant: { alignSelf: "flex-start", backgroundColor: "#fff", padding: 12, borderRadius: 12, marginVertical: 6, maxWidth: "85%" },
  user: { alignSelf: "flex-end", backgroundColor: "#6A0DFF", padding: 12, borderRadius: 12, marginVertical: 6, maxWidth: "85%" },
});

const modalStyles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  container: { backgroundColor: "#0B0420", padding: 18, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "70%" },
  title: { color: "#fff", fontWeight: "700", fontSize: 16, marginBottom: 12 },
  token: { padding: 10, margin: 8, borderRadius: 10, backgroundColor: "#1A0A3A", flex: 1 },
  tokenActive: { backgroundColor: "#6A0DFF" },
  tokenText: { color: "#ccc", textAlign: "center" },
  tokenTextActive: { color: "#fff", fontWeight: "700" },
  closeBtn: { backgroundColor: "#00E0FF", padding: 12, borderRadius: 10, marginTop: 12, alignItems: "center" },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F0220" },
  hero: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: Platform.OS === "android" ? 30 : 22,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  heroTitle: { color: "#fff", fontWeight: "700", fontSize: 20, marginBottom: 8 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  searchRow: { flex: 1, flexDirection: "row", backgroundColor: "#00000040", borderRadius: 12, alignItems: "center", marginRight: 12 },
  searchInput: { flex: 1, color: "#fff", paddingHorizontal: 8, paddingVertical: 10, fontSize: 14 },
  filterBtn: {
    backgroundColor: "#00E0FF",
    padding: 10,
    borderRadius: 10,
  },
  aiCard: {
    marginTop: 12,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  aiTitle: { color: "#12003D", fontWeight: "800", fontSize: 16 },
  aiSubtitle: { color: "#333", marginTop: 6, fontSize: 13, maxWidth: "85%" },

  filterRow: { paddingVertical: 12 },

  filterToken: { backgroundColor: "#1A0A3A", marginLeft: 12, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  filterActive: { backgroundColor: "#6A0DFF" },
  filterText: { color: "#ccc" },
  filterTextActive: { color: "#fff", fontWeight: "700" },

  card: { backgroundColor: "#1A0A3A", borderRadius: 12, padding: 12, marginBottom: 12, flexDirection: "row", alignItems: "center" },
  avatar: { width: 72, height: 72, borderRadius: 10, marginRight: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },

  proName: { fontSize: 16, color: "#fff", fontWeight: "700" },
  smallBio: { color: "#bbb", fontSize: 12, marginTop: 2, maxWidth: 180 },

  ratingWrap: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  ratingText: { color: "#fff", marginLeft: 6, fontWeight: "700" },

  availBadge: { marginTop: 6, backgroundColor: "#00C851", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  unavailBadge: { marginTop: 6, backgroundColor: "#FF3B30", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  availText: { color: "#fff", fontSize: 12 },

  cardFooter: { marginTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  serviceText: { color: "#ccc", fontSize: 13 },
  priceText: { color: "#fff", fontWeight: "700" },
});

export default FindProScreen;
