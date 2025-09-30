// src/screens/Dashboard/components/EventsSection.tsx
import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";

type EventItem = { id: string; title: string; date: string; location?: string; imageUri?: string };

const { width } = Dimensions.get("window");
const ITEM_W = Math.round(width * 0.6);
const ITEM_H = 140;

const EventsSection: React.FC<{
  data: EventItem[] | undefined;
  onPressEvent?: (id: string) => void;
  onSeeAll?: () => void;
}> = ({ data = [], onPressEvent, onSeeAll }) => {
  return (
    <View style={{ marginTop: 8 }}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Upcoming Events</Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        horizontal
        keyExtractor={(i) => i.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity key={item.id} onPress={() => onPressEvent?.(item.id)} style={[styles.card, { width: ITEM_W, height: ITEM_H, marginRight: 12 }]}>
            {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.image} />}
            <View style={styles.cardOverlay}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventMeta}>{item.date} • {item.location ?? "Various"}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: { paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  title: { color: "#fff", fontSize: 18, fontWeight: "700" },
  seeAll: { color: "#D0BFFF" },

  card: { borderRadius: 12, overflow: "hidden", backgroundColor: "#0f0220" },
  image: { ...StyleSheet.absoluteFillObject },
  cardOverlay: { padding: 12, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end", flex: 1, justifyContent: "flex-end" },
  eventTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  eventMeta: { color: "#E0D5FF", marginTop: 6, fontSize: 12 },
});

export default React.memo(EventsSection);
