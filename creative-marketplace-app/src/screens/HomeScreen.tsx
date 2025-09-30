import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Creative } from '../types';
import { fetchCreatives } from '../services/api';

const HomeScreen = ({ navigation }) => {
    const [creatives, setCreatives] = useState<Creative[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadCreatives = async () => {
            try {
                const data = await fetchCreatives();
                setCreatives(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadCreatives();
    }, []);

    const renderCreative = ({ item }) => (
        <TouchableOpacity
            style={styles.creativeItem}
            onPress={() => navigation.navigate('BookingScreen', { creativeId: item.id })}
        >
            <Text style={styles.creativeName}>{item.name}</Text>
            <Text style={styles.creativeDescription}>{item.description}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={creatives}
                renderItem={renderCreative}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    creativeItem: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    creativeName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    creativeDescription: {
        fontSize: 14,
        color: '#666',
    },
});

export default HomeScreen;

