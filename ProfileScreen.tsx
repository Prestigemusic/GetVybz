import React, { useEffect, useState } from "react";
import { View, Text, Button, Image } from "react-native";

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:5000/profile/demo1-id") // Replace with real userId after login
      .then(res => res.json())
      .then(data => setProfile(data));
  }, []);

  if (!profile) return <Text>Loading...</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Image source={{ uri: profile.avatarUrl }} style={{ width: 100, height: 100, borderRadius: 50 }} />
      <Text style={{ fontSize: 20 }}>{profile.fullName}</Text>
      <Text>{profile.bio}</Text>
      <Button title="Edit Profile" onPress={() => navigation.navigate("EditProfile", { profile })} />
    </View>
  );
}
