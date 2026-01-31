<div align="center">
  <img src="public/icon.svg" alt="Open Network Logo" width="120" height="120">
  
  # Open Network
  
  **Bộ Công Cụ Phân Tích Mạng WiFi Toàn Diện**
  
  Ứng dụng desktop đẹp mắt, đa nền tảng để phân tích mạng WiFi, giám sát tín hiệu và chẩn đoán mạng.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)]()
[![Electron](https://img.shields.io/badge/Electron-28-47848F.svg?logo=electron)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)](https://react.dev/)

[🇺🇸 English](README.md) | [🇻🇳 Tiếng Việt](#tính-năng)

</div>

---

## ✨ Tính Năng

### 📡 Quét WiFi

- Phát hiện thời gian thực tất cả mạng WiFi gần đó
- Hiển thị cường độ tín hiệu với cập nhật trực tiếp
- Phân tích kênh để tìm kênh ít nhiễu nhất
- Nhận diện giao thức bảo mật (WPA3, WPA2, WPA, WEP, Mở)
- Phát hiện nhà sản xuất thông qua địa chỉ MAC

### 📊 Phân Tích Tín Hiệu

- Theo dõi cường độ tín hiệu theo thời gian thực
- Phân tích nhiễu kênh
- Biểu đồ phân bố bảo mật
- So sánh băng tần (2.4 GHz vs 5 GHz vs 6 GHz)

### 🛠️ Hộp Công Cụ Mạng

- **Test Tốc Độ**: Đo băng thông thực tế sử dụng máy chủ Cloudflare
- **Ping**: Kiểm tra độ trễ mạng và mất gói
- **Quét Mạng Nội Bộ**: Khám phá các thiết bị trong mạng của bạn

### 🎨 Thiết Kế Hiện Đại

- Giao diện vibrancy kiểu macOS với hiệu ứng glassmorphism
- Chế độ Tối và Sáng với tự động phát hiện hệ thống
- Hoạt ảnh mượt mà và micro-interactions
- Điều hướng sidebar responsive

---

## 📥 Tải Xuống

### Phiên Bản Mới Nhất

| Nền Tảng   | Tải Xuống                                                                        | Kiến Trúc                         |
| ---------- | -------------------------------------------------------------------------------- | --------------------------------- |
| 🍎 macOS   | [Open Network.dmg](https://github.com/pin705/open-network/releases/latest)       | Universal (Intel + Apple Silicon) |
| 🪟 Windows | [Open Network Setup.exe](https://github.com/pin705/open-network/releases/latest) | x64                               |
| 🐧 Linux   | [Open Network.AppImage](https://github.com/pin705/open-network/releases/latest)  | x64                               |

> 📌 **Lưu ý**: Link tải sẽ có sẵn khi bản release đầu tiên được xuất bản.

---

## 🚀 Bắt Đầu

### Yêu Cầu Hệ Thống

- **Node.js** 18+
- **pnpm** (khuyến nghị) hoặc npm

### Cài Đặt

1. **Clone repository**

   ```bash
   git clone https://github.com/your-pin705/open-network.git
   cd open-network
   ```

2. **Cài đặt dependencies**

   ```bash
   pnpm install
   # hoặc
   npm install
   ```

3. **Khởi động server phát triển**

   ```bash
   pnpm dev
   # hoặc
   npm run dev
   ```

4. **Build cho production**
   ```bash
   pnpm build
   # hoặc
   npm run build
   ```

### Các Lệnh Phát Triển

| Lệnh              | Mô Tả                                      |
| ----------------- | ------------------------------------------ |
| `pnpm dev`        | Khởi động server phát triển với hot reload |
| `pnpm build`      | Build cho production                       |
| `pnpm preview`    | Xem trước bản build production             |
| `pnpm lint`       | Chạy ESLint                                |
| `pnpm type-check` | Kiểm tra kiểu TypeScript                   |

---

## 🏗️ Cấu Trúc Dự Án

```
open-network/
├── electron/               # Electron main process
│   ├── main.ts            # Entry point chính
│   ├── preload.ts         # Preload script cho IPC
│   ├── types.ts           # Kiểu TypeScript dùng chung
│   └── services/          # Các service backend
│       ├── wifi-scanner.ts    # Quét WiFi đa nền tảng
│       ├── network-tools.ts   # Ping, speed test, ARP scan
│       └── oui-lookup.ts      # Tra cứu vendor MAC
├── src/                    # React frontend
│   ├── components/        # Components UI tái sử dụng
│   │   ├── ui/           # shadcn/ui components
│   │   ├── layout/       # Layout components
│   │   ├── dashboard/    # Dashboard widgets
│   │   ├── scanner/      # Scanner components
│   │   └── analytics/    # Biểu đồ phân tích
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── stores/           # Zustand state stores
│   ├── lib/              # Tiện ích và helpers
│   └── index.css         # Styles toàn cục
├── public/               # Assets tĩnh
└── package.json
```

---

## 🔧 Công Nghệ Sử Dụng

| Danh Mục      | Công Nghệ               |
| ------------- | ----------------------- |
| **Framework** | Electron 28             |
| **Frontend**  | React 18, TypeScript    |
| **Styling**   | Tailwind CSS, shadcn/ui |
| **State**     | Zustand                 |
| **Charts**    | Recharts                |
| **Build**     | Vite, electron-builder  |
| **Icons**     | Lucide React            |

---

## 🤝 Đóng Góp

Chào mừng mọi đóng góp! Vui lòng gửi Pull Request.

1. Fork repository
2. Tạo branch tính năng (`git checkout -b feature/TinhNangMoi`)
3. Commit thay đổi (`git commit -m 'Thêm tính năng mới'`)
4. Push lên branch (`git push origin feature/TinhNangMoi`)
5. Mở Pull Request

---

## 📄 Giấy Phép

Dự án này được cấp phép theo Giấy phép MIT - xem file [LICENSE](LICENSE) để biết chi tiết.

---

## 🙏 Lời Cảm Ơn

- [shadcn/ui](https://ui.shadcn.com/) - Components UI đẹp
- [Recharts](https://recharts.org/) - Components biểu đồ
- [Lucide](https://lucide.dev/) - Icons
- [Electron](https://www.electronjs.org/) - Hỗ trợ desktop đa nền tảng

---

<div align="center">
  Made with ❤️ by Open Network Team
</div>
