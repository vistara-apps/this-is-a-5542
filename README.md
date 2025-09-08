# ConnectFlow

**Smartly organize and engage your network.**

ConnectFlow is a Farcaster Frame-based application that helps users intelligently prioritize, group, and message their contacts for more efficient communication. Built with React, Tailwind CSS, and integrated with AI-powered features.

![ConnectFlow Screenshot](https://via.placeholder.com/800x400/1a1a2e/16a085?text=ConnectFlow+Dashboard)

## 🚀 Features

### Core Features

- **🧠 Intelligent Contact Prioritization**: AI-powered analysis of communication patterns to surface the most relevant contacts
- **👥 Contextual Grouping**: Create dynamic, smart contact groups based on relationships, projects, or custom tags
- **⚡ Optimized Messaging**: Fast, reliable message transmission via Farcaster protocol
- **💰 Micro-transaction Model**: Pay-per-use pricing for premium AI features

### Technical Features

- **🔗 Farcaster Integration**: Direct integration with Farcaster network for contact management
- **🤖 AI-Powered Insights**: OpenAI integration for contact analysis and group suggestions
- **💾 Real-time Database**: Supabase backend for data persistence and real-time updates
- **🔐 Wallet Authentication**: Secure authentication via RainbowKit and wagmi
- **📱 Responsive Design**: Mobile-first design with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Blockchain**: wagmi, RainbowKit, viem
- **AI**: OpenAI GPT-3.5-turbo
- **Database**: Supabase
- **Social**: Farcaster Hubs API, Neynar API
- **Icons**: Lucide React
- **Payments**: x402-axios for micro-transactions

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Farcaster account and FID
- API keys for the following services:
  - OpenAI API key
  - Neynar API key (optional, for enhanced Farcaster features)
  - Supabase project

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/vistara-apps/this-is-a-5542.git
cd this-is-a-5542
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
# Farcaster/Neynar
VITE_FARCASTER_HUB_URL=https://hub.farcaster.xyz
VITE_NEYNAR_API_KEY=your_neynar_api_key

# OpenAI
VITE_OPENAI_API_KEY=your_openai_api_key

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Authentication (optional)
VITE_PRIVY_APP_ID=your_privy_app_id
VITE_TURNKEY_API_KEY=your_turnkey_api_key
```

### 4. Database Setup

#### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the following SQL in your Supabase SQL editor:

```sql
-- Create Users table
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farcaster_profile_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Contacts table
CREATE TABLE contacts (
  contact_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  farcaster_user_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  priority_score INTEGER DEFAULT 0,
  tags TEXT[],
  relationship TEXT,
  last_interaction TIMESTAMP WITH TIME ZONE,
  interaction_frequency INTEGER DEFAULT 0,
  mutual_connections INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Contact Groups table
CREATE TABLE contact_groups (
  group_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Contact Group Members junction table
CREATE TABLE contact_group_members (
  group_id UUID REFERENCES contact_groups(group_id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(contact_id) ON DELETE CASCADE,
  PRIMARY KEY (group_id, contact_id)
);

-- Create indexes for better performance
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_priority_score ON contacts(priority_score DESC);
CREATE INDEX idx_contact_groups_user_id ON contact_groups(user_id);
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── AIInsightsPanel.jsx
│   ├── ContactGroups.jsx
│   ├── ContactList.jsx
│   ├── ContactRow.jsx
│   ├── Header.jsx
│   ├── MessagingModal.jsx
│   └── StatsCards.jsx
├── config/              # Configuration files
│   └── database.js      # Supabase configuration
├── hooks/               # Custom React hooks
│   └── usePaymentContext.js
├── services/            # API service layers
│   ├── aiService.js     # OpenAI integration
│   └── farcasterService.js # Farcaster API integration
├── utils/               # Utility functions
│   └── mockData.js      # Mock data generators
├── App.jsx              # Main application component
├── main.jsx             # Application entry point
└── index.css            # Global styles
```

## 🔧 Configuration

### API Keys Setup

#### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com)
2. Create an API key
3. Add to your `.env` file as `VITE_OPENAI_API_KEY`

#### Neynar API Key (Optional)
1. Visit [Neynar](https://neynar.com)
2. Sign up and get your API key
3. Add to your `.env` file as `VITE_NEYNAR_API_KEY`

#### Supabase Setup
1. Create a project at [Supabase](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Add to your `.env` file

### Wallet Configuration

The app uses RainbowKit for wallet connections. Supported wallets include:
- MetaMask
- WalletConnect
- Coinbase Wallet
- And many more

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Netlify Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to [Netlify](https://netlify.com)
3. Add environment variables in Netlify dashboard

### Docker Deployment

```bash
# Build the Docker image
docker build -t connectflow .

# Run the container
docker run -p 3000:3000 connectflow
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Development with Mock Data
The application includes comprehensive mock data for development. When no API keys are provided, it falls back to mock data automatically.

## 📚 API Documentation

Detailed API documentation is available in [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md).

### Key Integrations

- **Farcaster Hubs API**: For fetching user networks and sending messages
- **OpenAI API**: For AI-powered contact analysis and prioritization
- **Supabase**: For data persistence and real-time updates
- **Neynar API**: Enhanced Farcaster integration (optional)

## 🔒 Security

- API keys are handled securely through environment variables
- Wallet connections use industry-standard libraries
- User data is encrypted in transit and at rest
- No sensitive data is stored in localStorage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [API Documentation](docs/API_DOCUMENTATION.md)
- **Issues**: Open an issue on GitHub
- **Community**: Join our Discord server (coming soon)

## 🗺️ Roadmap

- [ ] **Enhanced AI Features**: More sophisticated contact analysis
- [ ] **Group Messaging**: Send messages to entire contact groups
- [ ] **Analytics Dashboard**: Detailed insights into communication patterns
- [ ] **Mobile App**: Native iOS and Android applications
- [ ] **Integration Expansion**: Support for more social platforms
- [ ] **Advanced Filtering**: Complex contact filtering and search
- [ ] **Automation**: Automated contact management rules

## 🙏 Acknowledgments

- [Farcaster](https://farcaster.xyz) for the decentralized social protocol
- [OpenAI](https://openai.com) for AI capabilities
- [Supabase](https://supabase.com) for the backend infrastructure
- [RainbowKit](https://rainbowkit.com) for wallet connection UI

---

**Built with ❤️ for the Farcaster community**
