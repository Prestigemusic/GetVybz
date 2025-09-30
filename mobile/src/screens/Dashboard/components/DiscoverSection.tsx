// src/screens/Dashboard/components/DiscoverSection.tsx
import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";

type DiscoverItem = { id: string; name: string; niche?: string; avatarUri?: string };

const DiscoverSection: React.FC<{ data: DiscoverItem[] | undefined; onPressItem?: (id: string) => void; onSeeAll?: () => void; }> = ({ data = [], onPressItem, onSeeAll }) => {
  return (
    <View style={{ marginTop: 8 }}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Discover New Talent</Text>
        <TouchableOpacity onPress={onSeeAll}><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
      </View>

      <FlatList
        data={data}
        horizontal
        keyExtractor={(i) => i.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity key={item.id} onPress={() => onPressItem?.(item.id)} style={styles.card}>
            <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.niche}>{item.niche}</Text>
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

  card: { width: 120, marginRight: 12, alignItems: "center" },
  avatar: { width: 100, height: 100, borderRadius: 12, marginBottom: 8 },
  name: { color: "#fff", fontSize: 13, fontWeight: "700", textAlign: "center" },
  niche: { color: "#D0BFFF", fontSize: 12, marginTop: 4 },
});

export default React.memo(DiscoverSection);
