// src/screens/Dashboard/components/TopArtistesSection.tsx
import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";

type Artist = { id: string; name: string; rating?: number; avatarUri?: string };

const TopArtistesSection: React.FC<{ data: Artist[] | undefined; onPressArtist?: (id: string) => void; onSeeAll?: () => void; }> = ({ data = [], onPressArtist, onSeeAll }) => {
  return (
    <View style={{ marginTop: 8 }}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Top Rated Artistes</Text>
        <TouchableOpacity onPress={onSeeAll}><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
      </View>

      <FlatList
        data={data}
        horizontal
        keyExtractor={(i) => i.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity key={item.id} onPress={() => onPressArtist?.(item.id)} style={styles.artistCard}>
            <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.rating}>{item.rating ?? "—"} ★</Text>
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

  artistCard: { width: 110, marginRight: 12, alignItems: "center" },
  avatar: { width: 84, height: 84, borderRadius: 42, borderWidth: 2, borderColor: "#7B1FF0", marginBottom: 8 },
  name: { color: "#fff", fontSize: 13, fontWeight: "700", textAlign: "center" },
  rating: { color: "#E0D5FF", marginTop: 6 },
});

export default React.memo(TopArtistesSection);
