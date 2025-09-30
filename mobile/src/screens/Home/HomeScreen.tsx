import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { apiGet } from "../../api/client";

// MOCK data and API call are not used in the new UI but are kept
// as requested to not disrupt the file's original structure.
const MOCK_FEATURES = [
  { id: "1", title: "Find DJs" },
  { id: "2", title: "Book Photographers" },
  { id: "3", title: "Hire MCs" }
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#0F0220", "#1A0A3A"]}
        style={styles.gradientBackground}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Your Creative Vybz,</Text>
          <Text style={styles.subtitle}>Unleashed.</Text>

          <View style={styles.buttonContainer}>
            {/* Button 1: Hire a Pro */}
            <TouchableOpacity style={styles.button}>
              <LinearGradient
                colors={['#6A0DFF', '#8A2BE2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Hire a Pro</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Button 2: Join as a Pro */}
            <TouchableOpacity style={styles.button}>
              <LinearGradient
                colors={['#FFC107', '#FF9800']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={[styles.buttonText, { color: '#0F0220' }]}>Join as a Pro</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    marginBottom: 50,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#EAD7FF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 24,
    color: "#EAD7FF",
    textAlign: "center",
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 50,
    width: "100%",
  },
  button: {
    width: "100%",
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 15,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: "center",
    borderRadius: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
