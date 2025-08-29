# FIT CHAIN - Decentralized Fitness Challenges Platform

FIT CHAIN is a revolutionary decentralized application that combines fitness challenges with blockchain technology, allowing users to participate in peer-to-peer (P2P) and player-vs-computer (P2C) fitness challenges with cryptocurrency stakes.

## 🚀 Core Features

- **P2P Challenges**: Create and join fitness challenges with other users
- **P2C Challenges**: Compete against computer-set fitness goals
- **Smart Contract Integration**: Secure stake management and automatic reward distribution
- **Leather Wallet Integration**: Seamless blockchain transactions
- **Real-time Activity Tracking**: Monitor challenge progress and performance

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14
- **UI Library**: React
- **Styling**: Tailwind CSS
- **Components**: Radix UI
- **State Management**: React Context API
- **API Integration**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **File System**: Native Node.js fs module
- **API Handling**: Axios for external services

### Blockchain
- **Network**: Stacks Blockchain (Testnet)
- **Smart Contracts**: Clarity
- **Wallet**: Leather Wallet (@stacks/connect)
- **Contract Interactions**: @stacks/transactions

### Development Tools
- TypeScript
- ESLint
- Prettier
- Clarinet (Smart Contract Testing)

## 🔧 Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/notaravinth/original.git
   cd original
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd ../backend
   npm install
   ```

4. Set up environment variables:
   Create `.env.local` in the frontend directory:
   ```
   NEXT_PUBLIC_STACKS_NETWORK=testnet
   NEXT_PUBLIC_API_URL=http://localhost:3002
   ```

5. Start the backend server:
   ```bash
   cd backend
   node server.js
   ```

6. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

## 🔗 Smart Contract Deployment

- **Contract Address**: ST2MH6J79AVRMTK99RWTFCCFZE5YZP175TZD8JGV0
- **Network**: Stacks Testnet
- **Contracts**:
  - Escrow Contract: Manages challenge stakes and rewards
  - Platform Token Contract: Implements SIP-010 token standard

## 🎮 How to Use

1. **Connect Wallet**
   - Click "Connect Wallet" in the navigation bar
   - Authenticate with your Leather wallet

2. **Create a Challenge**
   - Navigate to the P2P or P2C section
   - Set your challenge parameters
   - Stake your tokens

3. **Join a Challenge**
   - Browse available challenges
   - Join by staking the required amount
   - Start tracking your activities

4. **Complete Challenges**
   - Track your progress
   - Meet the challenge requirements
   - Claim rewards upon successful completion

## 👥 Development Team

- [Developer Name] - Full Stack Developer & Smart Contract Engineer
- [Add team members if applicable]

## 🎥 Demo

[Add links to demo video or screenshots when available]

## 📄 License

MIT License

---

Built with ❤️ for ETHIndia 2024