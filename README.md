# Rinku AI

An assistive MVP for people with Alzheimer's/dementia. Rinku helps identify loved ones in-the-moment and gently reminds the user of the relationship via spoken audio.

## Architecture

```
rinku/
├── project/
│   ├── backend/     # Node.js + Express + MongoDB (ESM JavaScript)
│   └── frontend/    # Expo React Native app
└── README.md
```

### Backend

- **Node.js + Express** with ES Modules (ESM)
- **MongoDB** with Mongoose for data persistence
- **Zod** for runtime request validation
- **ElevenLabs TTS** for generating relationship audio

### Mobile (Expo)

- **Expo React Native** with TypeScript
- **Expo Router** for file-based navigation
- **Expo Camera** for face preview (stub for future recognition)
- **Expo AV** for audio playback

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/people` | List all loved ones |
| POST | `/people` | Create a loved one |
| GET | `/people/:id` | Get one person |
| PUT | `/people/:id` | Update a person |
| DELETE | `/people/:id` | Delete a person |
| POST | `/speech/relationship` | Get audio URL for a person |
| GET | `/speech/relationship/:id` | Stream MP3 audio |

## Getting Started
x
### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- ElevenLabs API key (for TTS)
- Expo Go app (for mobile testing)

### Backend Setup

```bash
cd project/backend

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your values:
#   - MONGO_URL: your MongoDB connection string
#   - ELEVEN_API_KEY: your ElevenLabs API key
#   - ELEVEN_VOICE_ID: the voice ID to use

# Start development server
npm run dev
```

The backend will run on `http://localhost:4000`.

Test the health endpoint:
```bash
curl http://localhost:4000/health
# Response: {"ok":true,"service":"rinku"}
```

### Frontend Setup

```bash
cd project/frontend

# Install dependencies
npm install

# Start Expo
npm start
```

Scan the QR code with Expo Go to run on your device.

### ⚠️ Important: LAN IP for Device Testing

When testing on a physical device, the mobile app needs to reach your backend. By default, the app tries to detect your development machine's IP.

If it doesn't work, set `EXPO_PUBLIC_API_URL` in your environment:

```bash
# Find your LAN IP (e.g., 192.168.1.100)
# On Mac: ipconfig getifaddr en0
# On Linux: hostname -I

# Then start Expo with the env var
EXPO_PUBLIC_API_URL=http://192.168.1.100:4000 npm start
```

## Data Model

### Person

```javascript
{
  _id: "ObjectId",
  displayName: "Gabriel Martinez",    // Required - full name
  familiarName: "Gabi",               // Optional - nickname they use
  relationship: "grandson",            // Required - relationship to user
  prompts: [{ text: "..." }],         // Optional - memory prompts
  photos: [{ uri: "..." }],           // Optional - for future face matching
  relationshipAudioUrl: "...",        // Optional - cached audio URL
  createdAt: "ISO date",
  updatedAt: "ISO date"
}
```

## App Screens

1. **Home** - Navigation hub with links to other screens
2. **Loved Ones** - List all people added to the system
3. **Add Loved One** - Form to create a new person
4. **Recognize** - Camera preview with "Who is this?" button (MVP uses first person)

## How It Works (MVP Flow)

1. Caregiver adds loved ones via the mobile app
2. User opens the Recognize screen and taps "Who is this?"
3. App fetches the first person and requests TTS audio from backend
4. ElevenLabs generates: *"I think this is Gabi, your grandson."*
5. Audio plays through the device speaker

## What's Stubbed (Future Work)

- **Face Recognition**: Currently selects the first person. Future: on-device face matching for privacy.
- **Photo Management**: Photos field exists but not used yet.
- **Memory Prompts**: Stored but not spoken yet.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 4xx on POST requests | Check request body matches Zod schema |
| Audio not playing | Verify ElevenLabs env vars are set |
| CORS errors | Ensure backend has CORS enabled (it does by default) |
| Empty people list | Check MongoDB connection and database name |
| Can't connect from device | Use LAN IP, not localhost |

## Environment Variables

### Backend (.env)

```
PORT=4000
MONGO_URL
ELEVEN_API_KEY
ELEVEN_VOICE_ID
```

### Frontend

```
EXPO_PUBLIC_API_URL=http://192.168.1.100:4000
```

## License

ISC
