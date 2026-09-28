// VALEE - VINTAGE & EMBROIDERY CLOTHING PRODUCTS CATALOG
const CATEGORIES = [
    { id: 'all', name: 'Tất cả mẫu thêu', icon: 'fa-layer-group' },
    { id: 'vintage-botanical', name: '🌿 Hoa Cỏ & Vintage', icon: 'fa-seedling' },
    { id: 'japanese', name: '🎌 Nhật Bản Cổ Điển', icon: 'fa-torii-gate' },
    { id: 'retro', name: '🚀 Heritage & Vũ Trụ', icon: 'fa-compass' },
    { id: 'cute', name: '🐱 Cute & Y2K', icon: 'fa-cat' },
    { id: 'tactical', name: '🪖 Biker & Streetwear', icon: 'fa-shield-halved' }
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
        description: 'Mặt gai + mặt bông, tháo dán linh hoạt trên balo, áo khoác',
        extraPrice: 10000,
        icon: 'fa-grip-lines'
    },
    sew: {
        id: 'sew',
        name: 'May viền thủ công (Sew-On)',
        description: 'Đường viền may chuyên dụng cho thợ may hoặc khâu tay tỉ mỉ',
        extraPrice: 0,
        icon: 'fa-scissors'
    },
    sticker: {
        id: 'sticker',
        name: 'Sticker dán tự dính 3M',
        description: 'Bóc dán tức thì lên nón bảo hiểm, ốp điện thoại, sổ tay',
        extraPrice: 5000,
        icon: 'fa-tag'
    }
};

