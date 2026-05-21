use staylio_db;

INSERT INTO hotels (name, description, image_url, manager_id, status, is_active, created_at) VALUES
    ('Hotel Sunrise', 'Nice view hotel', 'img1.jpg', 6, 'CONFIRMED', true, now()),
    ('Ocean Breeze', 'Near the beach', 'img2.jpg', 7, 'CONFIRMED', true, now()),
    ('City Lights Hotel', 'In the city center', 'img4.jpg', 9, 'CONFIRMED', true, now()),
    ('Mountain Retreat', 'Peaceful mountain stay', 'img3.jpg', 8, 'REJECTED', true, now()),
    ('Golden Palace', 'Luxury hotel', 'img5.jpg', 10, 'CONFIRMED', true, now());

INSERT INTO hotel_branchs (address, branch_name, image_url, status, hotel_id, ward_id, created_at, updated_at) VALUES
    ('123 Đường Lê Lợi, Quận 1', 'Chi nhánh Sài Gòn Center', 'https://images.unsplash.com/photo-1566073771259-6a8506099945', 'CONFIRMED', FLOOR(1 + (RAND() * 5)), FLOOR(1 + (RAND() * 5)), NOW(), NOW()),
    ('456 Võ Nguyên Giáp, Sơn Trà', 'Chi nhánh Biển Mỹ Khê', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', 'CONFIRMED', FLOOR(1 + (RAND() * 5)), FLOOR(1 + (RAND() * 5)), NOW(), NOW()),
    ('78 Trần Phú, Lộc Thọ', 'Chi nhánh Nha Trang Bay', 'https://images.unsplash.com/photo-1544124499-58912cbddade', 'PENDING', FLOOR(1 + (RAND() * 5)), FLOOR(1 + (RAND() * 5)), NOW(), NOW()),
    ('12 Hùng Vương, TP. Huế', 'Chi nhánh Cố Đô', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', 'CONFIRMED', FLOOR(1 + (RAND() * 5)), FLOOR(1 + (RAND() * 5)), NOW(), NOW()),
    ('09 Phan Chu Trinh, Đà Lạt', 'Chi nhánh Cao Nguyên', 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c', 'REJECTED', FLOOR(1 + (RAND() * 5)), FLOOR(1 + (RAND() * 5)), NOW(), NOW()),
    ('32 Đường Hạ Long, Bãi Cháy', 'Chi nhánh Vịnh Hạ Long', 'https://images.unsplash.com/photo-1551882547-ff43c63efe81', 'CONFIRMED', FLOOR(1 + (RAND() * 5)), FLOOR(1 + (RAND() * 5)), NOW(), NOW()),
    ('102 Quang Trung, TP. Vinh', 'Chi nhánh Nghệ An', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791', 'CONFIRMED', FLOOR(1 + (RAND() * 5)), FLOOR(1 + (RAND() * 5)), NOW(), NOW()),
    ('22 Hai Bà Trưng, Quận Hoàn Kiếm', 'Chi nhánh Hà Nội Phố', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d', 'PENDING', FLOOR(1 + (RAND() * 5)), FLOOR(1 + (RAND() * 5)), NOW(), NOW()),
    ('55 Nguyễn Văn Linh, Ninh Kiều', 'Chi nhánh Tây Đô', 'https://images.unsplash.com/photo-1590490359683-658d3d23f972', 'CONFIRMED', FLOOR(1 + (RAND() * 5)), FLOOR(1 + (RAND() * 5)), NOW(), NOW()),
    ('88 Đường 30/4, Dương Đông', 'Chi nhánh Đảo Ngọc', 'https://images.unsplash.com/photo-1512918766674-ed62b9795a3c', 'DELETED', FLOOR(1 + (RAND() * 5)), FLOOR(1 + (RAND() * 5)), NOW(), NOW());

INSERT INTO hotel_branchs
(branch_name, address, image_url, ward_id, hotel_id, capacity, status, created_at) VALUES

-- hotel_id = 9
('Staylio Hà Nội - Hồ Gươm', '45 Tràng Tiền, Hoàn Kiếm', 'https://picsum.photos/200/300?1', 5, 9, 100, 'PENDING', now()),
('Staylio Hà Nội - Phố Cổ', '12 Hàng Bạc, Hoàn Kiếm', 'https://picsum.photos/200/300?2', 12, 9, 120, 'CONFIRMED', now()),
('Staylio Hà Nội - Tây Hồ View', '88 Xuân Diệu, Tây Hồ', 'https://picsum.photos/200/300?3', 8, 9, 80, 'REJECTED', now()),
('Staylio Hà Nội - Cầu Giấy Center', '120 Cầu Giấy', 'https://picsum.photos/200/300?4', 21, 9, 150, 'DELETED', now()),
('Staylio Hà Nội - Mỹ Đình Plaza', '15 Lê Đức Thọ', 'https://picsum.photos/200/300?5', 3, 9, 90, 'CONFIRMED', now()),
('Staylio Hà Nội - Ba Đình Heritage', '22 Kim Mã', 'https://picsum.photos/200/300?6', 17, 9, 110, 'PENDING', now()),
('Staylio Hà Nội - Times City', '458 Minh Khai', 'https://picsum.photos/200/300?7', 9, 9, 130, 'CONFIRMED', now()),
('Staylio Hà Nội - Long Biên Riverside', '35 Ngọc Lâm', 'https://picsum.photos/200/300?8', 25, 9, 140, 'REJECTED', now()),
('Staylio Hà Nội - Thanh Xuân Tower', '200 Nguyễn Trãi', 'https://picsum.photos/200/300?9', 14, 9, 95, 'DELETED', now()),
('Staylio Hà Nội - Hà Đông Plaza', '10 Quang Trung', 'https://picsum.photos/200/300?10', 30, 9, 160, 'CONFIRMED', now()),

-- hotel_id = 10
('Staylio Sài Gòn - Quận 1 Central', '25 Nguyễn Huệ, Q1', 'https://picsum.photos/200/300?11', 2, 10, 100, 'CONFIRMED', now()),
('Staylio Sài Gòn - Bến Thành Market', '50 Lê Thánh Tôn, Q1', 'https://picsum.photos/200/300?12', 18, 10, 120, 'PENDING', now()),
('Staylio Sài Gòn - Landmark 81 View', '720 Điện Biên Phủ, Bình Thạnh', 'https://picsum.photos/200/300?13', 6, 10, 85, 'CONFIRMED', now()),
('Staylio Sài Gòn - Phú Nhuận Hub', '90 Nguyễn Văn Trỗi', 'https://picsum.photos/200/300?14', 27, 10, 140, 'REJECTED', now()),
('Staylio Sài Gòn - Tân Bình Airport', '12 Trường Sơn', 'https://picsum.photos/200/300?15', 11, 10, 95, 'DELETED', now()),
('Staylio Sài Gòn - Quận 7 Riverside', '99 Nguyễn Thị Thập', 'https://picsum.photos/200/300?16', 4, 10, 105, 'CONFIRMED', now()),
('Staylio Sài Gòn - Thủ Đức City', '200 Võ Văn Ngân', 'https://picsum.photos/200/300?17', 23, 10, 125, 'PENDING', now()),
('Staylio Sài Gòn - Gò Vấp Center', '88 Quang Trung', 'https://picsum.photos/200/300?18', 15, 10, 135, 'REJECTED', now()),
('Staylio Sài Gòn - Bình Tân Plaza', '150 Tên Lửa', 'https://picsum.photos/200/300?19', 29, 10, 115, 'CONFIRMED', now()),
('Staylio Sài Gòn - Chợ Lớn Heritage', '60 Hải Thượng Lãn Ông, Q5', 'https://picsum.photos/200/300?20', 7, 10, 150, 'DELETED', now());

INSERT INTO rooms (
    created_at,
    room_name,
    hotel_branch_id,
    room_type,
    description,
    price,
    max_adults,
    max_children,
    adult_price,
    capacity,
    child_price,
    bed_info,
    area,
    room_number,
    floor,
    status,
    is_active,
    is_voucher_applicable
) VALUES

-- ===== BRANCH 24 =====
(NOW(),'Single 101',24,'SINGLE','Phòng đơn',500000,2,1,250000,2,150000,'1 Queen Bed',25,'A101',1,'AVAILABLE',1,1),
(NOW(),'Single 102',24,'SINGLE','Phòng đơn',500000,2,1,250000,2,150000,'1 Queen Bed',25,'A102',1,'AVAILABLE',1,1),

(NOW(),'Double 201',24,'DOUBLE','Phòng đôi',800000,4,2,300000,4,180000,'2 Single Beds',35,'A201',2,'OCCUPIED',1,1),
(NOW(),'Double 202',24,'DOUBLE','Phòng đôi',800000,4,2,300000,4,180000,'2 Single Beds',35,'A202',2,'OCCUPIED',1,1),

(NOW(),'Suite 301',24,'SUITE','Phòng suite',1500000,4,2,400000,4,200000,'1 King Bed',50,'A301',3,'MAINTENANCE',1,1),
(NOW(),'Suite 302',24,'SUITE','Phòng suite',1500000,4,2,400000,4,200000,'1 King Bed',50,'A302',3,'MAINTENANCE',1,1),
(NOW(),'Suite 303',24,'SUITE','Phòng suite',1500000,4,2,400000,4,200000,'1 King Bed',50,'A303',3,'MAINTENANCE',1,1),

(NOW(),'VIP 401',24,'VIP','Phòng VIP',2500000,6,2,500000,6,250000,'2 King Beds',70,'A401',4,'RESERVED',1,1),
(NOW(),'VIP 402',24,'VIP','Phòng VIP',2500000,6,2,500000,6,250000,'2 King Beds',70,'A402',4,'RESERVED',1,1),
(NOW(),'VIP 403',24,'VIP','Phòng VIP',2500000,6,2,500000,6,250000,'2 King Beds',70,'A403',4,'RESERVED',1,1),


-- ===== BRANCH 25 =====
(NOW(),'Single Room 101',25,'SINGLE','Phòng đơn',550000,2,1,260000,2,160000,'1 Queen Bed',25,'B101',1,'AVAILABLE',1,1),
(NOW(),'Single Room 102',25,'SINGLE','Phòng đơn',550000,2,1,260000,2,160000,'1 Queen Bed',25,'B102',1,'AVAILABLE',1,1),

(NOW(),'Double Room 201',25,'DOUBLE','Phòng đôi',850000,4,2,320000,4,180000,'2 Single Beds',35,'B201',2,'OCCUPIED',1,1),
(NOW(),'Double Room 202',25,'DOUBLE','Phòng đôi',850000,4,2,320000,4,180000,'2 Single Beds',35,'B202',2,'OCCUPIED',1,1),

(NOW(),'Suite Room 301',25,'SUITE','Phòng suite',1600000,4,2,420000,4,200000,'1 King Bed',50,'B301',3,'MAINTENANCE',1,1),
(NOW(),'Suite Room 302',25,'SUITE','Phòng suite',1600000,4,2,420000,4,200000,'1 King Bed',50,'B302',3,'MAINTENANCE',1,1),
(NOW(),'Suite Room 303',25,'SUITE','Phòng suite',1600000,4,2,420000,4,200000,'1 King Bed',50,'B303',3,'MAINTENANCE',1,1),

(NOW(),'VIP Room 401',25,'VIP','Phòng VIP',2600000,6,2,520000,6,250000,'2 King Beds',70,'B401',4,'RESERVED',1,1),
(NOW(),'VIP Room 402',25,'VIP','Phòng VIP',2600000,6,2,520000,6,250000,'2 King Beds',70,'B402',4,'RESERVED',1,1),
(NOW(),'VIP Room 403',25,'VIP','Phòng VIP',2600000,6,2,520000,6,250000,'2 King Beds',70,'B403',4,'RESERVED',1,1);

INSERT INTO utilities (title, icon_name, description, created_at) VALUES
    ('Wifi', 'wifi', 'Wifi tốc độ cao miễn phí', now()),
    ('TV', 'tv', 'TV màn hình phẳng với nhiều kênh giải trí', now()),
    ('Điều hòa', 'air-conditioner', 'Hệ thống điều hòa nhiệt độ hiện đại', now()),
    ('Hồ bơi', 'pool', 'Sử dụng hồ bơi miễn phí', now()),
    ('Bãi đỗ xe', 'car', 'Bãi đỗ xe riêng an toàn', now()),
    ('Mini Bar', 'wine', 'Mini bar với đồ uống và đồ ăn nhẹ', now()),
    ('Bồn tắm', 'bath', 'Phòng tắm có bồn tắm cao cấp', now()),
    ('Máy pha cà phê', 'coffee', 'Máy pha cà phê tiện lợi trong phòng', now()),
    ('Ban công', 'balcony', 'Ban công riêng với view đẹp', now()),
    ('Két an toàn', 'safe', 'Két sắt bảo mật cho tài sản cá nhân', now());
INSERT INTO voucher
(code, title, description, discount_type, discount_value,
 min_order_value, max_discount_amount, hotel_branch_id,
 total_usage_limit, current_usage_count, usage_limit_per_user,
 start_date, expiry_date, status, created_at)
VALUES

    ('WELCOME10',
     'Giảm giá chào mừng',
     'Ưu đãi dành cho khách hàng lần đầu đặt phòng',
     'PERCENTAGE',
     10,
     500000,
     200000,
     23,
     500,
     35,
     1,
     '2026-05-01 00:00:00',
     '2026-12-31 23:59:59',
     'ACTIVE',
     NOW()),

    ('SUMMER20',
     'Khuyến mãi mùa hè',
     'Giảm giá đặc biệt cho kỳ nghỉ mùa hè',
     'PERCENTAGE',
     20,
     1000000,
     500000,
     23,
     300,
     50,
     2,
     '2026-06-01 00:00:00',
     '2026-08-31 23:59:59',
     'ACTIVE',
     NOW()),

    ('LUXURY500',
     'Ưu đãi phòng cao cấp',
     'Giảm trực tiếp cho phòng hạng sang',
     'FIXED',
     500000,
     3000000,
     NULL,
     24,
     100,
     15,
     1,
     '2026-05-01 00:00:00',
     '2026-12-31 23:59:59',
     'ACTIVE',
     NOW()),

    ('WEEKEND15',
     'Ưu đãi cuối tuần',
     'Áp dụng cho booking cuối tuần',
     'PERCENTAGE',
     15,
     800000,
     300000,
     24,
     200,
     28,
     2,
     '2026-05-01 00:00:00',
     '2026-12-31 23:59:59',
     'ACTIVE',
     NOW()),

    ('FAMILY300',
     'Ưu đãi gia đình',
     'Giảm giá dành cho gia đình',
     'FIXED',
     300000,
     1500000,
     NULL,
     23,
     250,
     45,
     1,
     '2026-05-01 00:00:00',
     '2026-12-31 23:59:59',
     'ACTIVE',
     NOW()),

    ('VIP25',
     'Ưu đãi khách VIP',
     'Dành riêng cho khách hàng thân thiết',
     'PERCENTAGE',
     25,
     2000000,
     700000,
     23,
     100,
     20,
     5,
     '2026-05-01 00:00:00',
     '2026-12-31 23:59:59',
     'ACTIVE',
     NOW()),

    ('FLASH200',
     'Flash sale',
     'Ưu đãi giới hạn trong thời gian ngắn',
     'FIXED',
     200000,
     700000,
     NULL,
     23,
     50,
     12,
     1,
     '2026-05-10 00:00:00',
     '2026-05-20 23:59:59',
     'ACTIVE',
     NOW()),

    ('NEWYEAR30',
     'Ưu đãi năm mới',
     'Khuyến mãi dịp năm mới',
     'PERCENTAGE',
     30,
     2000000,
     1000000,
     23,
     500,
     0,
     1,
     '2026-12-20 00:00:00',
     '2027-01-10 23:59:59',
     'ACTIVE',
     NOW()),

    ('EXPIRED50',
     'Voucher hết hạn',
     'Voucher dùng để test trạng thái hết hạn',
     'PERCENTAGE',
     50,
     1000000,
     500000,
     24,
     100,
     80,
     1,
     '2025-01-01 00:00:00',
     '2025-12-31 23:59:59',
     'EXPIRED',
     NOW()),

    ('DISABLED100',
     'Voucher tạm khóa',
     'Voucher bị admin vô hiệu hóa',
     'FIXED',
     100000,
     500000,
     NULL,
     24,
     100,
     0,
     1,
     '2026-01-01 00:00:00',
     '2026-12-31 23:59:59',
     'DISABLED',
     NOW());

INSERT INTO user_voucher
(
    user_id,
    voucher_id,
    used_count,
    status,
    assigned_at,
    used_at,
    created_at
)
VALUES

-- USER 1
(1, 1, 0, 'UNUSED', NOW(), NULL, NOW()),
(1, 2, 1, 'USED', NOW(), NOW(), NOW()),
(1, 3, 0, 'UNUSED', NOW(), NULL, NOW()),

-- USER 13
(13, 4, 0, 'UNUSED', NOW(), NULL, NOW()),
(13, 5, 1, 'USED', NOW(), NOW(), NOW()),
(13, 6, 0, 'EXPIRED', NOW(), NULL, NOW()),
(13, 7, 0, 'UNUSED', NOW(), NULL, NOW()),

-- USER 14
(14, 8, 1, 'USED', NOW(), NOW(), NOW()),
(14, 9, 0, 'UNUSED', NOW(), NULL, NOW()),
(14, 10, 0, 'EXPIRED', NOW(), NULL, NOW());


INSERT INTO bookings
(
    user_id,
    room_id,
    check_in_date,
    check_out_date,
    adults,
    children,
    original_price,
    discount_amount,
    final_price,
    user_voucher_id,
    booking_code,
    status,
    note,
    confirmed_at,
    cancelled_at,
    checked_in_at,
    checked_out_at,
    created_at
)
VALUES

-- USER 1
(
    1,
    1,
    '2026-06-01',
    '2026-06-03',
    2,
    1,
    2000000,
    500000,
    1500000,
    1,
    'BK20260001',
    'CONFIRMED',
    'Khách yêu cầu phòng tầng cao',
    NOW(),
    NULL,
    NULL,
    NULL,
    NOW()
),

(
    1,
    2,
    '2026-06-10',
    '2026-06-12',
    2,
    0,
    3000000,
    600000,
    2400000,
    2,
    'BK20260002',
    'CHECKED_IN',
    NULL,
    NOW(),
    NULL,
    NOW(),
    NULL,
    NOW()
),

(
    1,
    3,
    '2026-07-01',
    '2026-07-05',
    3,
    1,
    5000000,
    700000,
    4300000,
    3,
    'BK20260003',
    'PENDING_PAYMENT',
    'Thanh toán sau',
    NULL,
    NULL,
    NULL,
    NULL,
    NOW()
),

-- USER 13
(
    13,
    4,
    '2026-06-15',
    '2026-06-18',
    2,
    2,
    4500000,
    450000,
    4050000,
    4,
    'BK20260004',
    'CONFIRMED',
    NULL,
    NOW(),
    NULL,
    NULL,
    NULL,
    NOW()
),

(
    13,
    5,
    '2026-06-20',
    '2026-06-25',
    4,
    2,
    8000000,
    700000,
    7300000,
    5,
    'BK20260005',
    'CHECKED_OUT',
    'Đã hoàn thành kỳ nghỉ',
    NOW(),
    NULL,
    DATE_SUB(NOW(), INTERVAL 3 DAY),
    NOW(),
    NOW()
),

(
    13,
    6,
    '2026-07-10',
    '2026-07-12',
    1,
    0,
    1800000,
    200000,
    1600000,
    6,
    'BK20260006',
    'CANCELLED',
    'Khách hủy do thay đổi lịch trình',
    NULL,
    NOW(),
    NULL,
    NULL,
    NOW()
),

(
    13,
    7,
    '2026-08-01',
    '2026-08-03',
    2,
    1,
    3500000,
    350000,
    3150000,
    7,
    'BK20260007',
    'CONFIRMED',
    NULL,
    NOW(),
    NULL,
    NULL,
    NULL,
    NOW()
),

-- USER 14
(
    14,
    8,
    '2026-06-05',
    '2026-06-08',
    2,
    0,
    4200000,
    700000,
    3500000,
    8,
    'BK20260008',
    'CHECKED_IN',
    NULL,
    NOW(),
    NULL,
    NOW(),
    NULL,
    NOW()
),

(
    14,
    9,
    '2026-09-01',
    '2026-09-04',
    2,
    2,
    6000000,
    600000,
    5400000,
    9,
    'BK20260009',
    'PENDING_PAYMENT',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NOW()
),

(
    14,
    10,
    '2026-10-10',
    '2026-10-15',
    3,
    1,
    9500000,
    700000,
    8800000,
    10,
    'BK20260010',
    'CONFIRMED',
    'Khách yêu cầu giường đôi',
    NOW(),
    NULL,
    NULL,
    NULL,
    NOW()
);

INSERT INTO payments
(
    booking_id,
    payment_method,
    transaction_id,
    gateway_order_id,
    amount,
    status,
    payment_url,
    raw_response,
    paid_at,
    created_at
)
VALUES

-- BOOKING 1
(
    1,
    'VNPAY',
    'TXN000001',
    'VNPAY_ORDER_0001',
    1500000,
    'PAID',
    'https://sandbox.vnpayment.vn/payment/1',
    '{"gateway":"VNPAY","message":"Payment success"}',
    NOW(),
    NOW()
),

-- BOOKING 2
(
    2,
    'MOMO',
    'TXN000002',
    'MOMO_ORDER_0002',
    2400000,
    'PAID',
    'https://test-payment.momo.vn/2',
    '{"gateway":"MOMO","message":"Payment success"}',
    NOW(),
    NOW()
),

-- BOOKING 3
(
    3,
    'BANK_TRANSFER',
    'TXN000003',
    'BANK_ORDER_0003',
    4300000,
    'PENDING',
    NULL,
    '{"gateway":"BANK_TRANSFER","message":"Waiting for payment"}',
    NULL,
    NOW()
),

-- BOOKING 4
(
    4,
    'VNPAY',
    'TXN000004',
    'VNPAY_ORDER_0004',
    4050000,
    'PAID',
    'https://sandbox.vnpayment.vn/payment/4',
    '{"gateway":"VNPAY","message":"Payment success"}',
    NOW(),
    NOW()
),

-- BOOKING 5
(
    5,
    'CASH',
    'TXN000005',
    'CASH_ORDER_0005',
    7300000,
    'PAID',
    NULL,
    '{"gateway":"CASH","message":"Paid at hotel"}',
    NOW(),
    NOW()
),

-- BOOKING 6
(
    6,
    'MOMO',
    'TXN000006',
    'MOMO_ORDER_0006',
    1600000,
    'FAILED',
    'https://test-payment.momo.vn/6',
    '{"gateway":"MOMO","message":"Payment failed"}',
    NULL,
    NOW()
),

-- BOOKING 7
(
    7,
    'VNPAY',
    'TXN000007',
    'VNPAY_ORDER_0007',
    3150000,
    'PAID',
    'https://sandbox.vnpayment.vn/payment/7',
    '{"gateway":"VNPAY","message":"Payment success"}',
    NOW(),
    NOW()
),

-- BOOKING 8
(
    8,
    'MOMO',
    'TXN000008',
    'MOMO_ORDER_0008',
    3500000,
    'PAID',
    'https://test-payment.momo.vn/8',
    '{"gateway":"MOMO","message":"Payment success"}',
    NOW(),
    NOW()
),

-- BOOKING 9
(
    9,
    'BANK_TRANSFER',
    'TXN000009',
    'BANK_ORDER_0009',
    5400000,
    'PENDING',
    NULL,
    '{"gateway":"BANK_TRANSFER","message":"Waiting for confirmation"}',
    NULL,
    NOW()
),

-- BOOKING 10
(
    10,
    'CASH',
    'TXN000010',
    'CASH_ORDER_0010',
    8800000,
    'PAID',
    NULL,
    '{"gateway":"CASH","message":"Paid successfully"}',
    NOW(),
    NOW()
);

INSERT INTO reviews
(
    booking_id,
    room_id,
    user_id,
    rating,
    comment,
    reply_comment,
    reply_at,
    status,
    is_deleted,
    created_at,
    updated_at
)
VALUES

-- REVIEW 1
(
    1,
    1,
    1,
    5,
    'Phòng sạch sẽ, nhân viên rất thân thiện và hỗ trợ nhiệt tình.',
    'Cảm ơn bạn đã trải nghiệm dịch vụ tại khách sạn của chúng tôi!',
    NOW(),
    'VISIBLE',
    false,
    NOW(),
    NOW()
),

-- REVIEW 2
(
    2,
    2,
    13,
    4,
    'Không gian đẹp, vị trí thuận tiện nhưng wifi hơi yếu.',
    'Chúng tôi sẽ kiểm tra lại hệ thống wifi. Cảm ơn góp ý của bạn!',
    NOW(),
    'VISIBLE',
    false,
    NOW(),
    NOW()
),

-- REVIEW 3
(
    3,
    3,
    14,
    3,
    'Phòng ổn nhưng điều hòa hoạt động chưa tốt.',
    NULL,
    NULL,
    'PENDING',
    false,
    NOW(),
    NOW()
),

-- REVIEW 4
(
    4,
    4,
    1,
    5,
    'Dịch vụ tuyệt vời, sẽ quay lại lần sau.',
    'Rất mong được đón tiếp bạn lần tiếp theo!',
    NOW(),
    'VISIBLE',
    false,
    NOW(),
    NOW()
),

-- REVIEW 5
(
    5,
    5,
    13,
    2,
    'Phòng hơi nhỏ so với hình ảnh quảng cáo.',
    'Chúng tôi xin lỗi vì trải nghiệm chưa tốt của bạn.',
    NOW(),
    'VISIBLE',
    false,
    NOW(),
    NOW()
),

-- REVIEW 6
(
    6,
    6,
    14,
    1,
    'Nhân viên phục vụ chưa chuyên nghiệp.',
    NULL,
    NULL,
    'PENDING',
    false,
    NOW(),
    NOW()
),

-- REVIEW 7
(
    7,
    7,
    1,
    4,
    'Bữa sáng ngon, phòng sạch sẽ.',
    'Cảm ơn bạn đã đánh giá tích cực!',
    NOW(),
    'VISIBLE',
    false,
    NOW(),
    NOW()
),

-- REVIEW 8
(
    8,
    8,
    13,
    5,
    'Khách sạn rất đẹp và sang trọng.',
    'Cảm ơn bạn rất nhiều!',
    NOW(),
    'VISIBLE',
    false,
    NOW(),
    NOW()
),

-- REVIEW 9
(
    9,
    9,
    14,
    3,
    'Dịch vụ tạm ổn, cần cải thiện thêm về vệ sinh.',
    NULL,
    NULL,
    'HIDDEN',
    false,
    NOW(),
    NOW()
),

-- REVIEW 10
(
    10,
    10,
    1,
    5,
    'Một trải nghiệm nghỉ dưỡng tuyệt vời.',
    'Rất vui khi bạn hài lòng với dịch vụ!',
    NOW(),
    'VISIBLE',
    false,
    NOW(),
    NOW()
);

SHOW CREATE TABLE reviews;