use staylio_db;

INSERT INTO hotels (manager_id, created_at, description, name, status, image_url) VALUES
    (1, NOW(), 'Khách sạn sang trọng tọa lạc ngay trung tâm quận 1 với view nhìn ra sông Sài Gòn tuyệt đẹp.', 'Saigon Grand Hotel', 1, 'https://images.unsplash.com/photo-1566073771259-6a8506099945'),
    (4, NOW(), 'Khu nghỉ dưỡng yên tĩnh bên bờ biển với các villa biệt lập và dịch vụ spa cao cấp.', 'Blue Ocean Resort', 1, 'https://images.unsplash.com/photo-1540541338287-41700207dee6'),
    (5, NOW(), 'Không gian ấm cúng, thiết kế hiện đại phù hợp cho khách đi công tác dài ngày.', 'City Comfort Inn', 1, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'),
    (6, NOW(), 'Trải nghiệm cuộc sống gần gũi với thiên nhiên tại các căn nhà gỗ trên cao.', 'Mountain Retreat Homestay', 1, 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2'),
    (7, NOW(), 'Khách sạn phong cách boutique với kiến trúc Đông Dương độc đáo và tinh tế.', 'Indochina Heritage Hotel', 0, 'https://images.unsplash.com/photo-1544124499-58912cbddade'),
    (8, NOW(), 'Vị trí đắc địa gần sân bay, phòng ốc sạch sẽ, tiện nghi đầy đủ cho khách quá cảnh.', 'Airport Transit Hotel', 1, 'https://images.unsplash.com/photo-1551882547-ff43c63efe81');