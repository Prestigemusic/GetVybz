import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ProfileScreen = () => {
    const handleEditProfile = () => {
        // Logic to edit profile
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Profile</Text>
            <Text style={styles.label}>Name: John Doe</Text>
            <Text style={styles.label}>Email: johndoe@example.com</Text>
            <Text style={styles.label}>Bookings: 5</Text>
            <Text style={styles.label}>Favorites: 3</Text>
            <Button title="Edit Profile" onPress={handleEditProfile} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginVertical: 5,
    },
});

export default ProfileScreen;