import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";

export default function BookingListScreen({ navigation }) {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/bookings/demo1-id") // replace with real userId
      .then(res => res.json())
      .then(data => setBookings(data));
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>My Bookings</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10, padding: 10, borderWidth: 1 }}>
            <Text>Status: {item.status}</Text>
            <Text>Details: {item.details}</Text>
            <Button title="View" onPress={() => navigation.navigate("BookingDetail", { booking: item })} />
          </View>
        )}
      />
      <Button title="New Booking" onPress={() => navigation.navigate("BookingRequest")} />
    </View>
  );
}
