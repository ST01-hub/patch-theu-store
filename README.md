# 🧵 THÊUCRAFT Studio - Website Bán Patch Thêu & Đặt Thêu Theo Yêu Cầu

Website thương mại điện tử chuyên biệt và độc đáo dành riêng cho **Patch Thêu (Phù hiệu thêu ủi nhiệt, gai dán Velcro, may viền, sticker)** trên áo khoác Jean denim, bomber, balo, mũ nón streetwear.

---

## 🌟 Các Tính Năng Nổi Bật

1. **Phòng Thử Patch Lên Áo Trực Quan (Interactive Patch Studio)**:
   - Cho phép khách hàng chọn và kéo thả trực tiếp các mẫu patch lên áo khoác Jean denim thật.
   - Thử nghiệm vị trí ngực áo, vạt áo, tay áo trước khi quyết định mua.
   - Tự do xoay góc, phóng to / thu nhỏ kích thước.
   - Nút **"Mua trọn combo này"** thêm toàn bộ patch đang thử vào giỏ hàng chỉ với 1 click!

2. **Bộ Tính Giá & Đặt Thêu Tự Động (Custom Patch Calculator)**:
   - Cho phép khách hàng tải ảnh thiết kế / logo riêng (câu lạc bộ xe, team nhảy, thương hiệu local brand).
   - Chọn kích thước tùy ý (cm x cm) hoặc chọn kích thước tiêu chuẩn.
   - Chọn loại mặt sau: Keo ủi nhiệt (Iron-on), Gai dán Velcro, May viền, Sticker dán 3M.
   - Bảng báo giá sỉ & lẻ tức thì theo số lượng (chiết khấu tự động lên đến 70% cho đơn lớn).
   - Tạo phiếu báo giá hoàn chỉnh để kết nối nhanh qua Zalo xưởng thêu.

3. **Danh Mục & Bộ Lọc Sản Phẩm Đa Dạng**:
   - Phân loại: Nhật Bản & Ukiyo-e, Cyberpunk & Streetwear, Cute Y2K Chibi, Retro Vũ Trụ & NASA, Tactical Quân Đội & Biker.
   - Bộ lọc giá, sắp xếp theo bán chạy nhất, mới nhất, đánh giá cao.
   - Modal Xem Nhanh (Quick View) hiển thị chi tiết mật độ mũi thêu (stitch count), loại sợi chỉ tơ lụa và viền merrowed.

4. **Giỏ Hàng & Thanh Toán Tự Động VietQR**:
   - Mini Cart Drawer trượt mượt mà.
   - Thanh tiến trình freeship tự động tính số tiền cần mua thêm.
   - Áp dụng mã giảm giá: `PATCHVIBE` (giảm 10%), `FREESHIP` (miễn phí vận chuyển 30k).
   - Thanh toán COD hoặc quét mã **VietQR/SePay tự động sinh mã QR** kèm số tiền và mã đơn hàng chính xác.

5. **Cẩm Nang & Hướng Dẫn Kỹ Thuật (Iron-On Guide)**:
   - 4 bước ủi patch tại nhà bằng bàn ủi gia đình bền bỉ trên 50 lần giặt máy.
   - Mục hỏi đáp thường gặp (FAQ).
   - Lookbook đánh giá thực tế của khách hàng.

---

## 🚀 Cách Mở & Sử Dụng Website

1. **Xem trực tiếp trên máy tính**:
   - Mở thư mục: `C:\Users\wh01l\.gemini\antigravity\scratch\patch-theu-store`
   - Nhấp đúp chuột vào file [index.html](file:///C:/Users/wh01l/.gemini/antigravity/scratch/patch-theu-store/index.html) để mở trên trình duyệt (Google Chrome, Microsoft Edge, Cốc Cốc, Firefox, Safari).
   - Không cần cài đặt Node.js hay Python hay build server phức tạp!

2. **Triển khai lên Internet (Deploy Online 1 Click)**:
   - Dự án là Single Page Application chuẩn HTML5/CSS/JS thuần, có thể kéo thả thư mục vào **Vercel**, **Netlify**, hoặc đẩy lên **GitHub Pages** để chạy online ngay lập tức với domain miễn phí!

---

## 📁 Cấu Trúc Thư Mục Dự Án

```
patch-theu-store/
├── index.html                   # Giao diện chính hoàn chỉnh
├── README.md                    # Tài liệu hướng dẫn sử dụng & triển khai
└── assets/
    ├── css/
    │   └── styles.css           # Hiệu ứng đường chỉ thêu, chất liệu vải denim, animation
    ├── images/                  # Bộ ảnh patch thêu thực tế độ phân giải cao & áo Jean
    │   ├── denim_jacket.jpg     # Mẫu áo Jean denim cho canvas thử đồ
    │   ├── tiger.jpg            # Patch Hổ Hoàng Gia Nhật Bản
    │   ├── cyber_skull.jpg      # Patch Đầu Lâu Cyberpunk Neon
    │   ├── ramen_cat.jpg        # Patch Mèo Thần Tài Ramen Chibi
    │   ├── astronaut.jpg        # Patch Phi Hành Gia NASA
    │   └── retro_wave.jpg       # Patch Sóng Lừng Kanagawa
    └── js/
        ├── products.js          # Dữ liệu sản phẩm & phân loại mặt sau
        ├── studio.js            # Trình mô phỏng kéo thả patch lên áo (Simulator)
        ├── calculator.js        # Bộ tính giá sỉ & lẻ đặt thêu theo yêu cầu
        ├── cart.js              # Giỏ hàng, mã giảm giá & thanh toán VietQR
        └── app.js               # Điều hướng, tìm kiếm, lọc & Quick View
```
