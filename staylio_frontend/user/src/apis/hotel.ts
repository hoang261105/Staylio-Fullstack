export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  stars: number;
  amenities: string[];
  description: string;
  featured?: boolean;
  gallery: string[];
  rooms: Room[];
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  price: number;
  image: string;
  amenities: string[];
}

export const hotels: Hotel[] = [
  {
    id: "1",
    name: "Paradise Island Resort",
    location: "Maldives",
    rating: 4.9,
    reviews: 1247,
    price: 450,
    stars: 5,
    image: "https://images.unsplash.com/photo-1568727174680-7ae330b15345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    featured: true,
    amenities: ["Wifi miễn phí", "Hồ bơi", "Spa", "Nhà hàng", "Gym", "Bãi biển riêng"],
    description: "Khu nghỉ dưỡng sang trọng giữa thiên đường nhiệt đới với dịch vụ 5 sao và tầm nhìn ra biển tuyệt đẹp.",
    gallery: [
      "https://images.unsplash.com/photo-1568727174680-7ae330b15345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1772127822607-2343696cf82e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1561501900-3701fa6a0864?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1766393195967-bb27203ba333?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    rooms: [
      {
        id: "r1",
        name: "Ocean View Villa",
        capacity: 2,
        price: 450,
        image: "https://images.unsplash.com/photo-1561501900-3701fa6a0864?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["Tầm nhìn ra biển", "Ban công riêng", "Jacuzzi", "Minibar"],
      },
      {
        id: "r2",
        name: "Deluxe Suite",
        capacity: 4,
        price: 650,
        image: "https://images.unsplash.com/photo-1772127822607-2343696cf82e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["2 phòng ngủ", "Hồ bơi riêng", "Bếp", "Phòng khách"],
      },
    ],
  },
  {
    id: "2",
    name: "Coastal Luxury Resort",
    location: "Bali, Indonesia",
    rating: 4.8,
    reviews: 892,
    price: 320,
    stars: 5,
    image: "https://images.unsplash.com/photo-1762742316793-b1845065429a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    featured: true,
    amenities: ["Wifi miễn phí", "Hồ bơi", "Nhà hàng", "Spa", "Dịch vụ đưa đón"],
    description: "Resort nghỉ dưỡng cao cấp nằm ven biển Bali với kiến trúc hiện đại và dịch vụ chuyên nghiệp.",
    gallery: [
      "https://images.unsplash.com/photo-1762742316793-b1845065429a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1772127822546-95b7a70951de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1769741034817-27405b5ab4c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    rooms: [
      {
        id: "r3",
        name: "Garden View Room",
        capacity: 2,
        price: 320,
        image: "https://images.unsplash.com/photo-1772127822546-95b7a70951de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["Tầm nhìn vườn", "Ban công", "Minibar", "Két sắt"],
      },
    ],
  },
  {
    id: "3",
    name: "Tropical Paradise Hotel",
    location: "Phuket, Thailand",
    rating: 4.7,
    reviews: 1523,
    price: 280,
    stars: 4,
    image: "https://images.unsplash.com/photo-1772127822607-2343696cf82e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    amenities: ["Wifi miễn phí", "Hồ bơi", "Gym", "Ăn sáng miễn phí"],
    description: "Khách sạn 4 sao với hồ bơi ngoài trời và tiện nghi hiện đại, gần các điểm tham quan.",
    gallery: [
      "https://images.unsplash.com/photo-1772127822607-2343696cf82e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1774663855124-9ede7464f37e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    rooms: [
      {
        id: "r4",
        name: "Standard Room",
        capacity: 2,
        price: 280,
        image: "https://images.unsplash.com/photo-1772127822607-2343696cf82e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["Wifi", "TV", "Điều hòa", "Minibar"],
      },
    ],
  },
  {
    id: "4",
    name: "Ocean Breeze Resort",
    location: "Đà Nẵng, Vietnam",
    rating: 4.6,
    reviews: 678,
    price: 180,
    stars: 4,
    image: "https://images.unsplash.com/photo-1774552803614-36ff3851eea0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    amenities: ["Wifi miễn phí", "Hồ bơi", "Bãi biển", "Nhà hàng"],
    description: "Resort ven biển với tầm nhìn tuyệt đẹp ra vịnh Đà Nẵng và dịch vụ thân thiện.",
    gallery: [
      "https://images.unsplash.com/photo-1774552803614-36ff3851eea0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    rooms: [
      {
        id: "r5",
        name: "Sea View Room",
        capacity: 2,
        price: 180,
        image: "https://images.unsplash.com/photo-1774552803614-36ff3851eea0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["Tầm nhìn ra biển", "Ban công", "Wifi", "TV"],
      },
    ],
  },
  {
    id: "5",
    name: "Cliff View Hotel",
    location: "Santorini, Greece",
    rating: 4.9,
    reviews: 2134,
    price: 520,
    stars: 5,
    image: "https://images.unsplash.com/photo-1766393195967-bb27203ba333?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    featured: true,
    amenities: ["Wifi miễn phí", "Hồ bơi vô cực", "Spa", "Nhà hàng cao cấp", "Bãi đỗ xe"],
    description: "Khách sạn boutique sang trọng nằm trên vách đá với tầm nhìn panorama ra biển Aegean.",
    gallery: [
      "https://images.unsplash.com/photo-1766393195967-bb27203ba333?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1761926545961-252275b47a2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    rooms: [
      {
        id: "r6",
        name: "Sunset Suite",
        capacity: 2,
        price: 520,
        image: "https://images.unsplash.com/photo-1766393195967-bb27203ba333?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["Tầm nhìn hoàng hôn", "Hot tub riêng", "Ban công lớn", "Phòng khách"],
      },
    ],
  },
  {
    id: "6",
    name: "Modern City Resort",
    location: "Dubai, UAE",
    rating: 4.5,
    reviews: 956,
    price: 380,
    stars: 5,
    image: "https://images.unsplash.com/photo-1769741034817-27405b5ab4c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    amenities: ["Wifi miễn phí", "Hồ bơi", "Gym", "Spa", "Nhà hàng", "Dịch vụ phòng 24/7"],
    description: "Resort hiện đại giữa lòng Dubai với tiện nghi cao cấp và dịch vụ đẳng cấp quốc tế.",
    gallery: [
      "https://images.unsplash.com/photo-1769741034817-27405b5ab4c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    rooms: [
      {
        id: "r7",
        name: "Executive Room",
        capacity: 2,
        price: 380,
        image: "https://images.unsplash.com/photo-1769741034817-27405b5ab4c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["Tầm nhìn thành phố", "Minibar", "Két sắt", "Máy pha cà phê"],
      },
    ],
  },
  {
    id: "7",
    name: "Beachfront Getaway",
    location: "Cancun, Mexico",
    rating: 4.7,
    reviews: 1089,
    price: 295,
    stars: 4,
    image: "https://images.unsplash.com/photo-1748741426070-f11ac876e7dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    amenities: ["Wifi miễn phí", "Bãi biển riêng", "Hồ bơi", "Bar", "Nhà hàng"],
    description: "Resort bãi biển với không gian rộng rãi và các hoạt động giải trí phong phú.",
    gallery: [
      "https://images.unsplash.com/photo-1748741426070-f11ac876e7dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    rooms: [
      {
        id: "r8",
        name: "Beach Room",
        capacity: 2,
        price: 295,
        image: "https://images.unsplash.com/photo-1748741426070-f11ac876e7dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["Tầm nhìn bãi biển", "Ban công", "Wifi", "Minibar"],
      },
    ],
  },
  {
    id: "8",
    name: "Lagoon Paradise",
    location: "Bora Bora, French Polynesia",
    rating: 5.0,
    reviews: 432,
    price: 890,
    stars: 5,
    image: "https://images.unsplash.com/photo-1724947052687-e580b3010aad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    amenities: ["Wifi miễn phí", "Hồ bơi vô cực", "Spa cao cấp", "Nhà hàng", "Bar", "Thể thao nước"],
    description: "Resort siêu sang trọng với bungalow nổi trên mặt nước và dịch vụ hoàn hảo.",
    gallery: [
      "https://images.unsplash.com/photo-1724947052687-e580b3010aad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1724947053227-2335bf21d0ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    rooms: [
      {
        id: "r9",
        name: "Overwater Bungalow",
        capacity: 2,
        price: 890,
        image: "https://images.unsplash.com/photo-1724947052687-e580b3010aad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        amenities: ["Sàn kính nhìn xuống biển", "Bể bơi riêng", "Phòng khách", "Bar mini"],
      },
    ],
  },
];

export const popularDestinations = [
  {
    name: "Maldives",
    image: "https://images.unsplash.com/photo-1568727174680-7ae330b15345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    hotels: 127,
  },
  {
    name: "Bali",
    image: "https://images.unsplash.com/photo-1762742316793-b1845065429a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    hotels: 234,
  },
  {
    name: "Santorini",
    image: "https://images.unsplash.com/photo-1766393195967-bb27203ba333?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    hotels: 156,
  },
  {
    name: "Dubai",
    image: "https://images.unsplash.com/photo-1769741034817-27405b5ab4c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    hotels: 189,
  },
];

export const popularBrands = [
  {
    name: "Marriott",
    image: "https://images.unsplash.com/photo-1562790351-d273a961e0e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    hotels: 120,
  },
  {
    name: "Hilton",
    image: "https://images.unsplash.com/photo-1542314831-c6a4d142104d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    hotels: 85,
  },
  {
    name: "InterContinental",
    image: "https://images.unsplash.com/photo-1551882547-ff40c0d129df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    hotels: 64,
  },
  {
    name: "Hyatt",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    hotels: 42,
  },
];
