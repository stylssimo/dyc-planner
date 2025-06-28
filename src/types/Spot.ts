// src/types/Spot.ts

export interface Spot {
    id: string;         // Optional, added after retrieval from Firestore
    tripId: string;      // ID of the parent trip
    name: string;
    description: string;
    location?: string;   // Optional field if you want to add city/area
    imageUrl?: string;   // Optional field for future enhancements
    createdAt?: number; // ⬅️ This tells TypeScript that `createdAt` is allowed
}
