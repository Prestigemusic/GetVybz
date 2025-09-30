import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";

export default function BookingRequestScreen({ navigation }) {
  const [artistId, setArtistId] = useState("");
  const [date, setDate] = useState("");
  const [details, setDetails] = useState("");

  const createBooking = async () => {
    await fetch("http://localhost:5000/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "demo1-id", // replace with logged in user
        artistId,
        date,
        details,
      }),
    });
    navigation.goBack();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Artist ID" value={artistId} onChangeText={setArtistId} />
      <TextInput placeholder="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} />
      <TextInput placeholder="Details" value={details} onChangeText={setDetails} />
      <Button title="Submit Booking" onPress={createBooking} />
    </View>
  );
}
