<div align="center">
  <img src="public/icon.svg" alt="Open Network Logo" width="120" height="120">
  
  # Open Network
  
  **The Ultimate Wireless Intelligence Suite**
  
  A beautiful, cross-platform desktop application for WiFi network analysis, signal monitoring, and network diagnostics.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)]()
[![Electron](https://img.shields.io/badge/Electron-28-47848F.svg?logo=electron)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)](https://react.dev/)

[🇺🇸 English](#features) | [🇻🇳 Tiếng Việt](README.vi.md)

</div>

---

## ✨ Features

### 📡 WiFi Scanner

- Real-time detection of all nearby wireless networks
- Signal strength visualization with live updates
- Channel analysis to find the least congested channel
- Security protocol identification (WPA3, WPA2, WPA, WEP, Open)
- Manufacturer detection via MAC address OUI lookup

### 📊 Signal Analytics

- Real-time signal strength tracking over time
- Channel interference analysis
- Security distribution charts
- Frequency band comparison (2.4 GHz vs 5 GHz vs 6 GHz)

### 🛠️ Network Toolbox

- **Speed Test**: Real bandwidth measurement using Cloudflare's servers
- **Ping Tool**: Network latency and packet loss testing
- **Local Network Scanner**: Discover devices on your network

### 🎨 Modern Design

- macOS-inspired vibrancy UI with glassmorphism effects
- Dark and Light mode with automatic system detection
- Smooth animations and micro-interactions
- Responsive sidebar navigation

---

## 📥 Download

### Latest Release

| Platform   | Download                                                                         | Architecture                      |
| ---------- | -------------------------------------------------------------------------------- | --------------------------------- |
| 🍎 macOS   | [Open Network.dmg](https://github.com/pin705/open-network/releases/latest)       | Universal (Intel + Apple Silicon) |
| 🪟 Windows | [Open Network Setup.exe](https://github.com/pin705/open-network/releases/latest) | x64                               |
| 🐧 Linux   | [Open Network.AppImage](https://github.com/pin705/open-network/releases/latest)  | x64                               |

> 📌 **Note**: Download links will be available once the first release is published.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **pnpm** (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/pin705/open-network.git
   cd open-network
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Build for production**
   ```bash
   pnpm build
   # or
   npm run build
   ```

### Development Commands

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `pnpm dev`        | Start development server with hot reload |
| `pnpm build`      | Build for production                     |
| `pnpm preview`    | Preview production build                 |
| `pnpm lint`       | Run ESLint                               |
| `pnpm type-check` | Run TypeScript type checking             |

---

## 🏗️ Project Structure

```
open-network/
├── electron/               # Electron main process
│   ├── main.ts            # Main entry point
│   ├── preload.ts         # Preload script for IPC
│   ├── types.ts           # Shared TypeScript types
│   └── services/          # Backend services
│       ├── wifi-scanner.ts    # Cross-platform WiFi scanning
│       ├── network-tools.ts   # Ping, speed test, ARP scan
│       └── oui-lookup.ts      # MAC vendor lookup
├── src/                    # React frontend
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── layout/       # Layout components
│   │   ├── dashboard/    # Dashboard widgets
│   │   ├── scanner/      # Scanner components
│   │   └── analytics/    # Analytics charts
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── stores/           # Zustand state stores
│   ├── lib/              # Utilities and helpers
│   └── index.css         # Global styles
├── public/               # Static assets
└── package.json
```

---

## 🔧 Technology Stack

| Category      | Technology              |
| ------------- | ----------------------- |
| **Framework** | Electron 28             |
| **Frontend**  | React 18, TypeScript    |
| **Styling**   | Tailwind CSS, shadcn/ui |
| **State**     | Zustand                 |
| **Charts**    | Recharts                |
| **Build**     | Vite, electron-builder  |
| **Icons**     | Lucide React            |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Recharts](https://recharts.org/) for chart components
- [Lucide](https://lucide.dev/) for icons
- [Electron](https://www.electronjs.org/) for cross-platform desktop support

---

<div align="center">
  Made with ❤️ by the Open Network Team
</div>
