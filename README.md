# StreetConnect

A mobile-first web app to help people experiencing homelessness (and outreach workers) quickly find nearby services like shelters, food, showers, and clinics.

## Features

- **No account required** - Just open and use
- **Mobile-first design** - Large tap targets, high contrast, simple language
- **Works offline** - Caches data locally for low-connectivity situations
- **Location-aware** - Sort services by distance (optional)
- **Comprehensive filters** - Open now, distance, pets allowed, wheelchair accessible, no ID required
- **Category browsing** - Shelter, Food, Showers, Laundry, Medical, Mental Health, Day Centers, ID & Legal
- **Detailed service info** - Hours, eligibility, accessibility, notes

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd streetconnect

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Run Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

## Project Structure

```
streetconnect/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── about/             # About page
│   ├── services/[id]/     # Service detail page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx
│   ├── CategorySelector.tsx
│   ├── CategoryButton.tsx
│   ├── FilterBar.tsx
│   ├── SearchBar.tsx
│   ├── ServiceCard.tsx
│   ├── ServiceList.tsx
│   ├── LocationPrompt.tsx
│   ├── Onboarding.tsx
│   └── CacheStatus.tsx
├── lib/                   # Utility functions
│   ├── data.ts           # Data loading
│   ├── location.ts       # Geolocation & distance
│   ├── hours.ts          # Open/closed logic
│   ├── filters.ts        # Service filtering
│   ├── cache.ts          # Offline caching
│   └── categories.ts     # Category definitions
├── types/                 # TypeScript types
│   └── index.ts
├── data/                  # Static data
│   ├── services.json     # Service directory
│   └── config.json       # App configuration
├── __tests__/            # Unit tests
│   ├── hours.test.ts
│   ├── location.test.ts
│   └── filters.test.ts
└── public/               # Static assets
    └── manifest.json     # PWA manifest
```

## Customization

### Change City/Region

Edit `data/config.json`:

```json
{
  "cityName": "Your City",
  "regionName": "Your County/Region",
  "defaultCenter": {
    "lat": 34.0522,
    "lng": -118.2437
  },
  "defaultRadiusKm": 10
}
```

### Add/Edit Services

Edit `data/services.json`. Each service follows this schema:

```typescript
{
  "id": "unique-service-id",
  "name": "Service Name",
  "categories": ["shelter", "food"],  // See ServiceCategory type
  "descriptionShort": "Brief description (1-2 lines)",
  "descriptionLong": "Optional longer description",
  "phone": "(555) 123-4567",
  "website": "https://example.org",
  "address": {
    "street": "123 Main St",
    "city": "Los Angeles",
    "state": "CA",
    "postalCode": "90001",
    "lat": 34.0522,      // Optional but recommended
    "lng": -118.2437     // Optional but recommended
  },
  "hours": {
    "monday": { "open": "09:00", "close": "17:00" },
    "tuesday": { "open": "09:00", "close": "17:00" },
    // ... other days
    "saturday": { "open": null, "close": null }  // Closed
  },
  "eligibility": {
    "minAge": 18,
    "maxAge": 24,
    "genderRestrictions": "all_genders",  // or "women_only", "men_only"
    "familiesAllowed": true,
    "singlesAllowed": true,
    "lgbtqFriendly": true,
    "requiresID": false,
    "requiresSobriety": false,
    "description": "Who can use this service"
  },
  "accessibility": {
    "wheelchairAccessible": true,
    "petsAllowed": false,
    "serviceAnimalsAllowed": true,
    "languages": ["English", "Spanish"]
  },
  "flags": {
    "noIDRequired": true,
    "lowBarrier": true,
    "youthFocused": false
  },
  "notes": [
    "Important note 1",
    "Important note 2"
  ],
  "lastVerified": "2024-12-01T00:00:00Z"
}
```

### Available Categories

- `shelter` - Emergency shelters, transitional housing
- `food` - Meals, food banks, food pantries
- `showers` - Hygiene facilities, showers
- `laundry` - Laundry services
- `medical` - Medical clinics, health services
- `mental_health` - Mental health services, counseling
- `day_center` - Day centers, drop-in centers
- `id_legal` - ID assistance, legal services
- `other` - Other services

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest
- **Data**: Static JSON files

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Data Sources

Service data should be verified regularly. Sources may include:
- 211 LA County
- Local homeless services authorities
- Direct contact with service providers

## Privacy

- No user accounts or sign-ups required
- Location data stays on the user's device
- No analytics or tracking (by default)
- No personal data collected

## License

MIT License - see LICENSE file for details

## Acknowledgments

Built to help connect people to the services they need.
