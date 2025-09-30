// src/screens/Profile/ProfileScreen.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    SafeAreaView,
    StatusBar,
    Dimensions,
    TouchableOpacity,
    Image,
    Alert,
    TextInput,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; 
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../context/AuthContext"; // ✅ Correctly imported

// --- Brand Colors (Defined outside the component) ---
const BRAND_BACKGROUND_DARK = '#0D0B1F'; 
const BRAND_PURPLE_GRADIENT_START = '#2A0B40'; 
const BRAND_TEXT_LIGHT = '#E0D5FF'; 
const BRAND_ACCENT_BUTTON = '#7B1FF0'; 
const BRAND_TEXT_GREY = '#AAAAAA'; 
const BRAND_FOLLOW_TEXT = '#D0BFFF'; 
const BRAND_INPUT_BACKGROUND = 'rgba(255,255,255,0.1)'; 
const BRAND_NEON_GLOW = 'rgba(123, 31, 240, 0.7)'; 

const { height } = Dimensions.get('window');

// --- Component Imports ---
import HeaderBanner from "./components/HeaderBanner"; 
import ServicesSection from "./components/ServicesSection";
import PortfolioSection from "./components/PortfolioSection";
import ReviewsSection from "./components/ReviewsSection";
import SectionWrapper from "./components/SectionWrapper";
import AboutSection from "./components/AboutSection"; 
import RateCardSection from "./components/RateCardSection";
import CalendarSection from "./components/CalendarSection";

// Helper function remains the same
const getMockBookingDates = () => {
    const dates: { [key: string]: 'available' | 'booked' | 'editing' } = {};
    const today = new Date();
    const MAX_YEAR = 2030;
    
    for (let y = today.getFullYear(); y <= MAX_YEAR; y++) {
        const startMonth = y === today.getFullYear() ? today.getMonth() : 0;
        const endMonth = y === MAX_YEAR ? 11 : 11;
        
        for (let m = startMonth; m <= endMonth; m++) {
            const daysInMonth = new Date(y, m + 1, 0).getDate();
            
            for (let d = 1; d <= daysInMonth; d++) {
                const date = new Date(y, m, d);
                if (date < today && date.getDate() !== today.getDate()) continue; 
                
                const dateString = date.toISOString().split('T')[0];
                
                if (d % 5 === 0 && d !== today.getDate()) {
                    dates[dateString] = 'booked';
                } else {
                    dates[dateString] = 'available';
                }
            }
        }
    }
    return dates;
};

