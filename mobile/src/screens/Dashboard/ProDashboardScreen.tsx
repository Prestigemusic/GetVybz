import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  StatusBar,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

/**
 * Pro Dashboard with Gig Feed + action cards + interest action + switcher
 * This version implements the 3 strategic cards: Financials, Profile Health, and Interest Status.
 */

/* ------------------------------
    Mock data (replace with API)
    ------------------------------ */
const MOCK_GIGS = [
  {
    id: "g1",
    type: "Wedding Ceremony",
    serviceNeeded: "DJ",
    date: "2025-11-20",
    time: "17:00",
    venue: "Lagos Island, Lagos",
    isVirtual: false,
    currency: "NGN",
    budget: 350000,
    postedBy: "Customer",
    description: "Evening wedding reception — 4hr DJ set required. PA & lighting will be provided.",
  },
  {
    id: "g2",
    type: "Pool Party",
    serviceNeeded: "DJ",
    date: "2025-10-10",
    time: "14:00",
    venue: "Virtual (Zoom)",
    isVirtual: true,
    currency: "USD",
    budget: 500,
    postedBy: "Admin",
    description: "Virtual set for charity livestream — 2hrs. Good promo exposure.",
  },
  {
    id: "g3",
    type: "Birthday Bash",
    serviceNeeded: "MC + DJ",
    date: "2025-12-01",
    time: "20:00",
    venue: "Ikoyi Event Hall",
    isVirtual: false,
    currency: "NGN",
    budget: 150000,
    postedBy: "Pro",
    description: "Birthday party with a crowd of 150. High energy, request Afrobeats + HipHop.",
  },
];

// Mock list of confirmed bookings/gigs
const MOCK_BOOKINGS = [
    {
        id: "b1",
        type: "Corporate Gala",
        date: "2025-12-15",
        time: "19:00",
        venue: "Eko Hotel Ballroom",
        payout: 500000,
        currency: "NGN",
    },
    {
        id: "b2",
        type: "Album Launch Party",
        date: "2026-01-20",
        time: "22:00",
        venue: "Mainland Club",
        payout: 2500,
        currency: "USD",
    },
];

// MOCK: Gigs Completed (kept in Credibility card)
const MOCK_METRICS = {
    gigsCompletedYTD: 14,
};

// Next confirmed gig
const MOCK_NEXT_GIG = {
    id: "n1",
    date: "Sat, Oct 28",
    time: "10:00 AM",
    type: "Aisha K's Wedding",
    location: "Lagos Island Event Center",
    payout: 350000,
    currency: "NGN" as const,
};

// Financial Mock Data (Pillar: Capital) - Single source of truth for financial data
const MOCK_FINANCIALS = {
    accountBalance: 1200000, // NEW: Live available balance
    securedPayouts: 1800000, // Total guaranteed for future confirmed gigs
    pendingWithdrawal: 450000, // Ready to be withdrawn
    lastPayout: 120000,
    earningsThisMonth: 154000,
};

// NEW: Profile Mock Data (Pillar: Credibility)
const MOCK_PROFILE = {
    score: 85,
    topAction: "Add a video sample to reach 90/100",
    rating: 4.8,
    reviewsCount: 154,
};

// NEW: Interest Mock Data (Pillar: Commitment)
const MOCK_INTEREST_STATUS = {
    appliedGigs: 12,
    pendingClientReplies: 5,
    clientsReviewing: 3,
};


/* ------------------------------
    Helpers
    ------------------------------ */
