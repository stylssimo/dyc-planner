// src/mockData.ts
export interface TableRow {
    id: string;
    userEmail: string;
    avatar: string;
    status: 'Active' | 'Consulted' | 'Cancelled';
    userPhoneNumber: string;
    tripName: string;
    tripId: string;
    consultationDate: string;
    consultationTime: string;
}