import React from "react";
import { View, Text, Button } from "react-native";

export default function BookingDetailScreen({ route, navigation }) {
  const { booking } = route.params;

  const confirm = async () => {
    await fetch(`http://localhost:5000/bookings/${booking.id}/confirm`, {
      method: "PUT",
    });
    navigation.goBack();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Status: {booking.status}</Text>
      <Text>Details: {booking.details}</Text>
      <Text>Date: {new Date(booking.date).toDateString()}</Text>
      {booking.status !== "confirmed" && (
        <Button title="Confirm Booking" onPress={confirm} />
      )}
    </View>
  );
}
