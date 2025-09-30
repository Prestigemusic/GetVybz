// src/screens/Dashboard/CustomerDashboardScreen.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";

import PromotionsSection from "./components/PromotionsSection";
import EventsSection from "./components/EventsSection";
import TopArtistesSection from "./components/TopArtistesSection";
import DiscoverSection from "./components/DiscoverSection";
import QuickActionsSection from "./components/QuickActionsSection";

const { width } = Dimensions.get("window");

const MOCK_PROMOTIONS = [
  { id: "p1", title: "20% OFF Weekends", subtitle: "On selected DJs", imageUri: "https://placehold.co/600x300/7B1FF0/FFFFFF?text=Promo+1" },
  { id: "p2", title: "Save ₦5,000", subtitle: "First booking", imageUri: "https://placehold.co/600x300/9D4EDD/FFFFFF?text=Promo+2" },
];

const MOCK_EVENTS = [
  { id: "e1", title: "AfroFest 2025", date: "Nov 12", location: "Lagos", imageUri: "https://placehold.co/500x300/4a1a7a/FFFFFF?text=Event+1" },
  { id: "e2", title: "Sunset Party", date: "Oct 29", location: "Victoria Island", imageUri: "https://placehold.co/500x300/5a2a8a/FFFFFF?text=Event+2" },
];

const MOCK_TOP = [
  { id: "t1", name: "DJ Vibez", rating: 4.9, avatarUri: "https://placehold.co/120x120/7B1FF0/FFFFFF?text=DV" },
  { id: "t2", name: "MC Stellar", rating: 4.8, avatarUri: "https://placehold.co/120x120/9D4EDD/FFFFFF?text=MS" },
];

const MOCK_DISCOVER = [
  { id: "d1", name: "Rising Star", niche: "DJ", avatarUri: "https://placehold.co/120x120/7B1FF0/FFFFFF?text=RS" },
  { id: "d2", name: "New Talent", niche: "Photographer", avatarUri: "https://placehold.co/120x120/9D4EDD/FFFFFF?text=NT" },
];

const MOCK_BOOKINGS = [
  { id: "b1", proName: "DJ Prestige", date: "2025-10-25", status: "Confirmed" },
  { id: "b2", proName: "PhotoCrew", date: "2025-11-02", status: "Pending" },
];

const CustomerDashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, token, switchRole } = useAuth();

  const [promotions, setPromotions] = useState(MOCK_PROMOTIONS);
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [topArtistes, setTopArtistes] = useState(MOCK_TOP);
  const [discover, setDiscover] = useState(MOCK_DISCOVER);
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // placeholder for API calls later
  }, [token]);

  const firstName = useMemo(() => {
    if (!user?.name) return "there";
    const parts = String(user.name).trim().split(" ");
    return parts.length ? parts[0] : String(user.name);
  }, [user]);

  const safeNavigate = (routeName: string, params?: object) => {
    try {
      navigation?.navigate?.(routeName, params);
    } catch (err) {
      console.warn("Navigation failed:", err);
    }
  };

  const ListHeader = () => (
    <View>
      {/* header row with switcher */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerGreeting}>Hi {firstName} 👋</Text>
          <Text style={styles.headerSub}>Discover top pros & events</Text>
        </View>
        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => switchRole("pro")}
        >
          <Ionicons name="swap-horizontal" size={18} color="#fff" />
          <Text style={styles.switchButtonText}>Switch</Text>
        </TouchableOpacity>
      </View>

      <PromotionsSection
        data={promotions}
        onPressItem={(id) => console.log("Press promo", id)}
        onSeeAll={() => safeNavigate("PromotionsList")}
      />

      <EventsSection
        data={events}
        onPressEvent={(id) => console.log("Open event", id)}
        onSeeAll={() => safeNavigate("EventsList")}
      />

      <TopArtistesSection
        data={topArtistes}
        onPressArtist={(id) => safeNavigate("ProProfile", { proId: id })}
        onSeeAll={() => safeNavigate("TopArtistesList")}
      />

      <DiscoverSection
        data={discover}
        onPressItem={(id) => safeNavigate("ProProfile", { proId: id })}
        onSeeAll={() => safeNavigate("DiscoverList")}
      />

      <QuickActionsSection
        onAction={(actionKey) => {
          if (actionKey === "createBooking") safeNavigate("CreateBooking");
          if (actionKey === "messages") safeNavigate("Conversations");
          if (actionKey === "findPro") safeNavigate("ProsList");
          if (actionKey === "favorites") safeNavigate("Favorites");
          if (actionKey === "wallet") safeNavigate("Wallet");
        }}
      />

      <View style={{ height: 8 }} />
    </View>
  );

  const renderBooking = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => safeNavigate("BookingDetails", { bookingId: item.id })}
    >
      <Ionicons name="calendar-outline" size={26} color="#6A0DFF" style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.bookingTitle}>{item.proName}</Text>
        <Text style={styles.bookingSubtitle}>{new Date(item.date).toDateString()}</Text>
      </View>
      <Text
        style={[
          styles.bookingStatus,
          item.status === "Confirmed" ? styles.statusConfirmed : styles.statusPending,
        ]}
      >
        {item.status}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.screen}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7B1FF0" />
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={ListHeader}
          renderItem={renderBooking}
          contentContainerStyle={styles.contentContainer}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={
            <View style={{ paddingHorizontal: 20, paddingVertical: 8 }}>
              <Text style={styles.emptyText}>You have no upcoming bookings.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0F0220" },
  contentContainer: { paddingBottom: 40 },
  headerRow: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerGreeting: { fontSize: 24, color: "#fff", fontWeight: "700" },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 4 },

  switchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7B1FF0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  switchButtonText: { color: "#fff", fontWeight: "600", marginLeft: 5 },

  bookingCard: {
    backgroundColor: "#1A0A3A",
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  bookingTitle: { color: "#fff", fontWeight: "700", fontSize: 15 },
  bookingSubtitle: { color: "#E0D5FF", marginTop: 4, fontSize: 13 },
  bookingStatus: { fontWeight: "700" },
  statusConfirmed: { color: "#4CAF50" },
  statusPending: { color: "#FFC107" },

  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#AAA", textAlign: "center" },
});

export default CustomerDashboardScreen;
