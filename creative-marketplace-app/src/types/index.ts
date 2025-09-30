export interface Booking {
    id: string;
    creativeId: string;
    userId: string;
    date: string;
    time: string;
    specialRequests?: string;
}

export interface Creative {
    id: string;
    name: string;
    category: string;
    description: string;
    rating: number;
    imageUrl: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    profilePictureUrl?: string;
    bookings: Booking[];
    favorites: string[];
}