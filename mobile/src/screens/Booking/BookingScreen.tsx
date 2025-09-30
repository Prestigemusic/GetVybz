import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// MOCK data remains unchanged as per your request
const MOCK = [
  { id: "1", title: "DJ Prestige", date: "Oct 25, 2023", time: "8:00 PM", status: "Confirmed" },
  { id: "2", title: "Photoshoot Session", date: "Nov 02, 2023", time: "11:30 AM", status: "Pending" },
  { id: "3", title: "Video Shoot", date: "Nov 15, 2023", time: "4:00 PM", status: "Confirmed" },
  { id: "4", title: "Event Curation", date: "Dec 01, 2023", time: "9:00 AM", status: "Pending" }
];

export default function BookingScreen() {
  const navigation = useNavigation();

  const renderItem = ({ item }: { item: (typeof MOCK)[0] }) => {
    const isConfirmed = item.status === "Confirmed";
    const statusColor = isConfirmed ? "#4ADE80" : "#FFD60A";
    const statusText = isConfirmed ? "Confirmed" : "Pending";
    const iconName = isConfirmed ? "checkmark-circle-outline" : "hourglass-outline";

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('BookingDetails', { booking: item })}
      >
        <LinearGradient
          colors={['#1F0A3C', '#2a0d5e']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            {/* Left section for icon and title */}
            <View style={styles.infoSection}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar-outline" size={24} color="#fff" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.date}>{item.date} at {item.time}</Text>
              </View>
            </View>

            {/* Right section for status */}
            <View style={styles.statusSection}>
              <View style={[styles.statusPill, { borderColor: statusColor }]}>
                <Ionicons name={iconName as any} size={14} color={statusColor} />
                <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookings</Text>
        <Text style={styles.headerSubtitle}>Your scheduled events and sessions</Text>
      </View>
      <FlatList
        data={MOCK}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0220",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#E0D5FF",
    fontSize: 16,
    marginTop: 4,
  },
  cardContainer: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  cardGradient: {
    padding: 20,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    padding: 12,
    marginRight: 15,
  },
  textContainer: {
    flexDirection: "column",
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  date: {
    color: "#E0D5FF",
    fontSize: 14,
    marginTop: 4,
  },
  statusSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 6,
  },
});
