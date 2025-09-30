// src/screens/Messaging/ChatScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import io from "socket.io-client";
import { apiGet, apiPost } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const socket = io("https://getvybz-backend-9imn.onrender.com"); // your backend

export default function ChatScreen({ route }) {
  const { conversationId } = route.params;
  const { user } = useAuth() as any;
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const loadMessages = async () => {
      const res = await apiGet(`/messages/${conversationId}`);
      setMessages(res);
    };
    loadMessages();

    socket.emit("joinConversation", conversationId);
    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [conversationId]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const msg = await apiPost(`/messages/${conversationId}`, { text });
    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.sender === user.id ? styles.myBubble : styles.theirBubble]}>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputRow}>
        <TextInput style={styles.input} value={text} onChangeText={setText} placeholder="Type a message..." placeholderTextColor="#888" />
        <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
          <Text style={{ color: "#fff" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A0033" },
  bubble: { padding: 10, borderRadius: 10, margin: 5, maxWidth: "70%" },
  myBubble: { backgroundColor: "#6A0DFF", alignSelf: "flex-end" },
  theirBubble: { backgroundColor: "#333", alignSelf: "flex-start" },
  text: { color: "#fff" },
  inputRow: { flexDirection: "row", padding: 10, backgroundColor: "#2a0d5e" },
  input: { flex: 1, backgroundColor: "#1A0033", color: "#fff", padding: 10, borderRadius: 8 },
  sendBtn: { marginLeft: 10, backgroundColor: "#6A0DFF", paddingHorizontal: 20, borderRadius: 8, justifyContent: "center" },
});
