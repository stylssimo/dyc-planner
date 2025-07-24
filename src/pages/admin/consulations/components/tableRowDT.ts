// src/mockData.ts
export interface TableRow {
    id: string;
    userEmail: string;
    avatar: string;
    status: 'Active' | 'Consulted' | 'Cancelled';
    phoneNumber: string;
    tripName: string;
    tripId: string;
    consultationDate: string;
    consultationTime: string;
}