// src/screens/Dashboard/VendorDashboardScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  Image,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";
import { getTheme } from "../../theme";
import { useNavigation } from "@react-navigation/native";
import { apiGet } from "../../api/client";

const { colors } = getTheme("purple");
const SCREEN_WIDTH = Dimensions.get("window").width;

type Gig = {
  id: string;
  title: string;
  date: string;
  status: string;
  amount: string;
  venue?: string;
};

type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
};

export default function VendorDashboardScreen() {
  const navigation = useNavigation<any>();

  // TODO: replace this with real auth / user context
  const [user, setUser] = useState({
    name: "Daniel",
    avatar: require("../../assets/logo.png"),
    profileCompletion: 72, // percent
  });

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    bookingsThisWeek: 3,
    upcoming: 2,
    earningsThisMonth: 420000, // in your currency
    profileViews7d: 128,
    unreadMessages: 2,
  });

  const [upcomingGigs, setUpcomingGigs] = useState<Gig[]>([
    // placeholder items (will be replaced by API)
    {
      id: "g1",
      title: "Wedding Reception - DJ Set",
      date: "Sep 30, 2025 • 7:00 PM",
      status: "Confirmed",
      amount: "₦120,000",
      venue: "Lagos Event Hall",
    },
    {
      id: "g2",
      title: "Corporate Dinner — Live Band",
      date: "Oct 05, 2025 • 8:00 PM",
      status: "Pending",
      amount: "₦200,000",
      venue: "Victoria Island",
    },
  ]);

  const [recentReviews, setRecentReviews] = useState<Review[]>([
    {
      id: "r1",
      name: "Amaka J.",
      rating: 5,
      text: "Awesome set. The crowd loved the transitions and energy!",
      date: "Sep 5, 2025",
    },
    {
      id: "r2",
      name: "Tunde O.",
      rating: 4,
      text: "Great vibe — slightly late setup but sounded great.",
      date: "Aug 22, 2025",
    },
  ]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Example endpoints — replace with your actual backend endpoints
        const statsRes = await apiGet("/vendor/stats");
        // If your backend isn't ready, keep using the placeholder above.
        if (statsRes) {
          setStats((s) => ({
            ...s,
            bookingsThisWeek: statsRes.bookingsThisWeek ?? s.bookingsThisWeek,
            upcoming: statsRes.upcoming ?? s.upcoming,
            earningsThisMonth:
              statsRes.earningsThisMonth ?? s.earningsThisMonth,
            profileViews7d: statsRes.profileViews7d ?? s.profileViews7d,
            unreadMessages: statsRes.unreadMessages ?? s.unreadMessages,
          }));
        }

        const gigsRes = await apiGet("/vendor/gigs/upcoming");
        if (gigsRes?.gigs) setUpcomingGigs(gigsRes.gigs);

        const revRes = await apiGet("/vendor/reviews/latest");
        if (revRes?.reviews) setRecentReviews(revRes.reviews);
      } catch (err) {
        console.warn("Vendor dashboard fetch error:", err);
        // keep placeholders if fetch fails
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Quick actions for vendor
  const actions = [
    {
      id: "managePortfolio",
      title: "Portfolio",
      icon: "images",
      onPress: () => navigation.navigate("Portfolio"),
    },
    {
      id: "bookings",
      title: "Bookings",
      icon: "calendar",
      onPress: () => navigation.navigate("Bookings"),
    },
    {
      id: "messages",
      title: "Messages",
      icon: "chatbubbles",
      onPress: () => navigation.navigate("Messages"),
      badge: stats.unreadMessages,
    },
    {
      id: "wallet",
      title: "Wallet",
      icon: "wallet",
      onPress: () => navigation.navigate("Wallet"),
    },
  ];

  const renderStatCard = (label: string, value: string | number, icon?: string) => (
    <View style={styles.statCard}>
      {icon && <Ionicons name={icon as any} size={20} color={colors.primary} />}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centeredLoad}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO: avatar + welcome + profile completion */}
        <View style={styles.hero}>
          <Image source={user.avatar} style={styles.avatar} />
          <View style={styles.heroTextWrap}>
            <Text style={styles.heroTitle}>Welcome back, {user.name} 👋</Text>
            <Text style={styles.heroSub}>
              You’ve had {stats.bookingsThisWeek} bookings this week — nice!
            </Text>
            <View style={styles.completionRow}>
              <View style={styles.completionBar}>
                <View
                  style={[
                    styles.completionFill,
                    { width: `${user.profileCompletion}%` },
                  ]}
                />
              </View>
              <Text style={styles.completionText}>
                {user.profileCompletion}% complete
              </Text>
            </View>
          </View>
        </View>

        {/* KPI Cards */}
        <View style={styles.kpiRow}>
          {renderStatCard("Bookings (wk)", stats.bookingsThisWeek, "calendar")}
          {renderStatCard(
            "Earnings (mo)",
            `₦${(stats.earningsThisMonth || 0).toLocaleString()}`,
            "cash"
          )}
          {renderStatCard("Views (7d)", stats.profileViews7d, "eye")}
          {renderStatCard("Unread", stats.unreadMessages, "chatbubbles")}
        </View>

        {/* Quick Actions */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.actionsWrapper}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {actions.map((act, idx) => (
            <Animated.View
              key={act.id}
              entering={FadeInUp.delay(idx * 80).duration(350)}
              style={styles.actionCard}
            >
              <TouchableOpacity
                style={styles.actionInner}
                onPress={act.onPress}
                activeOpacity={0.8}
              >
                <Ionicons name={act.icon as any} size={26} color="#fff" />
                <Text style={styles.actionText}>{act.title}</Text>
                {act.badge ? (
                  <View style={styles.actionBadge}>
                    <Text style={styles.actionBadgeText}>{act.badge}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Upcoming Gigs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Gigs</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Bookings")}>
              <Text style={styles.sectionAction}>See all</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={upcomingGigs}
            keyExtractor={(i) => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16, paddingVertical: 8 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.gigCard}
                onPress={() => navigation.navigate("GigDetails", { id: item.id })}
                activeOpacity={0.85}
              >
                <View style={styles.gigTop}>
                  <Text style={styles.gigTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.gigAmount}>{item.amount}</Text>
                </View>
                <Text style={styles.gigDate}>{item.date}</Text>
                <Text style={styles.gigVenue} numberOfLines={1}>
                  {item.venue}
                </Text>
                <View style={styles.gigStatusRow}>
                  <View style={[styles.gigStatus, item.status === "Confirmed" ? styles.statusConfirmed : styles.statusPending]}>
                    <Text style={styles.gigStatusText}>{item.status}</Text>
                  </View>
                  <TouchableOpacity onPress={() => navigation.navigate("Chat", { gigId: item.id })}>
                    <Text style={styles.gigAction}>Message</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Reviews Snapshot */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Reviews</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Reviews")}>
              <Text style={styles.sectionAction}>See all</Text>
            </TouchableOpacity>
          </View>

          {recentReviews.map((r) => (
            <View key={r.id} style={styles.reviewRow}>
              <View style={styles.reviewLeft}>
                <Ionicons name="person-circle" size={36} color="#999" />
              </View>
              <View style={styles.reviewBody}>
                <View style={styles.reviewTop}>
                  <Text style={styles.reviewName}>{r.name}</Text>
                  <View style={styles.ratingWrap}>
                    <Ionicons name="star" size={14} color="#F5C518" />
                    <Text style={styles.reviewRating}>{r.rating}</Text>
                  </View>
                </View>
                <Text style={styles.reviewText} numberOfLines={2}>
                  {r.text}
                </Text>
                <Text style={styles.reviewDate}>{r.date}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Promotion / Upgrade CTA */}
        <View style={styles.promoCard}>
          <View>
            <Text style={styles.promoTitle}>Feature your profile</Text>
            <Text style={styles.promoSubtitle}>
              Boost visibility for the next 7 days and get more booking requests.
            </Text>
          </View>
          <TouchableOpacity style={styles.promoBtn} onPress={() => navigation.navigate("Promotions")}>
            <Text style={styles.promoBtnText}>Promote</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { paddingBottom: 40 },

  centeredLoad: { flex: 1, justifyContent: "center", alignItems: "center" },

  hero: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 18,
    marginRight: 14,
  },
  heroTextWrap: { flex: 1 },
  heroTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  heroSub: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: 13,
  },
  completionRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  completionBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#EEE",
    borderRadius: 8,
    marginRight: 10,
    overflow: "hidden",
  },
  completionFill: {
    height: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  completionText: {
    minWidth: 46,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },

  kpiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  statCard: {
    width: (SCREEN_WIDTH - 48) / 4,
    backgroundColor: colors.card || "#fff",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    marginTop: 6,
    fontWeight: "800",
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: "center",
  },
  statLabel: {
    marginTop: 6,
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: "center",
  },

  actionsWrapper: {
    marginTop: 18,
  },
  actionCard: {
    width: 120,
    height: 96,
    borderRadius: 14,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  actionInner: { alignItems: "center" },
  actionText: {
    marginTop: 8,
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  actionBadge: {
    position: "absolute",
    right: 8,
    top: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  actionBadgeText: { color: colors.primary, fontWeight: "700" },

  section: {
    marginTop: 18,
    paddingHorizontal: 0,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  sectionAction: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "700",
  },

  gigCard: {
    width: 260,
    padding: 12,
    borderRadius: 14,
    marginRight: 12,
    backgroundColor: colors.card || "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  gigTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  gigTitle: { fontSize: 15, fontWeight: "800", color: colors.textPrimary, flex: 1 },
  gigAmount: { fontSize: 13, fontWeight: "800", color: colors.primary, marginLeft: 8 },
  gigDate: { marginTop: 8, fontSize: 13, color: colors.textSecondary },
  gigVenue: { marginTop: 6, fontSize: 12, color: colors.textSecondary },
  gigStatusRow: { marginTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  gigStatus: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  statusConfirmed: { backgroundColor: "#E6F7ED" },
  statusPending: { backgroundColor: "#FFF7E6" },
  gigStatusText: { fontSize: 12, color: colors.textPrimary, fontWeight: "700" },
  gigAction: { color: colors.primary, fontWeight: "700" },

  reviewRow: { flexDirection: "row", paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#F2F2F2" },
  reviewLeft: { marginRight: 12 },
  reviewBody: { flex: 1 },
  reviewTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  reviewName: { fontWeight: "800", color: colors.textPrimary },
  ratingWrap: { flexDirection: "row", alignItems: "center" },
  reviewRating: { marginLeft: 6, fontWeight: "700", color: colors.textSecondary },
  reviewText: { marginTop: 6, color: colors.textSecondary, fontSize: 13 },
  reviewDate: { marginTop: 6, fontSize: 11, color: colors.textSecondary },

  promoCard: {
    marginTop: 18,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.primary + "10",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  promoTitle: { fontWeight: "800", color: colors.textPrimary, fontSize: 16 },
  promoSubtitle: { marginTop: 6, color: colors.textSecondary, width: SCREEN_WIDTH * 0.58, fontSize: 13 },
  promoBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  promoBtnText: { color: "#fff", fontWeight: "800" },
});
