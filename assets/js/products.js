// Danh mục sản phẩm Patch Thêu Store
const CATEGORIES = [
    { id: 'all', name: 'Tất cả sản phẩm', icon: 'fa-layer-group' },
    { id: 'japanese', name: '🎌 Nhật Bản & Anime', icon: 'fa-torii-gate' },
    { id: 'cyberpunk', name: '⚡ Cyberpunk & Streetwear', icon: 'fa-bolt' },
    { id: 'cute', name: '🐱 Cute & Y2K', icon: 'fa-cat' },
    { id: 'retro', name: '🚀 Retro & Vũ Trụ', icon: 'fa-rocket' },
    { id: 'tactical', name: '🪖 Tactical & Biker', icon: 'fa-shield-halved' }
];

// Danh sách các loại mặt sau (Backing Options)
const BACKING_TYPES = {
    iron: {
        id: 'iron',
        name: 'Keo ủi nhiệt (Iron-On)',
        description: 'Ủi dính nhanh bằng bàn ủi tại nhà trong 15-20s, cực chắc chắn',
        extraPrice: 0,
        icon: 'fa-fire'
    },
    velcro: {
        id: 'velcro',
        name: 'Gai dán Velcro (Hook & Loop)',
        description: 'Có sẵn mặt gai + mặt bông, dễ dàng tháo dán trên balo, áo tactical',
        extraPrice: 10000,
        icon: 'fa-grip-lines'
    },
    sew: {
        id: 'sew',
        name: 'May viền thủ công (Sew-On)',
        description: 'Không keo, có viền may chuyên dụng cho thợ may hoặc đính tay',
        extraPrice: 0,
        icon: 'fa-scissors'
    },
    sticker: {
        id: 'sticker',
        name: 'Sticker dán tự dính 3M',
        description: 'Bóc dán tức thì lên nón bảo hiểm, ốp điện thoại, laptop',
        extraPrice: 5000,
        icon: 'fa-tag'
    }
};