// Danh sách sản phẩm mẫu thêu Vintage của VALEE
const PRODUCTS = [
    {
        id: 'patch-01',
        name: 'Patch Thêu Mãnh Hổ Hoàng Gia Ukiyo-e',
        category: 'japanese',
        categoryName: 'Nhật Bản Cổ Điển',
        price: 75000,
        originalPrice: 99000,
        image: 'assets/images/tiger.jpg',
        rating: 5.0,
        reviewsCount: 236,
        salesCount: 1850,
        badge: 'Bán chạy nhất',
        badgeColor: 'bg-amber-700',
        size: '8.5 x 8.5 cm',
        stitchDensity: '24.500 mũi chỉ thêu',
        thread: 'Chỉ tơ lụa nhân tạo pha ánh kim cổ điển',
        edgeType: 'Viền vắt sổ Merrowed đệm nổi 3mm vintage',
        description: 'Tuyệt tác patch thêu lấy cảm hứng từ tranh dân gian Nhật Bản Ukiyo-e với hình tượng mãnh hổ dũng mãnh giữa tầng mây vàng rực. Đường chỉ thêu đa tầng dày đặc tạo hiệu ứng 3D khối cơ bắp nổi bật.',
        tags: ['Hổ', 'Nhật Bản', 'Áo Jean', 'Hot']
    },
    {
        id: 'patch-02',
        name: 'Patch Thêu Cyber Skull & Neon Roses Vintage',
        category: 'tactical',
        categoryName: 'Biker & Streetwear',
        price: 85000,
        originalPrice: 110000,
        image: 'assets/images/cyber_skull.jpg',
        rating: 4.9,
        reviewsCount: 184,
        salesCount: 1240,
        badge: 'Cực Trend',
        badgeColor: 'bg-stone-800',
        size: '9.0 x 9.0 cm',
        stitchDensity: '28.000 mũi chỉ phát quang nhẹ',
        thread: 'Sợi chỉ Neon & hoa hồng nở rộ tương phản cao',
        edgeType: 'Viền vi tính Laser-Cut sắc nét chống xơ mép',
        description: 'Phong cách Techwear & Cyberpunk kết hợp đầu lâu cơ khí và hoa hồng nở rộ. Lớp chỉ phản chiếu sắc tím hồng neon nổi bật trên nền vải Twill đen carbon.',
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
        badgeColor: 'bg-emerald-800',
        size: '7.5 x 7.5 cm',
        stitchDensity: '19.800 mũi chỉ mịn màng',
        thread: 'Chỉ Cotton mềm mại màu Pastel cao cấp Nhật Bản',
        edgeType: 'Viền bo tròn viền vắt sổ chỉ xanh pastel',
        description: 'Chú mèo may mắn Maneki-neko đeo khăn quấn đầu thưởng thức tô mì ramen thơm ngút khói. Thích hợp gắn lên túi tote, mũ bucket, áo thun, balo học sinh cực kỳ dễ thương.',
        tags: ['Mèo', 'Ramen', 'Chibi', 'Cute', 'Balo']
    },
    {
        id: 'patch-04',
        name: 'Patch Thêu NASA Crescent Odyssey Heritage Mission',
        category: 'retro',
        categoryName: 'Heritage & Vũ Trụ',
        price: 69000,
        originalPrice: 89000,
        image: 'assets/images/astronaut.jpg',
        rating: 4.8,
        reviewsCount: 147,
        salesCount: 960,
        badge: 'Vintage Heritage',
        badgeColor: 'bg-blue-900',
        size: '8.0 x 8.0 cm',
        stitchDensity: '22.000 mũi chỉ thêu cổ điển',
        thread: 'Sợi chỉ xanh hải quân Navy & vàng kim Gold hoàng tộc',
        edgeType: 'Viền vắt sổ quân đội merrowed dày',
        description: 'Tái hiện huy hiệu sứ mệnh không gian cổ điển với phi hành gia trôi dạt cùng vầng trăng khuyết và các chòm sao. Phong cách Retro cổ điển gắn lên áo khoác bomber hay jacket vải thô.',
        tags: ['NASA', 'Vũ Trụ', 'Bomber', 'Vintage']
    },
    {
        id: 'patch-05',
        name: 'Patch Thêu Đại Dương Sóng Lừng Kanagawa & Phú Sĩ',
        category: 'japanese',
        categoryName: 'Nhật Bản Cổ Điển',
        price: 79000,
        originalPrice: 99000,
        image: 'assets/images/retro_wave.jpg',
        rating: 4.9,
        reviewsCount: 215,
        salesCount: 1530,
        badge: 'Best Seller',
        badgeColor: 'bg-amber-800',
        size: '8.5 x 8.5 cm',
        stitchDensity: '26.400 mũi dệt chỉ nổi',
        thread: 'Gradient 5 sắc thái xanh biển đậm nhạt và bọt sóng trắng',
        edgeType: 'Viền vắt sổ xanh chàm Indigo cổ điển',
        description: 'Họa tiết đợt sóng ngoài khơi Kanagawa kinh điển của Hokusai, với ngọn núi Phú Sĩ tuyết phủ và mặt trời vàng tỏa rạng. Đẳng cấp nghệ thuật truyền thống trường tồn.',
        tags: ['Sóng Biển', 'Phú Sĩ', 'Nghệ Thuật', 'Đẹp']
    },
    {
        id: 'patch-06',
        name: 'Patch Thêu Hoa Cúc Họa Mi & Kim Chỉ Biểu Tượng Valee',
        category: 'vintage-botanical',
        categoryName: 'Hoa Cỏ & Vintage',
        price: 65000,
        originalPrice: 85000,
        image: 'assets/images/logo.jpg',
        rating: 5.0,
        reviewsCount: 178,
        salesCount: 890,
        badge: 'Signature Valee',
        badgeColor: 'bg-stone-700',
        size: '7.5 x 7.5 cm',
        stitchDensity: '20.500 mũi chỉ thêu tay tinh xảo',
        thread: 'Sợi chỉ thêu mộc tự nhiên trên nền vải đũi linen cao cấp',
        edgeType: 'Viền khung chỉ vàng đồng Antique Brass',
        description: 'Huy hiệu biểu tượng của xưởng may Valee: Cây kim may luồn sợi chỉ tơ ôm trọn đóa cúc họa mi và nhành lá dại mộc mạc, đậm chất hoài cổ Paris thập niên 70.',
        tags: ['Valee', 'Signature', 'Hoa Cúc', 'Linen']
    },
    {
        id: 'patch-07',
        name: 'Patch Thêu Cá Chép Vàng Koi Song Ngư Vượt Sóng',
        category: 'japanese',
        categoryName: 'Nhật Bản Cổ Điển',
        price: 72000,
        originalPrice: 92000,
        image: 'assets/images/tiger.jpg',
        rating: 4.8,
        reviewsCount: 94,
        salesCount: 680,
        badge: 'May Mắn',
        badgeColor: 'bg-amber-600',
        size: '8.0 x 8.0 cm',
        stitchDensity: '21.000 mũi chỉ ngũ sắc',
        thread: 'Sợi chỉ thêu bóng đổi màu theo góc nhìn ánh sáng',
        edgeType: 'Viền merrowed chỉ đỏ phong thủy',
        description: 'Biểu tượng của sự kiên trì, may mắn tài lộc và thăng tiến vượt bậc. Phối màu đỏ cam rực rỡ trên áo hoodie hoặc vạt áo khoác.',
        tags: ['Cá Koi', 'May Mắn', 'Phong Thủy']
    },
    {
        id: 'patch-08',
        name: 'Patch Thêu Sói Đêm Biker Tactical Recon',
        category: 'tactical',
        categoryName: 'Biker & Streetwear',
        price: 75000,
        originalPrice: 95000,
        image: 'assets/images/cyber_skull.jpg',
        rating: 5.0,
        reviewsCount: 167,
        salesCount: 1100,
        badge: 'Tactical Quân Sự',
        badgeColor: 'bg-stone-800',
        size: '8.0 x 7.5 cm',
        stitchDensity: '23.000 mũi dệt mật độ cao',
        thread: 'Sợi chỉ quân sự chống sờn mài mòn cao cấp',
        edgeType: 'Lưng Velcro chuẩn quân sự dán chắc balo 5.11',
        description: 'Huy hiệu chiến binh sói cô độc được dân Biker, phượt thủ và tactical cực kỳ ưa chuộng. Độ bám gai dán siêu bền chịu tải rung lắc mạnh.',
        tags: ['Tactical', 'Sói', 'Biker', 'Balo']
    }
];

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Global Toast notification helper (available to all modules)
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) {
        console.log(`[Toast] ${message}`);
        return;
    }

    const toast = document.createElement('div');
    const bgColors = {
        success: 'bg-emerald-950/95 border-emerald-500 text-emerald-200',
        error: 'bg-rose-950/95 border-rose-500 text-rose-200',
        info: 'bg-stone-900/95 border-amber-500/70 text-stone-100'
    };
    const icons = {
        success: 'fa-circle-check text-emerald-400',
        error: 'fa-circle-exclamation text-rose-400',
        info: 'fa-bell text-amber-400'
    };

    toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 transform translate-y-3 opacity-0 text-sm ${bgColors[type] || bgColors.info}`;
    toast.innerHTML = `
        <i class="fa-solid ${icons[type] || icons.info} text-base"></i>
        <span class="font-medium">${message}</span>
    `;

    container.appendChild(toast);

    if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-3', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');
        });
    } else {
        setTimeout(() => {
            toast.classList.remove('translate-y-3', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');
        }, 20);
    }

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// Window global exports
if (typeof window !== 'undefined') {
    window.CATEGORIES = CATEGORIES;
    window.BACKING_TYPES = BACKING_TYPES;
    window.PRODUCTS = PRODUCTS;
    window.formatCurrency = formatCurrency;
    window.showToast = showToast;
}

