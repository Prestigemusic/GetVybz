import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";

export default function EditProfileScreen({ route, navigation }) {
  const { profile } = route.params;
  const [fullName, setFullName] = useState(profile.fullName);
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);

  const saveProfile = async () => {
    await fetch(`http://localhost:5000/profile/${profile.userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, bio, avatarUrl }),
    });
    navigation.goBack();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput value={fullName} onChangeText={setFullName} placeholder="Full Name" />
      <TextInput value={bio} onChangeText={setBio} placeholder="Bio" />
      <TextInput value={avatarUrl} onChangeText={setAvatarUrl} placeholder="Avatar URL" />
      <Button title="Save" onPress={saveProfile} />
    </View>
  );
}