// Danh sách sản phẩm mẫu chi tiết
const PRODUCTS = [
    {
        id: 'patch-01',
        name: 'Patch Thêu Mãnh Hổ Hoàng Gia Nhật Bản',
        category: 'japanese',
        categoryName: 'Nhật Bản & Anime',
        price: 75000,
        originalPrice: 99000,
        image: 'assets/images/tiger.jpg',
        rating: 5.0,
        reviewsCount: 236,
        salesCount: 1850,
        badge: 'Bán chạy nhất',
        badgeColor: 'bg-red-600',
        size: '8.5 x 8.5 cm',
        stitchDensity: '24.500 mũi chỉ thêu',
        thread: 'Chỉ thêu tơ lụa nhân tạo pha sợi kim tuyến vàng óng',
        edgeType: 'Viền vắt sổ Merrowed đệm nổi 3mm siêu dày',
        description: 'Tuyệt tác patch thêu lấy cảm hứng từ tranh dân gian Nhật Bản Ukiyo-e với hình tượng mãnh hổ dũng mãnh giữa tầng mây vàng rực. Đường chỉ thêu đa tầng dày đặc tạo hiệu ứng 3D khối cơ bắp nổi bật.',
        tags: ['Hổ', 'Nhật Bản', 'Áo Jean', 'Hot']
    },
    {
        id: 'patch-02',
        name: 'Patch Thêu Cyber Skull & Neon Roses 2049',
        category: 'cyberpunk',
        categoryName: 'Cyberpunk & Streetwear',
        price: 85000,
        originalPrice: 110000,
        image: 'assets/images/cyber_skull.jpg',
        rating: 4.9,
        reviewsCount: 184,
        salesCount: 1240,
        badge: 'Cực Trend',
        badgeColor: 'bg-purple-600',
        size: '9.0 x 9.0 cm',
        stitchDensity: '28.000 mũi chỉ phát quang nhẹ UV',
        thread: 'Sợi chỉ Neon Cyan & Fuchsia Pink tương phản cao',
        edgeType: 'Viền vi tính Laser-Cut sắc nét chống xơ mép',
        description: 'Phong cách Techwear & Cyberpunk tương lai kết hợp đầu lâu cơ khí và hoa hồng nở rộ. Lớp chỉ phản chiếu sắc tím hồng neon nổi bật trên nền vải Twill đen carbon.',
        tags: ['Cyberpunk', 'Skull', 'Streetwear', 'Tactical']
    },
    {
        id: 'patch-03',
        name: 'Patch Thêu Mèo Thần Tài Ăn Mì Ramen Chibi',
        category: 'cute',
        categoryName: 'Cute & Y2K',
        price: 59000,
        originalPrice: 79000,
        image: 'assets/images/ramen_cat.jpg',
        rating: 5.0,
        reviewsCount: 312,
        salesCount: 2680,
        badge: 'Yêu thích nhất',
        badgeColor: 'bg-emerald-600',
        size: '7.5 x 7.5 cm',
        stitchDensity: '19.800 mũi chỉ mịn màng',
        thread: 'Chỉ Cotton mềm mại màu Pastel cao cấp Nhật Bản',
        edgeType: 'Viền bo tròn viền vắt sổ chỉ xanh pastel',
        description: 'Chú mèo may mắn Maneki-neko đeo khăn quấn đầu thưởng thức tô mì ramen thơm ngút khói. Thích hợp gắn lên túi tote, mũ bucket, áo thun, balo học sinh cực kỳ dễ thương.',
        tags: ['Mèo', 'Ramen', 'Chibi', 'Cute', 'Balo']
    },
    {
        id: 'patch-04',
        name: 'Patch Thêu NASA Crescent Odyssey Mission 41',
        category: 'retro',
        categoryName: 'Retro & Vũ Trụ',
        price: 69000,
        originalPrice: 89000,
        image: 'assets/images/astronaut.jpg',
        rating: 4.8,
        reviewsCount: 147,
        salesCount: 960,
        badge: 'Vintage Heritage',
        badgeColor: 'bg-blue-600',
        size: '8.0 x 8.0 cm',
        stitchDensity: '22.000 mũi chỉ thêu cổ điển',
        thread: 'Sợi chỉ xanh hải quân Navy & vàng kim Gold hoàng tộc',
        edgeType: 'Viền vắt sổ quân đội merrowed dày',
        description: 'Tái hiện huy hiệu sứ mệnh không gian cổ điển với phi hành gia trôi dạt cùng vầng trăng khuyết và các chòm sao. Phong cách Retro cổ điển gắn lên áo khoác bomber hay jacket vải thô.',
        tags: ['NASA', 'Vũ Trụ', 'Bomber', 'Vintage']
    },
    {
        id: 'patch-05',
        name: 'Patch Thêu Đại Dương Sóng Lừng Kanagawa & Núi Phú Sĩ',
        category: 'japanese',
        categoryName: 'Nhật Bản & Anime',
        price: 79000,
        originalPrice: 99000,
        image: 'assets/images/retro_wave.jpg',
        rating: 4.9,
        reviewsCount: 215,
        salesCount: 1530,
        badge: 'Best Seller',
        badgeColor: 'bg-amber-600',
        size: '8.5 x 8.5 cm',
        stitchDensity: '26.400 mũi dệt chỉ nổi',
        thread: 'Gradient 5 sắc thái xanh biển đậm nhạt và bọt sóng trắng muốt',
        edgeType: 'Viền vắt sổ xanh chàm Indigo cổ điển',
        description: 'Họa tiết đợt sóng ngoài khơi Kanagawa kinh điển của Hokusai, với ngọn núi Phú Sĩ tuyết phủ và mặt trời vàng tỏa rạng. Đẳng cấp nghệ thuật truyền thống trường tồn.',
        tags: ['Sóng Biển', 'Phú Sĩ', 'Nghệ Thuật', 'Đẹp']
    },
    {
        id: 'patch-06',
        name: 'Patch Thêu Cá Chép Vàng Koi Song Ngư Vượt Sóng',
        category: 'japanese',
        categoryName: 'Nhật Bản & Anime',
        price: 72000,
        originalPrice: 92000,
        image: 'assets/images/tiger.jpg', // can use existing image or stylized preview
        rating: 4.8,
        reviewsCount: 94,
        salesCount: 680,
        badge: 'May Mắn',
        badgeColor: 'bg-orange-500',
        size: '8.0 x 8.0 cm',
        stitchDensity: '21.000 mũi chỉ ngũ sắc',
        thread: 'Sợi chỉ thêu bóng đổi màu theo góc nhìn ánh sáng',
        edgeType: 'Viền merrowed chỉ đỏ phong thủy',
        description: 'Biểu tượng của sự kiên trì, may mắn tài lộc và thăng tiến vượt bậc. Phối màu đỏ cam rực rỡ trên áo hoodie hoặc vạt áo khoác.',
        tags: ['Cá Koi', 'May Mắn', 'Phong Thủy']
    },
    {
        id: 'patch-07',
        name: 'Patch Thêu Sói Đêm Tactical Ghost Recon',
        category: 'tactical',
        categoryName: 'Tactical & Biker',
        price: 75000,
        originalPrice: 95000,
        image: 'assets/images/cyber_skull.jpg',
        rating: 5.0,
        reviewsCount: 167,
        salesCount: 1100,
        badge: 'Tactical Quân Sự',
        badgeColor: 'bg-stone-700',
        size: '8.0 x 7.5 cm',
        stitchDensity: '23.000 mũi dệt mật độ cao',
        thread: 'Sợi chỉ quân sự chống sờn mài mòn cao cấp',
        edgeType: 'Lưng Velcro chuẩn quân sự dán chắc balo 5.11',
        description: 'Huy hiệu chiến binh sói cô độc được dân Biker, phượt thủ và tactical cực kỳ ưa chuộng. Độ bám gai dán siêu bền chịu tải rung lắc mạnh.',
        tags: ['Tactical', 'Sói', 'Biker', 'Balo']
    },
    {
        id: 'patch-08',
        name: 'Patch Thêu Trái Tim Gai Barbed Neon Y2K',
        category: 'cyberpunk',
        categoryName: 'Cyberpunk & Streetwear',
        price: 55000,
        originalPrice: 75000,
        image: 'assets/images/ramen_cat.jpg',
        rating: 4.7,
        reviewsCount: 88,
        salesCount: 750,
        badge: 'Y2K Vibe',
        badgeColor: 'bg-pink-600',
        size: '6.5 x 6.5 cm',
        stitchDensity: '16.500 mũi chỉ phát sáng',
        thread: 'Chỉ viền hồng neon & gai bạc phản quang',
        edgeType: 'Viền cắt nhiệt Laser chuẩn xác',
        description: 'Họa tiết trái tim vướng dây kẽm gai mang đậm hơi thở Grunge & Y2K Aesthetics thập niên 2000. Phụ kiện hoàn hảo cho quần túi hộp, chân váy cạp trễ hay mũ beanie.',
        tags: ['Y2K', 'Trái Tim', 'Grunge', 'Streetwear']
    }
];

// Định dạng tiền tệ VND
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}
