import React from 'react';
import { View, Text, Button } from 'react-native';
import BookingForm from '../components/BookingForm';

const BookingScreen = ({ route, navigation }) => {
    const { creative } = route.params;

    const handleBookingConfirmation = () => {
        // Logic for confirming the booking goes here
        // This could include API calls and navigation to a confirmation screen
        console.log('Booking confirmed for:', creative.name);
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{creative.name}</Text>
            <Text style={{ fontSize: 18, marginVertical: 10 }}>{creative.description}</Text>
            <BookingForm />
            <Button title="Confirm Booking" onPress={handleBookingConfirmation} />
        </View>
    );
};

export default BookingScreen;
import React, { useState } from 'react';    
