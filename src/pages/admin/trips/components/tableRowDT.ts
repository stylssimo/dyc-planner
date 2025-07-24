export interface TripTableRow {
  id: string;
  name: string;
  country: string;
  continent: string;
  duration: string;
  price: number;
  status: 'Active' | 'Draft' | 'Archived';
  imageUrl: string;
  videoUrl: string;
  description: string;
  createdAt: string;
  bookedCount: number;
  tripTags: string[];
}