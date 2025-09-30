import axios from 'axios';

const API_BASE_URL = 'https://your-api-url.com/api'; // Replace with your actual API URL

export const fetchCreatives = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/creatives`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching creatives: ' + error.message);
    }
};

export const submitBooking = async (bookingData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData);
        return response.data;
    } catch (error) {
        throw new Error('Error submitting booking: ' + error.message);
    }
};

export const fetchUserData = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching user data: ' + error.message);
    }
};