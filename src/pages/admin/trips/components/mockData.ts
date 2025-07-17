export interface TripTableRow {
  id: string;
  name: string;
  country: string;
  continent: string;
  duration: string;
  price: number;
  status: 'Active' | 'Draft' | 'Archived';
  imageUrl: string;
  description: string;
  createdAt: string;
  bookedCount: number;
}

export const mockTripData: TripTableRow[] = [
  {
    id: "1",
    name: "French Riviera Explorer",
    country: "France",
    continent: "Europe",
    duration: "6N5D",
    price: 2890,
    status: "Active",
    imageUrl: "https://i.pravatar.cc/400?img=1",
    description: "Experience the glamour of the French Riviera",
    createdAt: "2025, June 15",
    bookedCount: 24
  },
  {
    id: "2", 
    name: "Tokyo Discovery",
    country: "Japan",
    continent: "Asia",
    duration: "5N4D",
    price: 3200,
    status: "Active",
    imageUrl: "https://i.pravatar.cc/400?img=2", 
    description: "Modern culture meets ancient traditions",
    createdAt: "2025, June 10",
    bookedCount: 18
  },
  {
    id: "3",
    name: "Vietnam Heritage Tour", 
    country: "Vietnam",
    continent: "Asia",
    duration: "8N7D",
    price: 1850,
    status: "Active",
    imageUrl: "https://i.pravatar.cc/400?img=3",
    description: "Discover Vietnam's rich history and culture",
    createdAt: "2025, June 8",
    bookedCount: 31
  },
  {
    id: "4",
    name: "Mongolian Wilderness",
    country: "Mongolia", 
    continent: "Asia",
    duration: "7N6D",
    price: 2100,
    status: "Draft",
    imageUrl: "https://i.pravatar.cc/400?img=4",
    description: "Nomadic adventure in the vast steppes",
    createdAt: "2025, June 5",
    bookedCount: 0
  },
  {
    id: "5",
    name: "Italian Coastal Journey",
    country: "Italy",
    continent: "Europe", 
    duration: "9N8D",
    price: 3450,
    status: "Active",
    imageUrl: "https://i.pravatar.cc/400?img=5",
    description: "Amalfi Coast and Cinque Terre exploration",
    createdAt: "2025, May 28",
    bookedCount: 15
  },
  {
    id: "6",
    name: "Beijing Imperial Experience",
    country: "China",
    continent: "Asia",
    duration: "4N3D", 
    price: 1650,
    status: "Archived",
    imageUrl: "https://i.pravatar.cc/400?img=6",
    description: "Explore China's imperial history",
    createdAt: "2025, May 20",
    bookedCount: 42
  },
  {
    id: "7",
    name: "Swiss Alpine Adventure",
    country: "Switzerland",
    continent: "Europe",
    duration: "6N5D",
    price: 4200,
    status: "Active", 
    imageUrl: "https://i.pravatar.cc/400?img=7",
    description: "Mountain peaks and pristine lakes",
    createdAt: "2025, May 15",
    bookedCount: 9
  },
  {
    id: "8",
    name: "Korean Cultural Immersion",
    country: "South Korea",
    continent: "Asia",
    duration: "5N4D",
    price: 2650,
    status: "Draft",
    imageUrl: "https://i.pravatar.cc/400?img=8", 
    description: "K-culture and traditional heritage",
    createdAt: "2025, May 10",
    bookedCount: 0
  }
]; 