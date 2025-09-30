// src/screens/Messaging/ConversationsScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { apiGet } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export default function ConversationsScreen() {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<any[]>([]);
  const { user } = useAuth() as any;
  const navigation = useNavigation<any>();

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGet("/messages/my-conversations");
        setConversations(res.conversations || []);
      } catch (err) {
        console.error("Failed to fetch conversations", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderItem = ({ item }: any) => {
    // Identify "other user"
    const otherUser = item.sender?._id === user?.id ? item.recipient : item.sender;
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() =>
          navigation.navigate("Messaging", {
            conversationId: item.conversationId,
            recipient: { id: otherUser._id, name: otherUser.name, photo: otherUser.profilePicture },
          })
        }
      >
        <Image source={{ uri: otherUser?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png" }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{otherUser?.name || "Unknown"}</Text>
          <Text style={styles.snippet} numberOfLines={1}>
            {item.text || "📷 Media"}
          </Text>
        </View>
        <Text style={styles.time}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#6A0DFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList data={conversations} renderItem={renderItem} keyExtractor={(item) => item._id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A0033" },
  row: { flexDirection: "row", padding: 12, borderBottomWidth: 1, borderBottomColor: "#2a0d5e", alignItems: "center" },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  name: { color: "#fff", fontWeight: "700", fontSize: 16 },
  snippet: { color: "#ccc", marginTop: 2, fontSize: 13 },
  time: { color: "#aaa", fontSize: 11 },
});
