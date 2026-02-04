# Wedding Guest QR Scan System 💒

A beautiful web-based system for scanning wedding guest QR codes using your laptop camera. Features digital invitation generation with embedded QR codes, VIP guest celebrations, and real-time dashboard.

## ✨ Features

- **📋 Guest Management**: Add guests with VIP status
- **📩 Digital Invitations**: Generate beautiful invitations with embedded QR codes
- **📷 QR Scanner**: Scan guests using laptop camera
- **🌟 VIP Celebration**: Special confetti animation for VIP guests
- **📊 Dashboard**: Real-time statistics on guest check-ins
- **🌙 Dark Theme**: Elegant rose gold and gold color scheme

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
# Navigate to project
cd wedding-guest-scan

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

## ⚙️ Configuration

Edit `src/config/wedding.json` to customize your wedding details:

```json
{
  "bride": "Your Name",
  "groom": "Partner Name",
  "date": "February 14, 2026",
  "time": "10:00 AM",
  "venue": "Your Venue",
  "message": "We would be honored by your presence"
}
```

## 📁 Project Structure

```
src/
├── config/           # Wedding configuration
├── components/ui/    # Chakra UI components
├── constants/        # App constants
├── hooks/            # Custom React hooks
├── pages/            # Page components
│   ├── HomePage.tsx      # Dashboard
│   ├── GuestsPage.tsx    # Guest management
│   ├── InvitationPage.tsx # Invitation generator
│   └── ScannerPage.tsx   # QR scanner
├── theme/            # Chakra UI theme
├── types/            # TypeScript types
└── utils/            # Utility functions
```

## 🎨 Tech Stack

- **React + TypeScript** - Frontend framework
- **Vite** - Build tool
- **Chakra UI v3** - Component library
- **Framer Motion** - Animations
- **html5-qrcode** - QR code scanner
- **qrcode** - QR code generator
- **canvas-confetti** - Celebration effects
- **html-to-image** - Invitation download

## 📝 Usage

1. **Add Guests**: Go to Guest Management, add names and mark VIP guests
2. **Generate Invitations**: Click "Invitation" for each guest to download their digital invitation
3. **Share**: Send invitations to guests via WhatsApp/Email
4. **Scan at Event**: Use the Scanner page to check in guests as they arrive

## 🔊 Sound Files (Optional)

Add sound files to `public/sounds/`:

- `success.mp3` - Regular guest check-in sound
- `vip-success.mp3` - VIP guest check-in sound

## 📄 License

MIT
