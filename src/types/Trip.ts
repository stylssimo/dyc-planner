export interface Trip {
    id: string;         // Optional Firestore document ID
    name: string;
    country: string;
    city: string;
    startDate: string;
    endDate: string;
    description: string;
    imageUrl: string;
    price: number;
    isActive: boolean;
    createdAt?: number; // ⬅️ This tells TypeScript that `createdAt` is allowed
}