// --- Single, Corrected ProfileScreen Component ---
const ProfileScreen = () => {
    // This is the correct placement for useAuth()
    const { user, setUser, logout } = useAuth(); 
    const [isEditing, setIsEditing] = useState(false); 
    
    // NOTE: Initialize state using user data with fallbacks to mock data
    const [profileData, setProfileData] = useState({
        // Use context data if available, otherwise use mock data
        bannerUri: user?.bannerUri || "https://placehold.co/600x200/400B63/E0D5FF?text=MUSICIAN+PROFILE",
        avatarUri: user?.avatarUri || "https://placehold.co/120x120/7B1FF0/FFFFFF?text=JD",
        name: user?.name || "Jane Doe",
        handle: user?.handle || "@janedoeofficial", 
        about: user?.about || "Internationally renowned producer and DJ specializing in EDM and Afrobeats. Known for high-energy sets and working with top-tier talent. Based in Lagos, available worldwide.",
        followers: user?.followers || "10.2K",
        following: user?.following || "500",
        rating: user?.rating || "4.8",
        
        // Mock Lists/Objects
        rateCard: user?.rateCard || [ 
            { id: "rc1", type: "Festivals/Concerts", rate: 500000, unit: "set" },
            { id: "rc2", type: "Corporate Events", rate: 300000, unit: "hour" },
            { id: "rc3", type: "Recording/Production", rate: 150000, unit: "day" },
        ],
        bookingDates: user?.bookingDates || getMockBookingDates(), 
        
        services: user?.services || [
            { id: "1", name: "Standard DJ Set (4 Hours)", price: 250000, unit: "flat_fee" },
            { id: "2", name: "Premium Live Performance + MC", price: 75000, unit: "per_hour" },
        ],
        portfolio: user?.portfolio || [
            { id: "1", type: "image", uri: "https://placehold.co/300x200/4a1a7a/FFFFFF?text=Event+1" },
            { id: "2", type: "video", uri: "https://placehold.co/300x200/5a2a8a/FFFFFF?text=Festival" },
        ],
        reviews: user?.reviews || [
            { id: "1", user: "Alice", comment: "Amazing vibes!", rating: 5, date: '2025-05-01' },
            { id: "2", user: "Bob", comment: "Kept the party alive!", rating: 4, date: '2025-04-15' },
        ],
    });

    const updateProfileField = (key: string, value: any) => {
        setProfileData(prev => ({ ...prev, [key]: value }));
    };

    // Updated to use the async setUser from context
    const handleSaveProfile = async () => {
        try {
            console.log("Saving all profile data to API:", profileData);
            await setUser(profileData); // Update global context + persistence
            Alert.alert("Profile Saved", "All changes have been successfully saved!", [{ text: "OK" }]);
            setIsEditing(false); 
        } catch (err) {
            console.error("❌ Save profile failed:", err);
            Alert.alert("Save Error", "Failed to save profile.", [{ text: "OK" }]);
        }
    };

    const toggleEditMode = () => {
        if (isEditing) {
            handleSaveProfile(); 
        } else {
            setIsEditing(true); 
        }
    };
    
    const handleLogout = () => {
        Alert.alert(
            "Log Out", 
            "Are you sure you want to log out?", 
            [
                { text: "Cancel", style: "cancel" },
                { text: "Log Out", onPress: () => logout() } // Assuming useAuth provides a logout function
            ]
        );
    };

    const handleAvatarChange = async () => {
        if (!isEditing) return;
        
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission Required", "Please allow access to your media library to change the avatar.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const newUri = result.assets[0].uri;
            updateProfileField('avatarUri', newUri);
            Alert.alert("Avatar Changed", "Press 'Save All' to finalize the change.");
        }
    };

    const renderHeader = () => (
        <View style={styles.headerContentContainer}>
            {/* 1. Header Banner - Includes Logout Button */}
            <HeaderBanner
                isEditing={isEditing}
                bannerUrl={profileData.bannerUri}
                onBannerChange={(url) => updateProfileField('bannerUri', url)}
                onLogout={handleLogout}
            />

            {/* 2. Profile Info Block (Avatar, Name, Handle, Edit Button) */}
            <View style={styles.profileInfoBlock}>
                <TouchableOpacity 
                    style={styles.avatarWrapper}
                    onPress={isEditing ? handleAvatarChange : undefined}
                    disabled={!isEditing}
                >
                    <Image source={{ uri: profileData.avatarUri }} style={styles.profileAvatar} />
                    {isEditing && (
                        <View style={styles.avatarEditOverlay}>
                            <Ionicons name="camera" size={24} color={BRAND_TEXT_LIGHT} />
                        </View>
                    )}
                </TouchableOpacity>

                <View style={styles.nameHandleContainer}>
                    {/* ✅ KEYBOARD FIX: Removed blurOnSubmit={true} */}
                    <TextInput
                        key="nameInput" 
                        style={[styles.profileName, isEditing && styles.nameInput]}
                        value={profileData.name}
                        onChangeText={(text) => updateProfileField('name', text)}
                        placeholder="Full Name"
                        placeholderTextColor={BRAND_TEXT_GREY}
                        editable={isEditing}
                        autoCorrect={false}
                        spellCheck={false}
                    />
                    
                    {/* ✅ KEYBOARD FIX: Removed blurOnSubmit={true} */}
                    <TextInput
                        key="handleInput" 
                        style={[styles.profileHandle, isEditing && styles.handleInput]}
                        value={profileData.handle}
                        onChangeText={(text) => updateProfileField('handle', text)}
                        placeholder="@handle"
                        placeholderTextColor={BRAND_TEXT_GREY}
                        autoCapitalize="none"
                        editable={isEditing}
                        autoCorrect={false}
                        spellCheck={false}
                    />
                </View>
                
                <TouchableOpacity style={styles.editProfileButton} onPress={toggleEditMode}>
                    <Text style={styles.editProfileButtonText}>
                        {isEditing ? 'Save All' : 'Edit Profile'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* 3. Metrics Section */}
            <View style={styles.metricsContainer}>
                 {/* Metrics content assumed to be here */}
            </View>
            
            {/* 4. About Section */}
            <SectionWrapper title="About Me">
                <AboutSection 
                    isEditing={isEditing} 
                    about={profileData.about} 
                    setAbout={(text) => updateProfileField('about', text)}
                />
            </SectionWrapper>

            {/* 5. Rate Card Section */}
            <RateCardSection 
                isEditing={isEditing} 
                rateCard={profileData.rateCard} 
                setRateCard={(card) => updateProfileField('rateCard', card)}
            />

            {/* 6. Calendar/Availability Section */}
            <CalendarSection
                isEditing={isEditing}
                bookingDates={profileData.bookingDates}
                setBookingDates={(dates) => updateProfileField('bookingDates', dates)}
            />

            {/* 7. Services Rendered Section */}
            <ServicesSection
                isOwner={true}
                isEditing={isEditing}
                services={profileData.services}
                setServices={(services) => updateProfileField('services', services)}
            />
            
            {/* 8. Portfolio Section */}
            <PortfolioSection
                isEditing={isEditing}
                portfolio={profileData.portfolio}
                onSave={(portfolio) => updateProfileField('portfolio', portfolio)}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={BRAND_BACKGROUND_DARK} />
            <LinearGradient
                colors={[BRAND_PURPLE_GRADIENT_START, BRAND_BACKGROUND_DARK, BRAND_BACKGROUND_DARK]} 
                style={styles.gradientBackground}
            >
                <FlatList
                    data={[]} 
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={() => null} 
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={styles.flatListContent}
                    ListFooterComponent={<ReviewsSection reviews={profileData.reviews} />} 
                    
                    // ✅ KEYBOARD FIX: This is the critical prop to stop the 1-character limit
                    keyboardShouldPersistTaps="always" 
                    // ✅ Recommended for dismissing keyboard on scroll
                    keyboardDismissMode="on-drag" 
                />
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BRAND_BACKGROUND_DARK },
    gradientBackground: { flex: 1, },
    flatListContent: { paddingBottom: 40 },
    headerContentContainer: {},
    profileInfoBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -30, 
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    avatarWrapper: {
        position: 'relative',
        width: 100,
        height: 100,
        marginRight: 15,
        borderRadius: 50,
        shadowColor: BRAND_NEON_GLOW,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1, 
        shadowRadius: 12, 
        elevation: 8,
    },
    profileAvatar: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
        borderWidth: 3,
        borderColor: BRAND_ACCENT_BUTTON,
    },
    avatarEditOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameHandleContainer: { flex: 1, justifyContent: 'center' },
    profileName: { fontSize: 22, fontWeight: 'bold', color: BRAND_TEXT_LIGHT },
    profileHandle: { fontSize: 14, color: BRAND_TEXT_GREY },
    
    // Conditional Styles for Editing
    nameInput: {
        backgroundColor: BRAND_INPUT_BACKGROUND,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 4,
        color: BRAND_TEXT_LIGHT,
        marginBottom: 5,
        fontSize: 20, 
        fontWeight: 'bold',
    },
    handleInput: {
        backgroundColor: BRAND_INPUT_BACKGROUND,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 2,
        color: BRAND_TEXT_GREY,
        fontSize: 13,
    },

    editProfileButton: {
        backgroundColor: BRAND_ACCENT_BUTTON,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginLeft: 10,
        shadowColor: BRAND_ACCENT_BUTTON,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
    editProfileButtonText: { color: BRAND_TEXT_LIGHT, fontWeight: '700', fontSize: 14 },
    metricsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        marginBottom: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)', 
        backgroundColor: 'rgba(255,255,255,0.03)', 
    },
    metricItem: { alignItems: 'center' },
    metricValue: { fontSize: 20, fontWeight: 'bold', color: BRAND_FOLLOW_TEXT },
    metricLabel: { fontSize: 13, color: BRAND_TEXT_GREY, marginTop: 4 },
});

export default ProfileScreen;