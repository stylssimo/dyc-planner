// src/mockData.ts
export interface TableRow {
    id: string;
    user: string;
    avatar: string;
    status: 'Active' | 'Consulted' | 'Cancelled';
    phoneNumber: string;
    trip: string;
    tripId: string;
    consultDate: string;
}
  
  export const mockTableData: TableRow[] = [
    {
      id: "1",
      user: "Sarah Chen",
      avatar: "https://i.pravatar.cc/40?img=1",
      status: "Active",
      phoneNumber: "+976 11112222",
      trip: "Vietnam",
      tripId: "Vietnam_6N5D",
      consultDate: "2025, June 20"
    },
    {
      id: "2",
      user: "Marcus Thompson",
      avatar: "https://i.pravatar.cc/40?img=2",
      status: "Consulted",
      phoneNumber: "+976 3242 9424",
      trip: "Fukuoka",
      tripId: "Fukuoka_8N4D",
      consultDate: "2025, June 10"
    },
    {
      id: "3",
      user: "Elena Rodriguez",
      avatar: "https://i.pravatar.cc/40?img=3",
      status: "Cancelled",
      phoneNumber: "+976 88888888",
      trip: "Beijing",
      tripId: "Beijing_8N7D",
      consultDate: "2025, June 8"
    },
    {
      id: "4",
      user: "David Kumar",
      avatar: "https://i.pravatar.cc/40?img=4",
      status: "Active",
      phoneNumber: "+976 99999999",
      trip: "Uvs",
      tripId: "Uvs_3N2D",
      consultDate: "2025, June 15"
    },
    {
      id: "5",
      user: "Lisa Wang",
      avatar: "https://i.pravatar.cc/40?img=5",
      status: "Active",
      phoneNumber: "+976 77777777",
      trip: "Dalanzadgad",
      tripId: "Dalanzadgad_8N4D",
      consultDate: "2025, June 25"
    },
    {
      id: "6",
      user: "Ahmed Hassan",
      avatar: "https://i.pravatar.cc/40?img=6",
      status: "Consulted",
      phoneNumber: "+976 66666666",
      trip: "Shanghai",
      tripId: "Shanghai_1W",
      consultDate: "2025, June 5"
    },
    {
      id: "7",
      user: "Jennifer Smith",
      avatar: "https://i.pravatar.cc/40?img=7",
      status: "Active",
      phoneNumber: "+976 55555555",
      trip: "Tokyo",
      tripId: "Tokyo_5N4D",
      consultDate: "2025, July 1"
    },
    {
      id: "8",
      user: "Michael O'Connor",
      avatar: "https://i.pravatar.cc/40?img=8",
      status: "Cancelled",
      phoneNumber: "+976 44444444",
      trip: "Seoul",
      tripId: "Seoul_4N3D",
      consultDate: "2025, June 12"
    }
  ];
  