# 🌐 Open Network

**The Ultimate Wireless Intelligence Suite**

Open Network là một ứng dụng Desktop (xây dựng trên Electron + React) cung cấp giải pháp toàn diện để quét, phân tích và tối ưu hóa các mạng không dây xung quanh bạn.

![Open Network Dashboard](./screenshots/dashboard.png)

---

## ✨ Tính năng chính

### 📡 WiFi Scanner

- **Quét toàn diện**: Hiển thị SSID, BSSID, cường độ tín hiệu (RSSI) và kênh
- **Nhận diện thiết bị**: Tự động tra cứu OUI để biết hãng sản xuất (Apple, Cisco, TP-Link...)
- **Phân tích bảo mật**: Gắn nhãn và cảnh báo các mạng sử dụng giao thức yếu (WEP, WPA)
- **Lọc thông minh**: Filter theo băng tần (2.4GHz/5GHz) hoặc cường độ tín hiệu

### 📊 Signal Analytics

- **Real-time Charts**: Biểu đồ đường theo dõi độ ổn định tín hiệu theo thời gian thực
- **Channel Interference**: Biểu đồ cột hiển thị sự chồng chéo giữa các kênh WiFi
- **Security Overview**: Phân tích phân bố các giao thức bảo mật trong vùng phủ sóng
- **Band Distribution**: So sánh mật độ mạng 2.4GHz vs 5GHz vs 6GHz

### 🛠 Network Toolbox

- **Speed Test**: Đo tốc độ download/upload ngay trong app
- **Ping & Latency**: Kiểm tra độ trễ tới các server phổ biến
- **Local Network Scanner**: Quét và liệt kê tất cả thiết bị trong mạng LAN

---

## 🚀 Cài đặt

### Yêu cầu hệ thống

- Node.js 18+
- npm hoặc pnpm

### Development

```bash
# Clone repository
git clone https://github.com/yourname/open-network.git
cd open-network

# Cài đặt dependencies
npm install

# Chạy development mode
npm run dev
```

### Build Production

```bash
# Build cho platform hiện tại
npm run electron:build

# Build files sẽ được tạo trong thư mục /release
```

---

## 🎨 Screenshots

<details>
<summary>Dashboard</summary>

- Tổng quan số lượng networks
- Thông tin network đang kết nối
- Biểu đồ signal real-time
- Phân bố channel

</details>

<details>
<summary>WiFi Scanner</summary>

- Bảng dữ liệu đầy đủ với sorting/filtering
- Signal strength indicators
- Security badges
- Export to CSV

</details>

<details>
<summary>Analytics</summary>

- Signal strength tracking
- Channel interference analysis
- Security protocol distribution
- Band comparison

</details>

---

## 🔧 Công nghệ sử dụng

| Category         | Technology               |
| ---------------- | ------------------------ |
| Framework        | Electron 28 + React 18   |
| Build Tool       | Vite                     |
| UI Library       | shadcn/ui + Tailwind CSS |
| Charts           | Recharts                 |
| State Management | Zustand                  |
| Icons            | Lucide React             |

---

## 📁 Cấu trúc dự án

```
open-network/
├── electron/                 # Electron main process
│   ├── main.ts              # Entry point
│   ├── preload.ts           # Context bridge
│   └── services/
│       ├── wifi-scanner.ts  # Platform-specific WiFi scanning
│       ├── network-tools.ts # Ping, speedtest, ARP scan
│       └── oui-lookup.ts    # MAC vendor lookup
├── src/                     # React renderer
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Sidebar, Header
│   │   ├── dashboard/       # Dashboard widgets
│   │   ├── scanner/         # WiFi scanner components
│   │   └── analytics/       # Charts & visualizations
│   ├── pages/               # Route pages
│   ├── hooks/               # Custom React hooks
│   ├── stores/              # Zustand stores
│   └── lib/                 # Utilities
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

---

## ⚠️ Lưu ý về Permissions

Để app hoạt động tốt nhất, Open Network cần một số quyền hệ thống:

### macOS

- **Location Services**: Cần để truy cập WiFi scan API
- App sử dụng airport utility có sẵn trong hệ thống

### Windows

- Chạy với quyền Administrator để quét đầy đủ
- Sử dụng `netsh wlan` commands

### Linux

- Cần quyền sudo cho một số tính năng
- Sử dụng `nmcli` (NetworkManager) hoặc `iwlist`

---

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Mở Pull Request

---

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

## 🙏 Credits

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Recharts](https://recharts.org/) - Charting library
- [Lucide](https://lucide.dev/) - Icon library
- [Electron](https://electronjs.org/) - Desktop framework

---

<p align="center">
  Made with ❤️ by the Open Network Team
</p>
