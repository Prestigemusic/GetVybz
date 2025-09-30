import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function BookingDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { booking } = route.params as any;

  if (!booking) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Booking details not found.</Text>
      </SafeAreaView>
    );
  }

  const isConfirmed = booking.status === "Confirmed";
  const statusColor = isConfirmed ? "#4ADE80" : "#FFD60A";
  const statusIcon = isConfirmed ? "checkmark-circle" : "hourglass";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
      </View>
      
      <View style={styles.detailsCard}>
        <LinearGradient
          colors={['#1F0A3C', '#2a0d5e']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.detailsGradient}
        >
          <View style={styles.detailItem}>
            <Ionicons name="bookmark" size={24} color="#E0D5FF" style={styles.icon} />
            <View>
              <Text style={styles.label}>Event Title</Text>
              <Text style={styles.value}>{booking.title}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={24} color="#E0D5FF" style={styles.icon} />
            <View>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{booking.date}</Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={24} color="#E0D5FF" style={styles.icon} />
            <View>
              <Text style={styles.label}>Time</Text>
              <Text style={styles.value}>{booking.time}</Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name={statusIcon as any} size={24} color={statusColor} style={styles.icon} />
            <View>
              <Text style={styles.label}>Status</Text>
              <Text style={[styles.value, { color: statusColor, fontWeight: 'bold' }]}>{booking.status}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0220",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  detailsCard: {
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  detailsGradient: {
    padding: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    marginRight: 15,
  },
  label: {
    color: "#E0D5FF",
    fontSize: 14,
  },
  value: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 2,
  },
  errorText: {
    color: '#FF4D67',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
  },
});