const NGN_TO_USD = 0.0013; // example conversion rate (update with real rate)
const formatCurrency = (amount: number, currency: "NGN" | "USD") => {
  if (currency === "NGN") {
    // show with Naira symbol
    return `₦${Number(amount).toLocaleString()}`;
  } else {
    return `$${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  }
};

const mockDelay = (ms = 700) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------
    Sub-Components
    ------------------------------ */

// New component for the next gig card
const NextGigCard = () => (
    <TouchableOpacity
        style={[styles.cardPrimary, styles.nextGigCard]}
        onPress={() => console.log("Navigate to Next Gig Details")}
    >
      <Ionicons name="calendar-sharp" size={24} color="#00E0FF" style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>Next Confirmed Gig</Text>
        <Text style={styles.nextGigDetails}>{MOCK_NEXT_GIG.type} • {MOCK_NEXT_GIG.location}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.nextGigDate}>{MOCK_NEXT_GIG.date}</Text>
        <Text style={styles.nextGigTime}>{MOCK_NEXT_GIG.time}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#00E0FF" style={{ marginLeft: 10 }} />
    </TouchableOpacity>
);

// NEW: Financial Summary Card (Pillar: Capital) - **Updated with Account Balance**
const FinancialSummaryCard = () => (
    <View style={styles.cardRow}>
        <View style={[styles.cardPrimary, { flex: 1 }]}>
            <View style={styles.cardHeader}>
                <Ionicons name="wallet-outline" size={24} color="#FFD60A" />
                <Text style={styles.cardTitle}>Your Capital</Text>
            </View>

            {/* **NEW: Account Balance as the primary metric in the card** */}
            <View style={styles.mainMetricRow}>
                <Text style={styles.mainMetricValue}>{formatCurrency(MOCK_FINANCIALS.accountBalance, "NGN")}</Text>
                <Text style={styles.mainMetricLabel}>Account Balance</Text>
            </View>

            <View style={styles.metricRow}>
                {/* Pending Withdrawal */}
                <View style={styles.metricItemSmall}>
                    <Text style={styles.metricValueSmall}>{formatCurrency(MOCK_FINANCIALS.pendingWithdrawal, "NGN")}</Text>
                    <Text style={styles.metricLabelSmall}>Pending Withdrawal</Text>
                </View>
                
                {/* Secured Payouts */}
                <View style={styles.metricItemSmall}>
                    <Text style={styles.metricValueSmall}>{formatCurrency(MOCK_FINANCIALS.securedPayouts, "NGN")}</Text>
                    <Text style={styles.metricLabelSmall}>Secured Payouts</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.actionButton} onPress={() => console.log("Withdraw Funds")}>
                <Ionicons name="send" size={16} color="#0A0A0F" />
                <Text style={styles.actionButtonText}>Withdraw Funds</Text>
            </TouchableOpacity>
        </View>
    </View>
);

// NEW: Profile Health Card (Pillar: Credibility) - Now includes Gigs Completed
const ProfileHealthCard = () => (
    <View style={styles.cardRow}>
        <View style={[styles.cardPrimary, { flex: 1 }]}>
            <View style={styles.cardHeader}>
                <Ionicons name="shield-checkmark-outline" size={24} color="#2EF8A0" />
                <Text style={styles.cardTitle}>Credibility Score</Text>
            </View>
            
            <View style={styles.profileScoreRow}>
                <Text style={styles.scoreValue}>{MOCK_PROFILE.score}%</Text>
                <View style={styles.ratingBox}>
                    <Ionicons name="star" size={18} color="#FFD700" />
                    <Text style={styles.ratingText}>{MOCK_PROFILE.rating} ({MOCK_PROFILE.reviewsCount})</Text>
                </View>
            </View>

            {/* Gigs Completed (YTD) - Logical grouping */}
            <View style={[styles.metricRow, styles.gigCompletedRow]}>
                <View style={styles.metricItemSmall}>
                    <Text style={[styles.metricValueSmallLight, { color: '#2EF8A0' }]}>{MOCK_METRICS.gigsCompletedYTD}</Text>
                    <Text style={styles.metricLabelSmall}>Gigs Completed (YTD)</Text>
                </View>
            </View>

            <Text style={styles.profileActionText}>{MOCK_PROFILE.topAction}</Text>

            <TouchableOpacity style={styles.actionButton} onPress={() => console.log("Boost Your Visibility")}>
                <Ionicons name="trending-up" size={16} color="#0A0A0F" />
                <Text style={styles.actionButtonText}>Boost Visibility</Text>
            </TouchableOpacity>
        </View>
    </View>
);


// NEW: Interest Status Card (Pillar: Commitment)
const InterestStatusCard = () => (
    <View style={styles.cardRow}>
        <View style={[styles.cardPrimary, { flex: 1 }]}>
            <View style={styles.cardHeader}>
                <Ionicons name="list-outline" size={24} color="#FF00C7" />
                <Text style={styles.cardTitle}>Pipeline Status</Text>
            </View>

            <View style={styles.metricRow}>
                <View style={styles.metricItemSmall}>
                    <Text style={styles.metricValueSmallLight}>{MOCK_INTEREST_STATUS.appliedGigs}</Text>
                    <Text style={styles.metricLabelSmall}>Gigs Applied</Text>
                </View>
                <View style={styles.metricItemSmall}>
                    <Text style={[styles.metricValueSmallLight, { color: '#FFD60A' }]}>{MOCK_INTEREST_STATUS.pendingClientReplies}</Text>
                    <Text style={styles.metricLabelSmall}>Pending Replies</Text>
                </View>
                <View style={styles.metricItemSmall}>
                    <Text style={[styles.metricValueSmallLight, { color: '#00E0FF' }]}>{MOCK_INTEREST_STATUS.clientsReviewing}</Text>
                    <Text style={styles.metricLabelSmall}>Clients Reviewing</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.actionButton} onPress={() => console.log("Review Applications")}>
                <Ionicons name="eye" size={16} color="#0A0A0F" />
                <Text style={styles.actionButtonText}>Review Applications</Text>
            </TouchableOpacity>
        </View>
    </View>
);


/* ------------------------------
    Screen
    ------------------------------ */
const ProDashboardScreen: React.FC = () => {
  const { user, token, switchRole } = useAuth();
  const navigation = useNavigation<any>();

  // state
  const [gigs, setGigs] = useState(MOCK_GIGS);
  const [bookings, setBookings] = useState(MOCK_BOOKINGS); 
  const [loading, setLoading] = useState(false);
  const [currencyMode, setCurrencyMode] = useState<"NGN" | "USD">("NGN"); // primary display currency
  const [interestedIds, setInterestedIds] = useState<Record<string, boolean>>({}); // local interested state
  const [acceptingGigs, setAcceptingGigs] = useState(true); // quick toggle for availability

  // Calculated Metrics for Header KPIs
  const gigCount = gigs.length; // Dynamically pull the count from the MOCK_GIGS feed
  const interviewInvitesCount = 2; // Keep this mock for now

  // first name short greet
  const firstName = useMemo(() => {
    if (!user?.name) return "there";
    return String(user.name).trim().split(" ")[0];
  }, [user]);

  useEffect(() => {
    // Example: replace with api call to fetch gigs & bookings
    const load = async () => {
      setLoading(true);
      try {
        await mockDelay(400);
        setGigs(MOCK_GIGS);
        setBookings(MOCK_BOOKINGS);
      } catch (err) {
        console.warn("Failed to load pro dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  // user marks interest for a gig (optimistic, safe to wire real endpoint)
  const expressInterest = async (gigId: string) => {
    if (!token) {
      Alert.alert("Sign in required", "Please sign in to express interest.");
      return;
    }
    if (interestedIds[gigId]) {
      // toggle off (withdraw interest)
      setInterestedIds((s) => ({ ...s, [gigId]: false }));
      // TODO: call API to withdraw interest
      return;
    }

    // optimistic UI
    setInterestedIds((s) => ({ ...s, [gigId]: true }));
    try {
      // example: await apiPost(`/api/gigs/${gigId}/interest`, { proId: user.id })
      await mockDelay(600);
      // success — server accepted
    } catch (err) {
      // revert
      setInterestedIds((s) => ({ ...s, [gigId]: false }));
      Alert.alert("Action failed", "Could not register interest. Please try again.");
      console.error("Interest API failed:", err);
    }
  };

  const toggleCurrency = () => {
    setCurrencyMode((c) => (c === "NGN" ? "USD" : "NGN"));
  };

  const renderGigCard = ({ item }: { item: any }) => {
    // compute display budget
    let displayBudget = item.budget;
    let displayCurrency: "NGN" | "USD" = item.currency === "USD" ? "USD" : "NGN";
    if (currencyMode !== displayCurrency) {
      // convert display
      if (currencyMode === "USD") {
        // convert NGN -> USD
        displayBudget = item.currency === "NGN" ? item.budget * NGN_TO_USD : item.budget;
      } else {
        // convert USD -> NGN
        displayBudget = item.currency === "USD" ? Math.round(item.budget / NGN_TO_USD) : item.budget;
      }
      displayCurrency = currencyMode;
    }

    const interested = !!interestedIds[item.id];

    return (
      <View style={styles.gigCard}>
        <View style={styles.gigHeader}>
          <View style={styles.gigTypeBadge}>
            <Text style={styles.gigTypeText}>{item.type}</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.postedByText}>{item.postedBy}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.dateText}>{item.date} {item.time}</Text>
          </View>
        </View>

        <Text style={styles.gigService}>{item.serviceNeeded} • {item.isVirtual ? "Virtual" : item.venue}</Text>
        <Text numberOfLines={2} style={styles.gigDesc}>{item.description}</Text>

        <View style={styles.gigFooter}>
          <View>
            <Text style={styles.budgetText}>{formatCurrency(displayBudget, displayCurrency)}</Text>
            <Text style={styles.budgetSubText}>Budget ({displayCurrency})</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={[styles.interestButton, interested ? styles.interestButtonActive : null]}
              onPress={() => expressInterest(item.id)}
            >
              <Ionicons name={interested ? "heart" : "heart-outline"} size={18} color={interested ? "#FF007F" : "#fff"} />
              <Text style={[styles.interestText, interested ? styles.interestTextActive : null]}>
                {interested ? "Interested" : "I'm Interested"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  /* ------------------------------
      Empty states & sections below
      ------------------------------ */
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#00E0FF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header hero */}
      <StatusBar barStyle="light-content" backgroundColor="#6A0DFF" />
      <LinearGradient
        colors={["#6A0DFF", "#B400FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroTop}>
          {/* FIX: Text wrap adjustment */}
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.heroTitle}>Hi, {firstName} 👋</Text>
            <Text style={styles.heroSubtitle}>Find new gigs • Manage bookings • Grow your brand</Text>
          </View>

          {/* Role Switcher & Availability Toggle */}
          <View style={styles.headerButtonContainer}>
            <TouchableOpacity style={styles.roleSwitch} onPress={() => switchRole("customer")}>
              <Ionicons name="swap-horizontal" size={18} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.availabilityToggle, !acceptingGigs && styles.availabilityToggleInactive]}
              onPress={() => setAcceptingGigs((v) => !v)}
            >
              <Ionicons name={acceptingGigs ? "notifications" : "notifications-off"} size={16} color={acceptingGigs ? "#0A0A0F" : "#fff"} />
              <Text style={[styles.availabilityText, !acceptingGigs && styles.availabilityTextInactive]}>{acceptingGigs ? "Accepting" : "Unavailable"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Updated metrics layout - Now shows Opportunities */}
        <View style={styles.heroBottom}>
          <View style={styles.heroBottomMetrics}>
            
            {/* KPI 1: New Gigs Available (Opportunity Focus) - Connected to the gig feed count */}
            <View style={styles.kpiContainer}>
              <Text style={styles.kpiValue}>
                {gigCount}
              </Text>
              <Text style={styles.kpiLabel}>New Gigs Available</Text>
            </View>

            {/* KPI 2: Interview Invites (Conversion Focus) */}
            <View style={styles.kpiContainer}>
              <Text style={[styles.kpiValue, { color: interviewInvitesCount > 0 ? '#FFD60A' : '#B0B0B0' }]}>
                {interviewInvitesCount}
              </Text>
              <Text style={styles.kpiLabel}>Interview Invites</Text>
            </View>
          </View>

          <View>
            <TouchableOpacity style={styles.currencyToggle} onPress={toggleCurrency}>
              <Text style={styles.currencyText}>{currencyMode}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Gig feed with New Cards as Header */}
      <FlatList
        data={gigs}
        keyExtractor={(i) => i.id}
        renderItem={renderGigCard}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <View>
            {/* 1. Next Confirmed Gig Card (Pillar: Commitment - Time-sensitive) */}
            <NextGigCard />
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollCardContainer}>
                {/* 2. Financial Summary Card (Pillar: Capital) - Now includes Account Balance */}
                <FinancialSummaryCard />

                {/* 3. Profile Health Card (Pillar: Credibility) - Includes Gigs Completed */}
                <ProfileHealthCard />

                {/* 4. Interest Status Card (Pillar: Commitment - Pipeline) */}
                <InterestStatusCard />
            </ScrollView>


            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>New Gig Feed</Text>
              <TouchableOpacity onPress={() => navigation.navigate("CreateGig" as never)} style={styles.createGigButton}>
                <Text style={styles.createGigText}>Post a Gig</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListFooterComponent={() => (
          <View style={{ padding: 20 }}>
            <Text style={{ color: "#B0B0B0", textAlign: "center" }}>End of feed • refresh to load more</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

/* ------------------------------
    Styles (brand-driven)
    ------------------------------ */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A0033" /* deep indigo background */ },
  hero: {
    paddingHorizontal: 18,
    paddingTop: 40, // Fixed top spacing
    paddingBottom: 18,
  },
  heroTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  heroTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "700" },
  heroSubtitle: { 
    color: "#00E0FF", 
    fontSize: 13, // Slightly reduced font size for better fit
    marginTop: 6, 
    fontWeight: "600",
    // Removed flexShrink as flex: 1 on parent container handles space distribution
  }, 

  headerButtonContainer: { flexDirection: "row", alignItems: "center" }, // Fix for button alignment

  heroBottom: { marginTop: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  heroBottomMetrics: { flexDirection: "row", alignItems: "flex-end" },
  kpiContainer: { marginRight: 24 },
  kpiLabel: { color: "#B0B0B0", fontSize: 11, marginTop: 4 },
  // Updated color for opportunity metrics to contrast with the primary financial color used in cards
  kpiValue: { color: "#2EF8A0", fontWeight: "800", fontSize: 24 }, 

  // Availability Toggle Styles
  availabilityToggle: {
    backgroundColor: "#2EF8A0", // Active (Accepting)
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  availabilityToggleInactive: {
    backgroundColor: "rgba(255, 0, 127, 0.2)", // Inactive (Unavailable)
    borderColor: "#FF007F",
    borderWidth: 1,
  },
  availabilityText: { color: "#0A0A0F", fontWeight: "700", marginLeft: 6 },
  availabilityTextInactive: { color: "#FF007F" },

  // Role Switcher Styles (FIXED positioning)
  roleSwitch: {
    marginRight: 8, // Separator margin
    backgroundColor: "#4A00FF",
    padding: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },

  currencyToggle: {
    backgroundColor: "#00000033",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  currencyText: { color: "#fff", fontWeight: "700" },

  listContent: { padding: 16, paddingBottom: 80 },

  // section header
  sectionHeaderRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginTop: 20, // Added separation after new card
    marginBottom: 10 
  },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  createGigButton: {
    backgroundColor: "#FF00C7",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  createGigText: { color: "#fff", fontWeight: "700" },

  // ------------------------------------------------------------------
  // NEW STYLES FOR CARD ARCHITECTURE
  // ------------------------------------------------------------------
  
  // Base Card Style
  cardPrimary: {
    backgroundColor: '#0F0220', // Dark background
    borderColor: '#4A00FF', // Subtle purple border
    borderWidth: 1,
    padding: 15,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  cardTitle: {
    color: '#E0E0E0',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardRow: {
    marginRight: 12, // Space between horizontal cards
    width: 280, // Fixed width for horizontal scrolling cards
    minHeight: 180, // Ensure minimum height consistency
  },
  scrollCardContainer: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  actionButton: {
    backgroundColor: "#2EF8A0",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 'auto', // Push button to the bottom
  },
  actionButtonText: {
    color: "#0A0A0F",
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 14,
  },

  // 1. Next Gig Card Specifics
  nextGigCard: {
    borderColor: '#00E0FF', // Neon accent border
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#00E0FF",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  nextGigDetails: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  nextGigDate: {
    color: '#FFD60A',
    fontSize: 15,
    fontWeight: '600',
  },
  nextGigTime: {
    color: '#B0B0B0',
    fontSize: 12,
    marginTop: 2,
  },

  // 2. Financial & Interest Metric Box Styles
  mainMetricRow: {
    marginBottom: 18,
    alignItems: 'center',
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 214, 10, 0.3)',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 214, 10, 0.05)',
  },
  mainMetricValue: {
    color: '#FFD60A',
    fontSize: 28,
    fontWeight: '900',
  },
  mainMetricLabel: {
    color: '#E0E0E0',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },

  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metricItemSmall: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  metricValueSmall: {
    color: '#00E0FF',
    fontSize: 18,
    fontWeight: '800',
  },
  metricValueSmallLight: {
    color: '#FFFFFF', // White for base metric
    fontSize: 18,
    fontWeight: '800',
  },
  metricLabelSmall: {
    color: '#B0B0B0',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  gigCompletedRow: {
    justifyContent: 'center',
    marginTop: 10, 
    marginBottom: 15, 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(46, 248, 160, 0.2)', 
    paddingTop: 10,
  },

  // 3. Profile Health Card Specifics
  profileScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#2EF8A0',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  ratingText: {
    color: '#FFD700',
    fontWeight: '600',
    marginLeft: 5,
    fontSize: 14,
  },
  profileActionText: {
    color: '#B0B0B0',
    fontSize: 13,
    marginBottom: 15,
    fontStyle: 'italic',
  },


  // ------------------------------------------------------------------
  // END NEW STYLES
  // ------------------------------------------------------------------

  // gig card
  gigCard: {
    backgroundColor: "#0F0220",
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.28,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  gigHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  gigTypeBadge: {
    backgroundColor: "#6A0DFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 10,
  },
  gigTypeText: { color: "#fff", fontWeight: "700" },
  postedByText: { color: "#B0B0B0", fontSize: 12 },
  dot: { color: "#B0B0B0", marginHorizontal: 6 },
  dateText: { color: "#B0B0B0", fontSize: 12 },

  gigService: { color: "#FFD60A", fontWeight: "700", marginBottom: 6 },
  gigDesc: { color: "#E0E0E0", fontSize: 13, marginBottom: 12 },

  gigFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  budgetText: { color: "#00E0FF", fontWeight: "700", fontSize: 16 },
  budgetSubText: { color: "#B0B0B0", fontSize: 12 },

  interestButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6A0DFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginLeft: 8,
  },
  interestButtonActive: {
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "#FF007F",
  },
  interestText: { color: "#fff", marginLeft: 8, fontWeight: "700" },
  interestTextActive: { color: "#FF007F" },
});

export default ProDashboardScreen;
