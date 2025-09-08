# ConnectFlow API Documentation

## Overview

ConnectFlow integrates with multiple APIs to provide intelligent contact management and messaging capabilities for Farcaster users.

## API Integrations

### 1. Farcaster Hubs API / Neynar API

**Purpose**: Fetching user's network (followers/following) and basic profile information to populate contacts. Sending messages via Farcaster protocol.

**Base URLs**:
- Farcaster Hub: `https://hub.farcaster.xyz`
- Neynar API: `https://api.neynar.com/v2`

**Authentication**: 
- Neynar requires API key in headers: `api_key: YOUR_NEYNAR_API_KEY`
- Hub API uses direct protocol access

#### Key Endpoints

##### Get User Profile
```javascript
// Neynar
GET /farcaster/user?fid={fid}

// Hub API
GET /v1/userDataByFid?fid={fid}
```

##### Get User Following
```javascript
// Neynar
GET /farcaster/following?fid={fid}&limit={limit}

// Hub API
GET /v1/linksByFid?fid={fid}&link_type=follow
```

##### Get User Followers
```javascript
// Neynar
GET /farcaster/followers?fid={fid}&limit={limit}

// Hub API
GET /v1/linksByTargetFid?target_fid={fid}&link_type=follow
```

##### Send Direct Cast
```javascript
// Neynar only
POST /farcaster/cast
{
  "signer_uuid": "string",
  "text": "message content",
  "parent": null,
  "embeds": [],
  "channel_id": null
}
```

### 2. OpenAI API

**Purpose**: Power the 'Intelligent Contact Prioritization' feature by analyzing communication patterns. Generate group suggestions and message recommendations.

**Base URL**: `https://api.openai.com/v1`

**Authentication**: Bearer token in headers: `Authorization: Bearer YOUR_OPENAI_API_KEY`

#### Key Endpoints

##### Chat Completions
```javascript
POST /chat/completions
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant..."
    },
    {
      "role": "user", 
      "content": "Analyze these contacts..."
    }
  ],
  "temperature": 0.3,
  "max_tokens": 2000
}
```

### 3. Supabase API

**Purpose**: Storing user data, contact groupings, and caching Farcaster data for faster access. Managing user accounts and application state.

**Base URL**: `https://your-project.supabase.co/rest/v1`

**Authentication**: 
- API Key in headers: `apikey: YOUR_SUPABASE_ANON_KEY`
- JWT token for authenticated requests: `Authorization: Bearer JWT_TOKEN`

#### Database Schema

##### Users Table
```sql
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farcaster_profile_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

##### Contacts Table
```sql
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
```

##### Contact Groups Table
```sql
CREATE TABLE contact_groups (
  group_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

##### Contact Group Members Table
```sql
CREATE TABLE contact_group_members (
  group_id UUID REFERENCES contact_groups(group_id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(contact_id) ON DELETE CASCADE,
  PRIMARY KEY (group_id, contact_id)
);
```

#### Key Operations

##### Create User
```javascript
POST /users
{
  "farcaster_profile_id": "12345",
  "created_at": "2024-01-01T00:00:00Z",
  "last_active_at": "2024-01-01T00:00:00Z"
}
```

##### Get Contacts
```javascript
GET /contacts?user_id=eq.{user_id}&order=priority_score.desc
```

##### Create Contact Group
```javascript
POST /contact_groups
{
  "user_id": "uuid",
  "name": "Close Friends",
  "description": "My closest connections"
}
```

### 4. Privy/Turnkey Authentication API

**Purpose**: Facilitating user authentication via wallet connection and enabling on-chain actions or payments for micro-transactions.

**Base URLs**:
- Privy: `https://auth.privy.io`
- Turnkey: `https://api.turnkey.com`

#### Privy Integration

##### Login
```javascript
POST /auth/login
{
  "wallet_address": "0x...",
  "signature": "signature_data",
  "message": "signed_message"
}
```

#### Turnkey Integration

##### Create Wallet
```javascript
POST /wallets/create
{
  "organization_id": "org_id",
  "wallet_name": "user_wallet",
  "accounts": [...]
}
```

## Service Layer Implementation

### FarcasterService

```javascript
import { getUserProfile, getUserNetwork, sendDirectCast } from './services/farcasterService';

// Get user's complete network
const network = await getUserNetwork(userFid);

// Send a message
await sendDirectCast(fromFid, toFid, message, signerUuid);
```

### AIService

```javascript
import { analyzeContactPriority, suggestContactGroups } from './services/aiService';

// Analyze and prioritize contacts
const result = await analyzeContactPriority(contacts, userContext);

// Get group suggestions
const suggestions = await suggestContactGroups(contacts);
```

### Database Service

```javascript
import { createUser, getContactsByUserId, createContactGroup } from './config/database';

// Create new user
const user = await createUser({
  farcaster_profile_id: '12345'
});

// Get user's contacts
const contacts = await getContactsByUserId(user.user_id);
```

## Error Handling

### Common Error Responses

#### Rate Limiting
```javascript
{
  "error": "rate_limit_exceeded",
  "message": "Too many requests",
  "retry_after": 60
}
```

#### Authentication Error
```javascript
{
  "error": "unauthorized",
  "message": "Invalid API key or token"
}
```

#### Validation Error
```javascript
{
  "error": "validation_error",
  "message": "Invalid input parameters",
  "details": {
    "field": "error description"
  }
}
```

## Environment Variables

```bash
# Farcaster/Neynar
VITE_FARCASTER_HUB_URL=https://hub.farcaster.xyz
VITE_NEYNAR_API_KEY=your_neynar_api_key

# OpenAI
VITE_OPENAI_API_KEY=your_openai_api_key

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Authentication
VITE_PRIVY_APP_ID=your_privy_app_id
VITE_TURNKEY_API_KEY=your_turnkey_api_key
```

## Rate Limits

- **Neynar API**: 1000 requests/hour (free tier)
- **OpenAI API**: Varies by plan, typically 3 RPM for free tier
- **Supabase**: 500 requests/second (free tier)
- **Farcaster Hub**: No official limits, but recommended to be respectful

## Security Considerations

1. **API Keys**: Never expose API keys in client-side code in production
2. **Authentication**: Always validate user signatures before processing requests
3. **Rate Limiting**: Implement client-side rate limiting to avoid hitting API limits
4. **Data Privacy**: Follow GDPR/privacy regulations when storing user data
5. **Wallet Security**: Use secure wallet connection libraries and validate signatures

## Testing

### Mock Data
The application includes mock data generators for development:

```javascript
import { generateMockContacts } from './utils/mockData';

const mockContacts = generateMockContacts(50);
```

### API Testing
Use environment variables to switch between production and test endpoints:

```javascript
const API_BASE = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000' 
  : 'https://api.connectflow.app';
```
