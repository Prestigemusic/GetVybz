// FILE: src/screens/MessagingScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ChatMessage {
  id: string;
  text: string;
  sender: "me" | "other";
  senderName?: string;
}

export default function MessagingScreen() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", text: "Welcome to GetVybz!", sender: "other", senderName: "DJ Prestige" },
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: message,
        sender: "me",
        senderName: "Me",
      };
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    }
  };

  // Generate initials (e.g. "DJ Prestige" → "DP")
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        {/* Chat list */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageRow,
                item.sender === "me" ? styles.myRow : styles.otherRow,
              ]}
            >
              {item.sender === "other" && (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitials(item.senderName)}</Text>
                </View>
              )}
              <View
                style={[
                  styles.messageBubble,
                  item.sender === "me" ? styles.myBubble : styles.otherBubble,
                ]}
              >
                <Text style={styles.messageText}>{item.text}</Text>
              </View>
            </View>
          )}
          contentContainerStyle={{ padding: 12 }}
        />

        {/* Input + send button */}
        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor="#aaa"
            style={styles.input}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F0A22" },

  // Message row
  messageRow: { flexDirection: "row", marginVertical: 6, alignItems: "flex-end" },
  myRow: { justifyContent: "flex-end" },
  otherRow: { justifyContent: "flex-start" },

  // Avatars
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#6A0DFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarText: { color: "#fff", fontWeight: "bold" },

  // Bubbles
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: "70%",
  },
  myBubble: {
    backgroundColor: "#6A0DFF",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: "#1F0A3C",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  messageText: { color: "#fff", fontSize: 15 },

  // Input area
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#1F0A3C",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  input: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "#2D165A",
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#6A0DFF",
    padding: 12,
    borderRadius: 25,
  },
});
