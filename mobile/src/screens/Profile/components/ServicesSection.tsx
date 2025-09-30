// src/screens/Profile/components/ServicesSection.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import SectionWrapper from "./SectionWrapper"; // Ensure correct import

const BRAND_BACKGROUND_DARK = '#0D0B1F'; 
const BRAND_TEXT_LIGHT = '#E0D5FF';
const BRAND_TEXT_GREY = '#AAAAAA';
const BRAND_ACCENT_BUTTON = '#7B1FF0';
const BRAND_RED = '#D9534F';

const serviceCatalog = [
  "Wedding DJ",
  "Corporate Event DJ",
  "Birthday Party DJ",
  "Club & Lounge DJ",
  "Custom Service",
];

interface Service {
    id: string;
    name: string;
    price: number;
    unit: string;
}

interface ServicesSectionProps {
    isOwner: boolean;
    isEditing: boolean;
    services: Service[];
    setServices: (services: Service[]) => void;
}


const ServicesSection: React.FC<ServicesSectionProps> = ({ isOwner, isEditing, services, setServices }) => {
  const [selectedService, setSelectedService] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("per_hour");

  const addService = () => {
    if (!selectedService || !price) {
      Alert.alert("Missing info", "Please select a service and enter a price.");
      return;
    }

    const newService = {
      id: Date.now().toString(),
      name: selectedService,
      price: Number(price),
      unit,
    };

    setServices([...services, newService]);
    setSelectedService("");
    setPrice("");
    setUnit("per_hour");
  };

  const removeService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const renderServiceCard = ({ item }: { item: Service }) => (
    <LinearGradient
        colors={['rgba(123, 31, 240, 0.2)', BRAND_BACKGROUND_DARK]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.serviceCardWrapper}
    >
        <View style={styles.serviceCard}>
            <View>
                <Text style={styles.serviceName}>{item.name}</Text>
                <Text style={styles.servicePrice}>
                    ₦{item.price.toLocaleString()} / {item.unit.replace('_', ' ')}
                </Text>
            </View>
            {isEditing && (
                <TouchableOpacity onPress={() => removeService(item.id)}>
                    <Ionicons name="close-circle" size={24} color={BRAND_RED} />
                </TouchableOpacity>
            )}
        </View>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      {services.length === 0 && !isEditing ? (
        <Text style={styles.emptyText}>No services listed.</Text>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={renderServiceCard}
        />
      )}

      {isEditing && (
        <View style={styles.editSection}>
            <Text style={styles.editTitle}>Add New Service</Text>
            {/* Service Dropdown Mock */}
            <TouchableOpacity style={styles.input} onPress={() => Alert.alert("Service Select", serviceCatalog.join(', '))}>
                <Text style={{ color: selectedService ? BRAND_TEXT_LIGHT : BRAND_TEXT_GREY }}>
                    {selectedService || "Select Service Type"}
                </Text>
            </TouchableOpacity>

            <View style={styles.inputRow}>
                <TextInput
                    style={[styles.input, { flex: 2 }]}
                    placeholder="Price (e.g. 50000)"
                    placeholderTextColor={BRAND_TEXT_GREY}
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                />
                <TouchableOpacity 
                    style={[styles.unitButton, { backgroundColor: unit === 'per_hour' ? BRAND_ACCENT_BUTTON : 'rgba(255,255,255,0.1)' }]}
                    onPress={() => setUnit('per_hour')}
                >
                    <Text style={styles.unitButtonText}>/Hour</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.unitButton, { backgroundColor: unit === 'flat_fee' ? BRAND_ACCENT_BUTTON : 'rgba(255,255,255,0.1)' }]}
                    onPress={() => setUnit('flat_fee')}
                >
                    <Text style={styles.unitButtonText}>Flat</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={addService} style={styles.addButton}>
                    <Ionicons name="add" size={24} color={BRAND_TEXT_LIGHT} />
                </TouchableOpacity>
            </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 15 },
  serviceCardWrapper: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 2, // neon edge effect
  },
  serviceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: BRAND_BACKGROUND_DARK,
    borderRadius: 10,
    padding: 15,
  },
  serviceName: { color: BRAND_TEXT_LIGHT, fontSize: 16, fontWeight: "600" },
  servicePrice: { color: BRAND_TEXT_GREY, fontSize: 14, marginTop: 4 },
  emptyText: { color: BRAND_TEXT_GREY, fontStyle: "italic", textAlign: "center", padding: 15 },

  // Editing Styles
  editSection: { 
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 15,
  },
  editTitle: {
    color: BRAND_TEXT_LIGHT,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: BRAND_TEXT_LIGHT,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    minHeight: 45,
    justifyContent: 'center', // For TouchableOpacity mock
    marginRight: 10,
    flex: 1,
  },
  unitButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 5,
  },
  unitButtonText: {
    color: BRAND_TEXT_LIGHT,
    fontSize: 12,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: BRAND_ACCENT_BUTTON,
    padding: 8,
    borderRadius: 8,
    marginLeft: 10,
  }
});

export default ServicesSection;