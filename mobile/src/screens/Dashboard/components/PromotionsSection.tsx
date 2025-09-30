// src/screens/Dashboard/components/PromotionsSection.tsx
import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Promotion = {
  id: string;
  title: string;
  subtitle?: string;
  imageUri?: string;
};

const { width } = Dimensions.get("window");
const CARD_W = Math.round(width * 0.8);
const CARD_H = 150;

const PromotionsSection: React.FC<{
  data: Promotion[] | undefined;
  onPressItem?: (id: string) => void;
  onSeeAll?: () => void;
}> = ({ data = [], onPressItem, onSeeAll }) => {
  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Promotions</Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onPressItem?.(item.id)} activeOpacity={0.9} style={{ marginRight: 12 }}>
            <LinearGradient colors={["#7B1FF0", "#9D4EDD"]} style={[styles.card, { width: CARD_W, height: CARD_H }]}>
              {item.imageUri ? (
                <Image source={{ uri: item.imageUri }} style={styles.cardImage} resizeMode="cover" />
              ) : null}
              <View style={styles.cardOverlay}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                {item.subtitle ? <Text style={styles.cardSub}>{item.subtitle}</Text> : null}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginTop: 12, marginBottom: 8 },
  headerRow: { paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  title: { color: "#fff", fontSize: 18, fontWeight: "700" },
  seeAll: { color: "#D0BFFF" },

  card: {
    borderRadius: 14,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  cardImage: { ...StyleSheet.absoluteFillObject },
  cardOverlay: { padding: 14, backgroundColor: "rgba(0,0,0,0.22)" },
  cardTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  cardSub: { color: "#EDE7FF", marginTop: 6 },
});

export default React.memo(PromotionsSection);
